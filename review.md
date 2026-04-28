# Volt — Code Review

A focus/deep-work tracker for macOS, packaged as an Electron app with a React + TypeScript renderer. The codebase is small (~4.7k LOC), well-organized, and free of obvious correctness bugs. The notes below are the items still outstanding after the first cleanup pass — high-priority security/perf/i18n items have been addressed.

---

## 1. Project at a glance

**Stack**
- Electron 39, electron-vite, TypeScript 5.9
- React 19 + Zustand (renderer)
- electron-store (JSON persistence on disk)
- electron-updater (silent auto-update)
- Tailwind v4 (loaded but the codebase uses inline styles + CSS vars almost everywhere)

**Architecture**
- `src/main` — windows (tray / main / floating), tray icon, IPC, electron-store wrapper, focus timer, power-monitor pause hook, morning-reminder scheduler, auto-updater.
- `src/preload` — exposes a typed `window.api` over `contextBridge`.
- `src/renderer` — single React app routed via `window.location.hash` to one of `MenuDropdown` (`/tray`), `MainWindow` (`/main`), `Onboarding`, or `MorningRitual`. State lives in a Zustand store hydrated from main and kept in sync via a `store:state-changed` broadcast.
- `src/shared` — types and IPC channel constants.

**What works well**
- Clean main/preload/renderer separation; preload surface is small and typed (`DailyApi`).
- Hash routing keeps four UIs in one bundle without a router dep — appropriate for the size.
- `applySettingsSideEffects` is correctly called as the single source of truth for dock visibility and login-item state — the IPC handlers explicitly defer to it (with a clear comment).
- Power-monitor pause on `suspend` / `lock-screen` / `shutdown` is a thoughtful detail; combined with `recoverInterruptedSession` on launch it makes the timer durable across crashes.
- `ShellOpenExternal` validates the URL scheme (`https?:` / `mailto:`) before delegating — and now `setWindowOpenHandler` uses the same allow-list.
- Schema migrations are now versioned (`schemaVersion` + a migrations array) — future migrations slot in cleanly.
- Persistence is debounced for free-text fields, and the `store:state-changed` reducer skips slices that didn't change, so unrelated windows no longer re-render on every keystroke.
- The `<60s = misclick, discard` rule in `stopTimer` is a nice piece of product polish.

---

## 2. Outstanding items worth doing

### 2.1 Reminder-time UX could go further

The reminder time is now user-configurable (the `reminder_time_label` row appears when the toggle is on, with a `type="time"` input). Two small follow-ups:

- The reminder copy still says "A notification if you haven't checked in yet." — consider mentioning the chosen time, or adding a "Test reminder now" button outside the dev block so users can verify it.
- `parseReminderTime` is permissive (silently falls back to 10:00 on malformed input). That's fine for the `<input type="time">` path, but if the value is ever editable as raw text, surface a validation error instead.

### 2.2 The renderer state mutator is still named `setHydrated`

We added `replaceState` (used by the broadcast listener) but `setHydrated` is still kept around for the initial hydration. The two paths now do different things, which is good — but if you expand the store, consider folding the initial fetch into `replaceState` + a one-shot `setHydrated(true)` call to make the contract explicit.

### 2.3 i18n is now wired through, but a couple of edges remain

Date/weekday formatting now flows through the language setting:
- `todayLong`, `fmtTimeOfDay`, `fmtMonthYear`, `fmtFullDate` accept a `Language`.
- The calendar uses Monday-first when the language is Norwegian and the weekday header is generated from `Intl.DateTimeFormat` so it localises automatically.

Still to clean up:
- `MorningRitual.tsx:10` `greetingKey` reads `new Date().getHours()` directly, ignoring `devDayOffset`. Pass an offset-adjusted Date in (or pass the hour as a prop). Minor — only affects the "skip ahead 1 day" dev workflow.
- `MorningRitual` reads `useDailyStore.getState().settings.language` once for the date header instead of subscribing. Move it to a selector so the header re-renders if the user changes language while the morning window is open.

### 2.4 Timer broadcast still couples two concerns

`timer.ts:131-139` `broadcast` sends both `TimerStateChanged` and a full `StoreStateChanged`. The latter is included because `upsertSession` doesn't broadcast on its own. Cleaner: have `store.ts` accept a `broadcast` callback (or emit an event), and let *every* mutator notify. Today the contract "session changes are advertised by the timer" is implicit and a minefield for future contributors.

### 2.5 `recoverInterruptedSession` falls back to a stale duration

`timer.ts` — if the app crashed mid-session, recovery sets `endTime = startTime + duration*1000`. But `duration` is updated only every 60s by `persistCurrent`, so up to a minute of work is silently lost on the boundary. Not really avoidable without a separate "lastTickAt" field, but worth a comment so future-you doesn't think it's exact.

### 2.6 `dateKey` is implemented twice with subtly different signatures

- `main/timer/timer.ts:141` — `dateKey(ms)` reads `getSettings().dayRolloverHour` itself.
- `renderer/src/design/format.ts` — `dateKey(ms, rolloverHour = 0)` takes it as a parameter.

Both are correct, but a future reader will assume they match. Either inline the renderer one or pass settings explicitly in main.

---

## 3. Smaller polish items

### 3.1 Inline styles vs. Tailwind

Tailwind v4 is installed and configured, but ~95% of UI is inline `style={{…}}` objects with CSS variables. That's a legitimate choice for small apps, but having both adds bundle weight and confusion. Either commit to inline + tokens.css and drop Tailwind, or migrate the larger components.

### 3.2 No tests

There are no unit or e2e tests. Given the project size and that you're shipping packaged builds, at least a couple of smoke tests around `store.ts` migrations and `timer.ts` state transitions would be high-leverage — especially now that migrations are versioned and easy to test in isolation.

### 3.3 README still says "daily-scaffold"

Cosmetic, but the README hasn't been updated from the electron-vite template.

### 3.4 Pre-existing lint issues

`npm run lint` flags a few pre-existing items unrelated to this round:
- `MainWindow/index.tsx:19` — `setLastTab` called inside `useEffect` (could be derived state).
- `MenuDropdown.tsx:39` — `Date.now()` called during render in `useLiveSeconds`. Move it inside the `useEffect` tick or a `useSyncExternalStore`.
- Two `@ts-expect-error` directives in `MorningRitual.tsx` and `Onboarding.tsx` need a description.
- A pile of prettier whitespace warnings — `npm run format` will clear them.

### 3.5 Tiny nits

- `MorningRitual.tsx:15` — `import type { DailyEntry }` sits between two function declarations. Move all imports to the top.
- `IpcChannels` ordering — `DevTestReminder` is at the bottom while other Dev channels are mid-list; trivial to group.
- `useDailyStore.ts` still has its own `defaultSettings` literal that mirrors the one in `main/store/store.ts` (now exported). Import from a shared module to keep them from drifting.
- `<input style={{ fieldSizing: 'content' }} />` (`TodayTab.tsx`) is Chromium-only and not in the React `CSSProperties` types — works in Electron 39 but a `// @ts-expect-error` would document it.
- `getMainWindow` is exported (`main/windows/main-window.ts:7`) but never imported anywhere. Dead code.
- `SettingsTab.tsx:288` mailto link is `volt@espeniv.com` — confirm that's the address you actually want public.

---

## 4. Done in this pass

For the record, these were addressed:

- **`StoreStateChanged` is now a typed IPC constant** (was a magic string in three places).
- **Per-keystroke persists are debounced.** `TodayTab` and `SettingsTab` update Zustand immediately but flush to disk + IPC after a 350ms idle window. Pending writes are flushed on unmount.
- **`store:state-changed` listener uses a new `replaceState` reducer** with shallow-equal guards — unrelated state slices no longer cause re-renders.
- **`setWindowOpenHandler` now applies the `https?:|mailto:` allow-list** (matches the IPC handler).
- **All `BrowserWindow`s now use `sandbox: true`.**
- **`schemaVersion` added to `PersistedState`** with a versioned migrations array (`migrations[]`). The previous `mainGoal → goals[]` migration is now keyed at v0→v1; the new `reminderTime` field is the v1→v2 migration.
- **`reminderTime` setting added.** The morning reminder reads `getSettings().reminderTime`, the IPC handler calls `rescheduleMorningReminder` whenever `reminderTime` or `gentleReminder` is patched, and Settings exposes a `<input type="time">` row when the toggle is on.
- **Date/weekday/month formatting is i18n-aware.** `format.ts` exposes `fmtMonthYear`, `fmtFullDate`, `weekStartsOnMonday`, `weekdayShorts`. `CalendarTab` now starts the week on Monday for Norwegian users and pulls weekday letters from `Intl.DateTimeFormat`. `MainWindow` and `MenuDropdown` pass `lang` into `todayLong`.

---

## 5. Suggested priority for next pass

1. **(2.3)** Make `MorningRitual` subscribe to the language setting and respect `devDayOffset` for the greeting.
2. **(2.4)** Move broadcasting into the store so timer/session updates don't have to.
3. **(3.4)** Run `npm run format` and clear the cluster of prettier warnings; fix the two real `react-hooks` lint errors.
4. **(3.5)** Drop the duplicate `defaultSettings` in the renderer.
5. **(3.2)** Add a couple of unit tests around `store.ts` migrations now that they're versioned.
