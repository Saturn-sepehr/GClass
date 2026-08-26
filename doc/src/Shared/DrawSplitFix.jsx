"use client"
import { useEffect } from "react"

// Doc-only fix for draw-split + appearObserver loop.
// splitPaths() copies the original's class (including "appear") onto each
// new <path> it inserts. appearObserver then sees those 3 children as new
// ".appear" nodes and calls animateAppear → splitPaths again → 3×
// insertBefore/removeChild → observer loop → Style/Layout thrash.
// This observer strips "appear" from single-segment children immediately
// after insertion, so they are ignored. Original keeps "appear" for Replay.
export default function DrawSplitFix() {
  useEffect(() => {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue
          const els = n.matches?.(".draw-split.appear") ? [n] : n.querySelectorAll ? [...n.querySelectorAll(".draw-split.appear")] : []
          // also check bare n if it matches
          if (n.matches?.(".draw-split.appear") && !els.includes(n)) els.unshift(n)
          for (const el of els) {
            const d = el.getAttribute("d") || ""
            // single-segment after split → only 1 "M" (or 0) → this is a child, not the original (original has 3× "M")
            const mCount = (d.match(/M/g) || []).length
            if (mCount <= 1) {
              el.classList.remove("appear")
            }
          }
        }
      }
    })
    obs.observe(document.body, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [])
  return null
}
