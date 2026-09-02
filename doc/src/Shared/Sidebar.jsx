"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

const SECTIONS = [
  {
    title: "Getting started",
    items: [
      ["Installation", "installation"],
      ["Quick start", "quick-start"],
      ["Toggle & reduced motion", "toggle-reduced-motion"],
    ],
  },
  {
    title: "Entrances",
    items: [
      ["Spawn", "spawn"],
      ["Expand", "expand"],
      ["Clip & curtains", "clip-curtains"],
      ["Typewriter", "typewriter"],
      ["Split text", "split-text"],
      ["Scramble text", "scramble-text"],
      ["Counters", "counter"],
      ["DrawSVG", "draw-svg"],
      ["Boot up", "boot-up"],
    ],
  },
  {
    title: "Scroll",
    items: [
      [".scroll", "scroll"],
      [".scroll-progress", "scroll-progress"],
      [".scroll-frame", "scroll-frame"],
      [".pin", "pin"],
      [".parallax-N", "parallax"],
      ["Progress bars", "progress-bars"],
    ],
  },
  {
    title: "Loops & interaction",
    items: [
      ["Loops", "loops"],
      ["Dynamic elements", "dynamic-elements"],
      ["hover-* / click-*", "hover-click"],
      ["Marquees", "marquees"],
      
      ["Magnet", "magnet"],
      ["css-* classes", "css-classes"],
      [".ease-N", "eases"],
      ["Randomization", "randomize"],
    ],
  },
  {
    title: "API",
    items: [
      ["defaults", "defaults"],
      ["customAnims", "custom-anims"],
      ["registerComplete", "register-complete"],
      ["on-*-complete-*", "on-complete"],
    ],
  },
    {
    title: "About",
    items: [
      ["About (mostly personal)", "about"],

    ],
  },
]

// `cls` lets each call site carry its own engine tunables (e.g. a distinct
// priority-N): .order sequencing groups by priority value, so separate
// numbers keep the desktop nav and the mobile drawer on independent timelines.
function NavSections({ pathname, cls = "" }) {
  return (
    <ul className="space-y-5 preserve">
      {SECTIONS.map((section) => (
        <li key={section.title}>
          <p className={`mb-1.5 appear text-[11px] spawn-text-spawn-down letter font-bold uppercase tracking-wider opacity-60 ${cls}`}>
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map(([label, slug]) => {
              const href = `/documentation/${slug}`
              const active = pathname === href
              return (
                <li key={slug}>
                  <Link
                    href={href}
                    className={`block appear compatibility spawn-left click-hover amount-2 rounded-md px-2 py-1 text-sm transition-colors ${cls} ${
                      active
                        ? "bg-cyan-300/10 font-bold"
                        : "opacity-75 hover:bg-slate-700/50 hover:opacity-100"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </li>
      ))}
    </ul>
  )
}

// Desktop keeps the inline sticky sidebar; below lg the same nav collapses
// into a floating hamburger button that opens a slide-in drawer.
export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the drawer whenever the route changes (state-adjust-during-render
  // pattern - no effect needed), and lock body scroll while it is open.
  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      {/* Desktop sidebar - geometry identical to the old aside > nav pair */}
      <nav className="sticky top-24 hidden h-fit w-48 shrink-0 lg:block preserve">
        <p className="mb-3 text-xs tracking-[0.25em] opacity-50 typewriter-split appear letter">DOCS</p>
        <NavSections pathname={pathname} cls="priority-0" />
      </nav>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open docs navigation"
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 rounded-full border border-cyan-200/25 bg-slate-800/90 p-3.5 text-cyan-200 shadow-lg backdrop-blur transition-colors hover:bg-cyan-200/15 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Docs navigation"
        >
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute  inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto  bg-slate-900 p-5 ring-1 ring-slate-700">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs tracking-[0.25em] opacity-50 typewriter-split appear letter">DOCS</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close docs navigation"
                className="rounded-md p-1.5 transition-colors hover:bg-slate-700/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavSections pathname={pathname} cls="priority-0" />
          </div>
        </div>
      )}
    </>
  )
}
