"use client"
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initAnimations } from 'gclass-anims'

export default function AnimInit() {
  const pathname = usePathname()
  useEffect(() => {
    // Root layouts persist across App Router navigations, so without the
    // pathname key this runs only once per full page load. Re-calling
    // initAnimations() tears down the previous engine run and re-wires the
    // new page's DOM, replaying its entrance animations. Elements tagged
    // .preserve (the header) stay skipped across routes.
    initAnimations()
  }, [pathname])
  return null
}
