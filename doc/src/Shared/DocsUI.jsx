import Link from "next/link"
import React, { Fragment } from "react"
import { createHighlighter } from "shiki"
import CodeCopyButton from "@/Shared/CodeCopyButton"

// Presentational building blocks for docs pages.
// Palette: slate surfaces + cyan accents.
//
// This module is a SERVER component: syntax highlighting runs during render
// through Shiki, so the highlighter never reaches the browser and there is no
// flash of unstyled code on first paint. Only the copy button needs the client
// and it lives in CodeCopyButton.jsx. Do not add "use client" back here - <Code>
// is async, and a client component cannot render it.

export function H1({ children }) {
  return <h1 className="mb-2 text-3xl order spawn-text-spawn-down letter font-extrabold font-comic-neue">{children}</h1>
}

export function H2({ children }) {
  return <h2 className="mt-10 mb-3 curtain-horizontal order typewriter border-b border-slate-700 pb-1 text-lg font-bold">{children}</h2>
}

export function P({ children }) {
  return <p className="my-3 order typewriter leading-relaxed opacity-80">{children}</p>
}

export function Note({ children }) {
  return (
    <p className="my-3 order typewriter curtain-horizontal border border-cyan-300/20 bg-cyan-300/5 p-3 text-xs leading-relaxed text-cyan-200/90">
      {children}
    </p>
  )
}

// --- Shiki ---------------------------------------------------------------
// Everything below replaces the old regex highlighter. Real grammars mean real
// token boundaries, so strings/comments can no longer be half-matched, and the
// palette comes from a theme instead of hardcoded Tailwind classes.

const LANGS = [
  "javascript", "typescript", "jsx", "tsx",
  "html", "css", "json", "bash", "markdown", "yaml",
  "vue", "svelte", "plaintext",
]

const THEME = "ayu-mirage"
const BG = "#020618" // Ayu Mirage's editor background, repainted to match slate-950
const FG = "#CCCAC2" // Ayu Mirage's default foreground, for uncoloured tokens

// Shiki ids differ from the short names authors write in <Code lang="js">.
const ALIASES = {
  js: "javascript", jsx: "jsx", ts: "typescript", tsx: "tsx",
  sh: "bash", shell: "bash", zsh: "bash", console: "bash",
  yml: "yaml", txt: "plaintext", text: "plaintext", plain: "plaintext",
}

const LABELS = { javascript: "js", typescript: "ts", plaintext: "text" }

// Cached across requests - the highlighter is expensive to build and the theme
// fork only has to happen once per server process.
let highlighter
function getHighlighter() {
  highlighter ??= createHighlighter({ themes: [THEME], langs: LANGS }).then(async (hl) => {
    // Fork the bundled theme rather than restating it: keep every token rule,
    // swap only the one colour the docs shell disagrees with.
    const base = hl.getTheme(THEME)
    await hl.loadTheme({
      ...base,
      name: "gclass-ayu",
      displayName: "Ayu Mirage (GClass)",
      bg: BG,
      colors: { ...base.colors, "editor.background": BG },
    })
    return hl
  })
  return highlighter
}

function detectLang(code) {
  const s = code.trim()
  if (/^(npm|yarn|pnpm|bun|npx)\s/.test(s)) return "bash"
  if (/(^|\n)\s*</.test(s) && /<\/?[a-zA-Z][\w-]*/.test(s)) return "html"
  if (/^\s*[[{]/.test(s) && /"[^"]*"\s*:/.test(s)) return "json"
  if (/\b(import|export|const|let|var|function|return|async|await|new|gsap|customAnims|defaults|initAnimations|gclassDev|gclassOpts|getGClassConfig|subscribeGClassConfig|GSDevTools)\b/.test(s)) return "javascript"
  return "plaintext"
}

async function tokenize(code, lang) {
  const hl = await getHighlighter()
  // An unknown id throws in Shiki and would take the whole page down with it;
  // fall back to unhighlighted text instead.
  if (!hl.getLoadedLanguages().includes(lang)) {
    return hl.codeToTokens(code, { lang: "plaintext", theme: "gclass-ayu" }).tokens
  }
  return hl.codeToTokens(code, { lang, theme: "gclass-ayu" }).tokens
}

export async function Code({ children, lang: langProp }) {
  const raw = typeof children === "string" ? children : String(children ?? "")
  // preserve author newlines but strip single trailing newline
  const code = raw.replace(/\n$/, "")
  const lang = ALIASES[langProp] || langProp || detectLang(code)
  const label = LABELS[lang] || lang
  const lines = await tokenize(code, lang)

  return (
    <div className="my-5 order curtain-horizontal overflow-hidden border-x-1 border-cyan-200">
      {/* header */}
      <div className="flex items-center justify-between bg-slate-950 px-3.5 py-2">
        <div className="flex items-center gap-2.5">
          <span className="px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label}
          </span>
        </div>
        <CodeCopyButton code={code} />
      </div>

      {/* code body - Shiki returns one token array per line and no trailing
          newlines, so the line breaks are re-inserted here. Tokens are real
          React nodes: no dangerouslySetInnerHTML in this file.

          `.typewriter` sits on each TOKEN span, not on <code> or <pre>:
          the class drives GSAP TextPlugin off the element's own innerHTML, and
          marking a parent wipes the text without retyping it. */}
      <pre className="overflow-x-auto p-4 text-[13.5px] leading-6" style={{ color: FG, backgroundColor: BG }}>
        <code className="block whitespace-pre text-left font-mono [tab-size:2]" style={{ color: "inherit" }}>
          {lines.map((line, i) => (
            <span key={i}>
              {line.map((token, j) => (
                <span
                  className="typewriter"
                  key={j}
                  style={{
                    color: token.color,
                    fontStyle: token.fontStyle ? "italic" : undefined,
                  }}
                >
                  {token.content}
                </span>
              ))}
              {i < lines.length - 1 ? "\n" : ""}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

export function Demo({ children, className = "" }) {
  return (
          <div className={`flex-1 border border-slate-700 p-5 ${className}`}>
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

export function QSButtons({link , children}){
  return (
    <Link href={link} className="my-3 hover:bg-slate-800 order spawn-down font-extrabold items-center px-10 click-hover compatibility justify-between flex flex-row curtain-horizontal border-x border-cyan-300/20 bg-cyan-300/5 p-3 text-xs leading-relaxed text-cyan-200/90">
      {children}
    </Link>
  )
}

export function ClassRef({ rows }) {
  return (
    <div className="my-4 overflow-x-auto curtain-horizontal order border border-slate-700 text-sm">
      {rows.map(([cls, desc]) => (
        <div key={cls} className="grid order curtain-vertical grid-cols-[auto_1fr] gap-4 border-b border-slate-700/70 px-3 py-2 last:border-0">
          <code className="whitespace-nowrap order typewriter font-bold text-cyan-200">{cls}</code>
          <span className="opacity-75 order typewriter">{desc}</span>
          </div>
      ))}
          </div>
  )
}
