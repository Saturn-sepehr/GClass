"use client"

import { useRef } from "react"

export default function FlipDemo() {
  const list = useRef(null)

  const shuffle = () => {
    const c = list.current
    if (!c) return
    // rotate first to last - smallest DOM mutation that still triggers FLIP for all three
    c.appendChild(c.firstElementChild)
  }

  const random = () => {
    const c = list.current
    if (!c) return
    const kids = [...c.children]
    for (let i = kids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[kids[i], kids[j]] = [kids[j], kids[i]]
    }
    kids.forEach((k) => c.appendChild(k))
  }

  return (
    <div>
      <div ref={list} className="flex flex-wrap gap-3">
        <div className="flip flex h-20 w-20 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700">A</div>
        <div className="flip flex h-20 w-20 items-center justify-center rounded-xl bg-slate-700">B</div>
        <div className="flip flex h-20 w-20 items-center justify-center rounded-xl bg-cyan-900/50">C</div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={shuffle}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500"
        >
          Shuffle - rotate A-B-C
        </button>
        <button
          type="button"
          onClick={random}
          className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
        >
          Randomize
        </button>
      </div>
      <p className="mt-2 text-xs opacity-60">Each box has <code>.flip</code> + any spawn - any DOM reorder slides from old to new position.</p>
    </div>
  )
}
