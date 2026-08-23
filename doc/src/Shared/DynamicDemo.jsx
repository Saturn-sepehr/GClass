"use client"

import { useRef, useState } from "react"

let n = 0

export default function DynamicDemo() {
  const list = useRef(null)
  const [count, setCount] = useState(0)
  const add = () => {
    const row = document.createElement("div")
    row.className =
      "appear spawn-left mb-2 rounded-lg bg-slate-800 px-4 py-3 text-sm ring-1 ring-slate-700"
    row.textContent = `dynamically inserted row #${++n}`
    list.current.appendChild(row)
    setCount((c) => c + 1)
  }
  return (
    <div>
      <button
        type="button"
        onClick={add}
        className="mb-3 rounded-lg border border-cyan-200/25 bg-cyan-200/5 px-3 py-1 text-xs font-bold tracking-wide text-cyan-200 hover:bg-cyan-200/15"
      >
        + insert .appear.spawn-left row {count ? `(${count} added)` : ""}
      </button>
      <div ref={list} className="min-h-[60px]" />
    </div>
  )
}
