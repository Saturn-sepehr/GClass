"use client"

import React, { useState } from "react"

// Presentational building blocks for docs pages.
// Palette: slate surfaces + cyan accents.

export function H1({ children }) {
  return <h1 className="mb-2 text-3xl order spawn-text-spawn-down letter font-extrabold font-rosemary">{children}</h1>
}

export function H2({ children }) {
  return <h2 className="mt-10 mb-3 curtain-horizontal order typewriter border-b border-slate-700 pb-1 text-lg font-bold">{children}</h2>
}

export function P({ children }) {
  return <p className="my-3 order typewriter leading-relaxed opacity-80">{children}</p>
}

export function Note({ children }) {
  return (
    <p className="my-3 rounded-lg order typewriter curtain-horizontal border border-cyan-300/20 bg-cyan-300/5 p-3 text-xs leading-relaxed text-cyan-200/90">
      {children}
    </p>
  )
}

function detectLang(code) {
  const s = code.trim()
  if (/^(npm|yarn|pnpm|bun)\s/.test(s)) return "bash"
  if (s.includes("<") && s.includes(">")) return "html"
  if (/\b(import|export|const|let|var|function|gsap|customAnims|defaults|initAnimations)\b/.test(s)) return "js"
  return "html"
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function highlight(code, lang) {
  let h = escapeHtml(code)

  if (lang === "bash") {
    h = h.replace(/(npm|yarn|pnpm|bun|npx|install|add)/g, '<span class="text-cyan-300">$1</span>')
    return h
  }

  if (lang === "html") {
    const comments = []
    h = h.replace(/&lt;!--[\s\S]*?--&gt;/g, (m) => {
      const ph = `__HTMLCOMMENT_${comments.length}__`
      comments.push(`<span class="text-slate-500 italic">${m}</span>`)
      return ph
    })

    // Highlight each tag as a unit to avoid matching class=" inside injected spans
    h = h.replace(/&lt;(\/?)([a-zA-Z0-9-]+)([^&]*?)(\/?)&gt;/g, (full, slash, tagName, attrs, selfClose) => {
      let attrH = attrs.replace(/([a-zA-Z0-9-:]+)(\s*=\s*)("[^"]*"|'[^']*')/g, (m, name, eq, val) => `<span class="text-violet-300">${name}</span>${eq}<span class="text-amber-300">${val}</span>`)
      return `&lt;${slash}<span class="text-cyan-300">${tagName}</span>${attrH}${selfClose}&gt;`
    })

    comments.forEach((c, i) => {
      h = h.replace(`__HTMLCOMMENT_${i}__`, c)
    })
    return h
  }

  // --- js : placeholder approach to avoid re-processing injected spans ---
  const placeholders = []
  const store = (cls, content) => {
    const ph = `__JSPH_${placeholders.length}__`
    placeholders.push({ ph, html: `<span class="${cls}">${content}</span>` })
    return ph
  }

  // comments first
  h = h.replace(/\/\/.*$/gm, (m) => store("text-slate-500 italic", m))
  h = h.replace(/\/\*[\s\S]*?\*\//g, (m) => store("text-slate-500 italic", m))
  // strings
  h = h.replace(/"[^"]*"/g, (m) => store("text-amber-300", m))
  h = h.replace(/'[^']*'/g, (m) => store("text-amber-300", m))
  h = h.replace(/`[^`]*`/g, (m) => store("text-amber-300", m))

  // numbers BEFORE keywords/apis to avoid matching 300 inside injected class="text-cyan-300"
  h = h.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-emerald-300">$1</span>')
  h = h.replace(/\b(import|from|const|let|var|function|return|push|new|async|await|export|default)\b/g, '<span class="text-cyan-300">$1</span>')
  h = h.replace(/\b(gsap|customAnims|defaults|initAnimations|registerComplete|toggleAnimations|disableReducedMotion)\b/g, '<span class="text-violet-300">$1</span>')

  // restore strings/comments
  for (const { ph, html } of placeholders) {
    h = h.replace(ph, html)
  }
  return h
}

export function Code({ children, lang: langProp }) {
  const raw = typeof children === "string" ? children : String(children ?? "")
  // preserve author newlines but strip single trailing newline
  const code = raw.replace(/\n$/, "")
  const lang = langProp || detectLang(code)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  const highlighted = highlight(code, lang)

  return (
    <div className="my-5 order spawn-down overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-3.5 py-2">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {lang}
          </span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md border order spawn-down click-hover compatibility amount-2 border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white active:scale-95"
          aria-label="Copy code"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* code body */}
      <pre className="overflow-x-auto  p-4 text-[13.5px] leading-6">
        <code
          className="block whitespace-pre font-mono text-slate-200 [tab-size:2]"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  )
}

export function Demo({ children, className = "" }) {
  return (
    <div className={`flex-1 rounded-xl border border-slate-700 bg-slate-800/40 p-5 ${className}`}>
      {children}
    </div>
  )
}

// Standard entrance demo: .appear (+ .scroll) so it plays on mount, on
// scroll-enter and whenever the Replay wrapper re-inserts it.
export function EntranceDemo({ cls, children = null }) {
  return (
    <Demo className={`min-h-[72px] min-w-[180px] ${cls}`}>
      {children}
    </Demo>
  )
}

export function ClassRef({ rows }) {
  return (
    <div className="my-4 overflow-x-auto curtain-horizontal order rounded-lg border border-slate-700 text-sm">
      {rows.map(([cls, desc]) => (
        <div key={cls} className="grid order curtain-vertical grid-cols-[auto_1fr] gap-4 border-b border-slate-700/70 px-3 py-2 last:border-0">
          <code className="whitespace-nowrap order typewriter font-bold text-cyan-200">{cls}</code>
          <span className="opacity-75 order typewriter">{desc}</span>
        </div>
      ))}
    </div>
  )
}
