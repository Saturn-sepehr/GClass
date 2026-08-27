"use client"

import React from 'react'
import { usePathname } from 'next/navigation'

// CRT shell for a WINDOW-scrolling document: the tube and its effects are
// fixed backdrops; content scrolls over them in normal flow. All layout =
// Tailwind; the CRT effect itself = .crt-* rules in globals.css.
export default function Display({ children }) {
  const pathname = usePathname()
  const isDrawSvg = pathname?.startsWith('/documentation/draw-svg')

  return (
    <>
      {}
  
        {/* tube backdrop - disabled on /draw-svg to avoid paint storm with drawSVG */}

        <div
          className='crt-screen  fixed inset-0 z-0 bg-slate-900'
          aria-hidden='true'
        />
     
      {/* scrolling content - intentionally NO filter here: it would become a
          containing block and break ScrollTrigger's fixed-position pinning */}
      <div className='relative font-mono text-cyan-200'>{children}</div>
      {/* scanlines + dither + flicker sit above everything */}

        <>
          <div className='bg-slate-900 opacity-50 mix-blend-color pointer-events-none fixed inset-0 z-50' aria-hidden='true' />
          <div className='crt-overlay pointer-events-none fixed inset-0 z-50' aria-hidden='true' />
          {/* fake fisheye: edge falloff reads as the tube curving away */}
          <div
            className='crt-vignette pointer-events-none fixed inset-0 z-50 overflow-hidden'
            aria-hidden='true'
          />
        </>
        
    </>
  )
}
