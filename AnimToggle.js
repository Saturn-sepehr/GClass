import initListeners from './Listeners'

// localStorage key controlling whether the GSAP animation system is mounted.
const STORAGE_KEY = 'funbyte-animations-enabled'

const reducedMotionQuery = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null

// Module-level singleton store so anything subscribing to it stays in sync.
let stored = readStored()
let reduced = reducedMotionQuery?.matches ?? false
const subscribers = new Set()

// Returns the stored preference, or null when the user has never explicitly
// chosen (no localStorage value). Distinct from a boolean so we can tell
// "user override" apart from "use the default".
function readStored() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === null ? null : raw === 'true'
  } catch {
    return null
  }
}

// Enabled rule:
//   - If the user HAS an explicit stored choice, respect it (override wins),
//     even under reduced motion.
//   - Otherwise (no stored value) fall back to the default, which is ON unless
//     reduced motion is detected — in which case animations are off.
function getEnabled() {
  return stored === null ? !reduced : stored
}

function emit() {
  subscribers.forEach((fn) => fn(getEnabled()))
}

// React to the OS reduced-motion setting live (no reload). Toggling off
// reverts tweens; toggling back on re-applies them.
if (reducedMotionQuery) {
  reducedMotionQuery.addEventListener('change', () => {
    reduced = reducedMotionQuery.matches
    emit()
  })
}

function subscribe(cb) {
  subscribers.add(cb)
  return () => subscribers.delete(cb)
}

function getSnapshot() {
  return getEnabled()
}

// Persists the new value, then reloads the page so the change applies cleanly.
export function toggleAnimations() {
  stored = !getEnabled()
  try {
    localStorage.setItem(STORAGE_KEY, String(stored))
  } catch {
    /* ignore storage errors (private mode etc.) */
  }
  emit()
  if (typeof window !== 'undefined') window.location.reload()
}

let cleanup = null

// Boots the GSAP animation system unless animations are disabled (stored "off"
// or reduced-motion fallback with no explicit choice). Idempotent: calling it
// again tears down any previous run first.
export function initAnimations() {
  if (typeof window === 'undefined' || !getEnabled()) return
  if (cleanup) cleanup()
  cleanup = initListeners()
}
