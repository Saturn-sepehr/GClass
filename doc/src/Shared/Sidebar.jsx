"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

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
    ],
  },
  {
    title: "Scroll",
    items: [
      [".scroll", "scroll"],
      [".scroll-progress", "scroll-progress"],
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
      ["Magnet", "magnet"],
      ["css-* classes", "css-classes"],
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
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <nav className="w-48">
      <p className="mb-3 text-xs tracking-[0.25em] opacity-50">DOCS</p>
      <ul className="space-y-5">
        {SECTIONS.map((section) => (
          <li key={section.title}>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider opacity-60">
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
                      className={`block rounded-md px-2 py-1 text-sm transition-colors ${
                        active
                          ? "bg-cyan-300/10 font-bold text-cyan-200"
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
    </nav>
  )
}
