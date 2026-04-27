import type { Language } from '../../../shared/types'

export const translations = {
  // Tray
  good_morning: { en: 'Good morning', no: 'God morgen' },
  good_afternoon: { en: 'Good afternoon', no: 'God ettermiddag' },
  good_evening: { en: 'Good evening', no: 'God kveld' },
  start_your_day: { en: 'Start your day.', no: 'Start dagen.' },
  two_minutes_focus: {
    en: "Two minutes to set today's focus.",
    no: 'To minutter for å sette dagens fokus.'
  },
  begin: { en: 'Begin', no: 'Start' },
  todays_goal: { en: "Today's goal", no: 'Dagens mål' },
  today: { en: 'Today', no: 'I dag' },
  yesterday: { en: 'Yesterday', no: 'I går' },
  not_started: { en: 'Not started', no: 'Ikke startet' },
  session_one: { en: 'session', no: 'økt' },
  session_many: { en: 'sessions', no: 'økter' },
  focusing: { en: 'Focusing', no: 'Fokuserer' },
  paused: { en: 'Paused', no: 'Pauset' },
  pause: { en: 'Pause', no: 'Pause' },
  resume: { en: 'Resume', no: 'Fortsett' },
  end_session: { en: 'End session', no: 'Avslutt økt' },
  working_toward: { en: 'Long-term goal', no: 'Langsiktig mål' },
  open_app: { en: 'Open app', no: 'Åpne app' },
  start_session: { en: 'Start a session', no: 'Start en økt' },

  // Morning ritual
  check_in: { en: 'Check-in', no: 'Innsjekk' },
  of: { en: 'of', no: 'av' },
  on_word: { en: 'on', no: 'på' },
  give_what_you_got: { en: 'Show up and give it what you got.', no: 'Møt opp og gi det alt du kan.' },
  daily_notes: { en: 'Daily notes', no: 'Dagens notater' },
  daily_notes_long: {
    en: 'A daily journal for brain dumps, ideas, or anything you want to remember. Worries, what you slept badly about, plans for the day. Write it down so it stops following you around.',
    no: 'En daglig journal for tanker, ideer, alt du vil huske. Bekymringer, det du sov dårlig av, planer for dagen. Skriv det ned så det slutter å følge deg.'
  },
  daily_notes_hint: {
    en: 'Write anything to get it out of your head before you start the day.',
    no: 'Skriv hva som helst for å få det ut av hodet før dagen starter.'
  },
  start_typing: { en: 'Start typing…', no: 'Begynn å skrive…' },
  one_thing_today: {
    en: "What's the one thing you want to focus on for today?",
    no: 'Hva er den ene tingen du vil fokusere på i dag?'
  },
  skip_today: { en: 'Skip for today', no: 'Hopp over i dag' },
  back: { en: 'Back', no: 'Tilbake' },
  continue_label: { en: 'Continue', no: 'Fortsett' },
  start_the_day: { en: 'Start the day', no: 'Start dagen' },
  mood_question: { en: 'How are you feeling today?', no: 'Hvordan har du det i dag?' },
  mood_subtitle: {
    en: 'A quick check-in with yourself.',
    no: 'En rask innsjekk med deg selv.'
  },
  mood_terrible: { en: 'Terrible', no: 'Forferdelig' },
  mood_low: { en: 'Low', no: 'Lavt' },
  mood_okay: { en: 'Okay', no: 'Greit' },
  mood_good: { en: 'Good', no: 'Bra' },
  mood_great: { en: 'Great', no: 'Strålende' },
  energy_question: { en: "How's your energy?", no: 'Hvordan er energien?' },
  energy_subtitle: {
    en: 'A quick check-in with your battery.',
    no: 'En rask sjekk av batteriet.'
  },
  energy_drained: { en: 'Drained', no: 'Tappet' },
  energy_low: { en: 'Low', no: 'Lavt' },
  energy_okay: { en: 'Okay', no: 'Greit' },
  energy_good: { en: 'Good', no: 'Bra' },
  energy_high: { en: 'Energized', no: 'Energisk' },
  yesterday_question: { en: 'How was yesterday?', no: 'Hvordan var i går?' },
  yesterday_subtitle: {
    en: 'Look back briefly before stepping into today.',
    no: 'Se kort tilbake før du går inn i dagen.'
  },
  yesterday_focused_for: { en: 'You focused for', no: 'Du fokuserte i' },
  no_yesterday_data: {
    en: 'No focus time yesterday.',
    no: 'Ingen fokustid i går.'
  },
  add_goal: { en: 'Add goal', no: 'Legg til mål' },
  goals_label: { en: 'Goals for today', no: 'Mål for i dag' },
  morning_not_done_title: {
    en: 'Start with the morning check-in',
    no: 'Begynn med morgensjekken'
  },
  morning_not_done_sub: {
    en: 'Set the day before tracking time on it.',
    no: 'Sett dagen før du sporer tid på den.'
  },
  start_check_in: { en: 'Start check-in', no: 'Start innsjekk' },
  mood_label: { en: 'Mood', no: 'Humør' },
  energy_label: { en: 'Energy', no: 'Energi' },
  rating_label: { en: 'Rating', no: 'Vurdering' },

  // Onboarding
  welcome_to_daily: { en: 'Welcome to Volt', no: 'Velkommen til Volt' },
  tagline: { en: 'Daily focus tracker', no: 'Daglig fokussporing' },
  small_ritual_for: { en: 'A small ritual for', no: 'Et lite rituale for' },
  focused_days: { en: 'focused days.', no: 'fokuserte dager.' },
  each_morning: {
    en: 'Each morning, choose one thing that matters. Track the time you spend on it.',
    no: 'Hver morgen, velg én ting som betyr noe. Spor tiden du bruker på den.'
  },
  no_accounts: {
    en: "No accounts. No streaks. No notifications you didn't ask for.",
    no: 'Ingen konto. Ingen streaker. Ingen varsler du ikke ba om.'
  },
  what_are_you_working_toward: {
    en: 'What are you working toward?',
    no: 'Hva jobber du mot?'
  },
  why_subtitle: {
    en: 'Your big "why". The thing each focused day adds up to. You can change this anytime.',
    no: 'Det store "hvorfor". Det hver fokuserte dag bygger mot. Du kan endre det når som helst.'
  },
  overarching_examples: {
    en: 'Examples: Launch the side project · Learn Spanish to B1 · Finish the novel manuscript',
    no: 'Eksempler: Lanser sideprosjektet · Lær spansk til B1 · Fullfør romanmanuset'
  },
  overarching_placeholder: {
    en: 'Your long-term goal',
    no: 'Det langsiktige målet ditt'
  },
  menu_bar_lives_here: {
    en: 'Volt lives in your menu bar.',
    no: 'Volt ligger i menylinjen.'
  },
  menu_bar_intro: {
    en: "Click the icon up top to start or stop a session. That's where you'll spend most of your time.",
    no: 'Klikk på ikonet øverst for å starte eller stoppe en økt. Der vil du tilbringe mesteparten av tiden.'
  },
  todays_focus_visible: { en: "Today's focus", no: 'Dagens fokus' },
  todays_focus_visible_sub: {
    en: 'Always visible at a glance.',
    no: 'Alltid synlig.'
  },
  one_click_timer: { en: 'One-click timer', no: 'Ett-klikks tidtaker' },
  one_click_timer_sub: {
    en: "Start when you're ready. End when you're done.",
    no: 'Start når du er klar. Avslutt når du er ferdig.'
  },
  open_full_window: { en: 'Open the full window', no: 'Åpne hele vinduet' },
  open_full_window_sub: {
    en: "For your day's log, calendar, and settings.",
    no: 'For dagens logg, kalender og innstillinger.'
  },
  onboarding_to_morning_hint: {
    en: "Next, we'll start today's morning check-in.",
    no: 'Nå starter vi dagens morgensjekk.'
  },

  // Tabs
  tab_today: { en: 'today', no: 'i dag' },
  tab_history: { en: 'history', no: 'historikk' },

  // Today tab
  set_today_goal: { en: "Set today's goal", no: 'Sett dagens mål' },
  toward: { en: 'toward', no: 'mot' },
  sessions_label: { en: 'Sessions', no: 'Økter' },
  total_label: { en: 'total', no: 'totalt' },
  no_sessions_today: {
    en: 'No sessions yet today. Start one from the menu bar.',
    no: 'Ingen økter i dag enda. Start en fra menylinjen.'
  },
  notes_placeholder: { en: 'Notes for the day…', no: 'Notater for dagen…' },

  // Calendar
  less: { en: 'Less', no: 'Mindre' },
  more: { en: 'More', no: 'Mer' },
  logged: { en: 'logged', no: 'loggført' },
  a_quiet_day: { en: 'A quiet day.', no: 'En stille dag.' },
  no_goal_logged: { en: 'No goal logged.', no: 'Ingen mål loggført.' },
  focused_label: { en: 'Focused', no: 'Fokusert' },

  // Settings
  settings: { en: 'Settings', no: 'Innstillinger' },
  customize_daily: { en: 'Customize Volt.', no: 'Tilpass Volt.' },
  suggestions_title: { en: 'Suggestions', no: 'Forslag' },
  suggestions_sub: {
    en: "Have an idea or found a bug? I'd love to hear it.",
    no: 'Har du et forslag eller funnet en feil? Send det gjerne over.'
  },
  send_feedback: { en: 'Send feedback', no: 'Send tilbakemelding' },
  overarching_goal: { en: 'Long-term goal', no: 'Langsiktig mål' },
  overarching_goal_sub: {
    en: 'The thing each focused day adds up to.',
    no: 'Det hver fokuserte dag bygger mot.'
  },
  day_rollover: { en: 'Day rollover', no: 'Dagsskifte' },
  day_rollover_sub: {
    en: "When 'today' resets. Useful if you work past midnight.",
    no: 'Når "i dag" tilbakestilles. Nyttig hvis du jobber etter midnatt.'
  },
  appearance: { en: 'Appearance', no: 'Utseende' },
  accent: { en: 'Accent', no: 'Aksent' },
  behavior: { en: 'Behavior', no: 'Atferd' },
  hide_dock: { en: 'Hide app icon in dock', no: 'Skjul app-ikonet i Dock' },
  hide_dock_sub: {
    en: 'Volt lives only in the menu bar.',
    no: 'Volt ligger kun i menylinjen.'
  },
  launch_at_login: { en: 'Launch at login', no: 'Start ved innlogging' },
  gentle_reminder: {
    en: "Gentle reminder if you haven't started",
    no: 'Påminnelse hvis du ikke har startet'
  },
  gentle_reminder_sub: {
    en: 'Sent at 10:00 AM. Off by default.',
    no: 'Sendes kl. 10:00. Av som standard.'
  },
  language_label: { en: 'Language', no: 'Språk' },
  english: { en: 'English', no: 'Engelsk' },
  norwegian: { en: 'Norwegian', no: 'Norsk' },
  made_for_quiet_days: {
    en: 'Volt 0.1 · Daily focus tracker',
    no: 'Volt 0.1 · Daglig fokussporing'
  }
} as const

export type TranslationKey = keyof typeof translations

export function tr(key: TranslationKey, lang: Language): string {
  return translations[key][lang]
}
