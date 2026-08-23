"use client"

import { useEffect } from "react"
import { registerComplete } from "gclass-anims"

let stamp = 0

export default function CompleteDemo() {
  useEffect(() => {
    // Fires when any demo element below finishes its entrance.
    registerComplete("docsPing", (el) => {
      el.querySelector(".stamp").textContent =
        `✔ completed at ${(stamp = new Date().toLocaleTimeString())}`
    })
  }, [])

  const replayAll = () => {
    document
      .querySelectorAll("[data-complete-demo]")
      .forEach((box) => {
        const clone = box.cloneNode(true)
        box.replaceWith(clone)
      })
  }

  return (
    <div className="flex flex-wrap gap-4">
      <button
        type="button"
        onClick={replayAll}
        className="h-fit self-start rounded-lg border border-cyan-200/25 bg-cyan-200/5 px-3 py-1 text-xs font-bold tracking-wide text-cyan-200 hover:bg-cyan-200/15"
      >
        ⟲ re-mount demos
      </button>

      <div
        data-complete-demo
        className="appear spawn-fade time-1 on-spawn-complete-docsPing min-w-[220px] rounded-xl bg-slate-800 p-4 text-sm ring-1 ring-slate-700"
      >
        on-spawn-complete-docsPing
        <div className="stamp mt-2 text-xs opacity-70">waiting…</div>
      </div>

      <div
        data-complete-demo
        className="appear bounce-in time-1 on-spawn-complete-docsPing min-w-[220px] rounded-xl bg-slate-800 p-4 text-sm ring-1 ring-slate-700"
      >
        timeline + complete hook
        <div className="stamp mt-2 text-xs opacity-70">waiting…</div>
      </div>
    </div>
  )
}
