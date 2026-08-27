"use client"

import { useRef, useState } from "react"

let n = 0

export default function LeaveDemo() {
  const list = useRef(null)
  const [count, setCount] = useState(0)

  const add = () => {
    const row = document.createElement("div")
    // .leave-demo-row marks OUR rows so removal skips the layout spacers the
    // engine temporarily inserts into this container during exit animations.
    row.className =
      "appear leave spawn-left leave-demo-row mb-2 rounded-lg text-cyan-200 bg-slate-800 px-4 py-3 text-sm ring-1 ring-slate-700"
    row.textContent = `row #${++n} - slides in on add, slides out on remove`
    list.current.appendChild(row)
    setCount((c) => c + 1)
  }

  const removeLast = () => {
    const kids = [...list.current.children]
    for (let i = kids.length - 1; i >= 0; i--) {
      if (kids[i].classList.contains("leave-demo-row")) {
        kids[i].remove()
        setCount((c) => Math.max(0, c - 1))
        return
      }
    }
  }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-cyan-200/25 bg-cyan-200/5 px-3 py-1 text-xs font-bold tracking-wide text-cyan-200 hover:bg-cyan-200/15"
        >
          + Add row
        </button>
        <button
          type="button"
          onClick={removeLast}
          className="rounded-lg border border-slate-500/40 bg-slate-700/30 px-3 py-1 text-xs font-bold tracking-wide hover:bg-slate-700/60"
        >
          − Remove last {count ? `(${count} live)` : ""}
        </button>
      </div>
      <div ref={list} className="min-h-[40px]" />
    </div>
  )
}
