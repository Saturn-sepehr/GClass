import { initListeners } from './Listeners'

// Plain-JS animation gate: toggles and subscribes to the enabled flag (the
// drop-in replacement for the old React hook + `<AnimToggle/>` component),
// and mounts/tears down the whole GSAP system in and out of the DOM.
//
//   initAnimations()          // start the system if animations are enabled
//   isAnimationsEnabled()     // read the flag
//   setAnimationsEnabled(b)   // set + persist the flag (no reload)
//   toggleAnimations()        // flip + persist + reload the page
//   onAnimationsChange(fn)    // subscribe; returns an unsubscribe fn

// localStorage key controlling whether the GSAP animation system is mounted.
const STORAGE_KEY = 'funbyte-animations-enabled'

function readInitial() {
  if (typeof window === 'undefined') return true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === null ? true : raw === 'true'
  } catch {
    return true
  }
}

// Module-level singleton store so any subscriber stays in sync, even across
// app boundaries (a layout gate + any site button).
let enabled = readInitial()
const subscribers = new Set()
let cleanup = null

function emit() {
  subscribers.forEach((fn) => fn(enabled))
}

function setEnabled(next) {
  enabled = !!next
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled))
  } catch {
    /* ignore storage errors (private mode etc.) */
  }
  emit()
}

// Plain function intended for wiring into an onClick anywhere in the site:
//   <button onclick="toggleAnimations()">...</button>
// Persists the new value, then reloads the page so the change applies cleanly
// (initAnimations re-reads the stored flag on mount).
export function toggleAnimations() {
  setEnabled(!enabled)
  if (typeof window !== 'undefined') window.location.reload()
}

export function isAnimationsEnabled() {
  return enabled
}

export function setAnimationsEnabled(next) {
  setEnabled(next)
}

// Subscribe to changes of the enabled flag. Returns an unsubscribe function.
//   const unsub = onAnimationsChange((val) => { ... })
export function onAnimationsChange(fn) {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

// Start (or restart) the GSAP system against the current DOM, but only while
// animations are enabled. Returns a function that tears the system back down.
export function initAnimations() {
  stopAnimations()
  if (!enabled) return () => {}
  cleanup = initListeners()
  return stopAnimations
}

// Tear the running system down, if any.
export function stopAnimations() {
  if (cleanup) {
    cleanup()
    cleanup = null
  }
}

// Boot on import: if the DOM is already loaded just go, otherwise wait for it.
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations)
  } else {
    initAnimations()
  }
}
