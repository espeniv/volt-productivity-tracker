export function TrayPanel(): React.JSX.Element {
  return (
    <div className="h-screen w-screen bg-white p-4 text-sm">
      <h2 className="font-semibold">Tray</h2>
      <p className="text-neutral-500">Dropdown placeholder.</p>
      <button
        className="mt-3 rounded border px-2 py-1"
        onClick={() => window.api.showMainWindow()}
      >
        Open full window
      </button>
    </div>
  )
}
