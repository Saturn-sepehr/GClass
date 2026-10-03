"use client"

import { useState } from "react"

// The copy button is the only part of <Code> that needs the browser, so it is
// the only part that ships to the client - highlighting itself runs on the
// server. See DocsUI.jsx.
export default function CodeCopyButton({ code }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="border order spawn-down click-hover compatibility amount-2 border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white active:scale-95"
      aria-label="Copy code"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  )
}