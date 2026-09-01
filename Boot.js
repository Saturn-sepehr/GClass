import { initAnimations } from './AnimToggle.js'

export function Boot(){
  const els = document.querySelectorAll(".boot-up")
  console.log(`[Boot -> initAnimations] .boot-up count: ${els.length}`, els)
  // rewired: Boot now just delegates to initAnimations (single entry point)
  return initAnimations()
}
// keep named exports wired so index.js / dev don't break during test
export const initBoot = Boot
export const createBootOverlay = Boot
export default Boot