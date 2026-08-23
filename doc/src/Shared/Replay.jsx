"use client"

import { useState } from "react"

// Removes and re-adds its children on demand, replaying any entrance
// animations inside. Give replayable elements the .appear class so the
// engine's MutationObserver picks them up on re-insertion.
export default function Replay({ label = "Replay", children }) {
  const [run, setRun] = useState(0)
  return (
    <div>
      <button
        type="button"
        onClick={() => setRun((v) => v + 1)}
        className="rounded-lg border border-cyan-200/25 bg-cyan-200/5 px-3 py-1 text-xs font-bold tracking-wide text-cyan-200 hover:bg-cyan-200/15"
      >
        ⟲ {label}
      </button>
      <div key={run} className="mt-3 flex flex-wrap gap-4">
        {children}
      </div>
    </div>
  )
}
