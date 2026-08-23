import React from "react"

// Presentational building blocks for docs pages (server components).
// Palette: slate surfaces + cyan accents.

export function H1({ children }) {
  return <h1 className="mb-2 text-3xl font-extrabold font-rosemary">{children}</h1>
}

export function H2({ children }) {
  return <h2 className="mt-10 mb-3 border-b border-slate-700 pb-1 text-lg font-bold">{children}</h2>
}

export function P({ children }) {
  return <p className="my-3 leading-relaxed opacity-80">{children}</p>
}

export function Note({ children }) {
  return (
    <p className="my-3 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-3 text-xs leading-relaxed text-cyan-200/90">
      {children}
    </p>
  )
}

export function Code({ children }) {
  return (
    <pre className="my-3 overflow-x-auto rounded-lg bg-slate-950/80 p-4 text-sm leading-relaxed text-cyan-200/90 ring-1 ring-slate-700/60">
      <code>{children}</code>
    </pre>
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
    <div className="my-4 overflow-hidden rounded-lg border border-slate-700 text-sm">
      {rows.map(([cls, desc]) => (
        <div key={cls} className="grid grid-cols-[auto_1fr] gap-4 border-b border-slate-700/70 px-3 py-2 last:border-0">
          <code className="whitespace-nowrap font-bold text-cyan-200">{cls}</code>
          <span className="opacity-75">{desc}</span>
        </div>
      ))}
    </div>
  )
}
