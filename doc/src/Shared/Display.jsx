import React from 'react'

// CRT shell for a WINDOW-scrolling document: the tube and its effects are
// fixed backdrops; content scrolls over them in normal flow. All layout =
// Tailwind; the CRT effect itself = .crt-* rules in globals.css.
export default function Display({ children }) {
  return (
    <>
      {/* tube backdrop */}
      <div
        className='crt-screen fixed inset-0 z-0 bg-slate-900 shadow-[inset_0_0_46px_rgba(0,0,0,0.75)]'
        aria-hidden='true'
      />
      {/* scrolling content — intentionally NO filter here: it would become a
          containing block and break ScrollTrigger's fixed-position pinning */}
      <div className='relative z-10 font-mono text-cyan-200'>{children}</div>
      {/* scanlines + dither + flicker sit above everything */}
      <div className='bg-slate-900 opacity-50 mix-blend-color pointer-events-none fixed inset-0 z-50' aria-hidden='true' />
      <div className='crt-overlay pointer-events-none fixed inset-0 z-50' aria-hidden='true' />
    </>
  )
}
