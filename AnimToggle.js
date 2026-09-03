  import initListeners from './Listeners.js'
  import { defaults, animations } from './Config.js'
  import gsap from 'gsap'

// localStorage key controlling whether the GSAP animation system is mounted.
const STORAGE_KEY = 'gclass-animations-enabled'
// localStorage key for a forced reduced-motion override (see
// enableReducedMotion / disableReducedMotion).
const REDUCED_KEY = 'gclass-reduced-motion'

const reducedMotionQuery = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null

// Module-level singleton store so anything subscribing to it stays in sync.
let stored = readStored()
let reduced = reducedMotionQuery?.matches ?? false
let forcedReduced = readReducedOverride()
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

// Returns whether animations were force-disabled via enableReducedMotion().
function readReducedOverride() {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(REDUCED_KEY) === 'true'
  } catch {
    return false
  }
}

// Enabled rule:
//   - A forced reduced-motion override always wins (animations off).
//   - Otherwise, if the user HAS an explicit stored choice, respect it
//     (override wins), even under reduced motion.
//   - Otherwise (no stored value) fall back to the default, which is ON unless
//     reduced motion is detected - in which case animations are off.
function getEnabled() {
  if (forcedReduced) return false
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

// Force animations off (a hard override that wins over any stored preference),
// then reload so the running instance tears down. Use disableReducedMotion() to
// clear it.
export function enableReducedMotion() {
  forcedReduced = true
  try {
    localStorage.setItem(REDUCED_KEY, 'true')
  } catch {
    /* ignore storage errors */
  }
  emit()
  if (typeof window !== 'undefined') window.location.reload()
}

// Clear the forced reduced-motion override (if any), then reload.
export function disableReducedMotion() {
  forcedReduced = false
  try {
    localStorage.removeItem(REDUCED_KEY)
  } catch {
    /* ignore storage errors */
  }
  emit()
  if (typeof window !== 'undefined') window.location.reload()
}

let cleanup = null
let bootCleanup = null
let bootTimeout = null
let bootStyle = null
let hasBooted = false // true after first hard-load boot, skips boot on SPA path changes (remains false until first boot, resets on hard reload)

// Runtime config for gclassOpts — 0 = defaults (no throttle, default GSAP ticker)
let currentThrottle = 0
let currentFps = 0
const configSubscribers = new Set()
function getConfigSnapshot() { return { throttlePerFrame: currentThrottle, fps: currentFps } }
function emitConfig() { configSubscribers.forEach(fn => fn(getConfigSnapshot())) }
function applyFps(fps) {
  const v = Number(fps) || 0
  currentFps = v
  if (v > 0) gsap.ticker.fps(v)
  else gsap.ticker.fps(0) // 0 = remove cap, fallback to rAF (GSAP default)
  emitConfig()
}
function normalizeGclassArgs(throttlePerFrame, fps) {
  // support gclassOpts({throttlePerFrame, fps}) object overload
  if (typeof throttlePerFrame === 'object' && throttlePerFrame !== null) {
    fps = throttlePerFrame.fps
    throttlePerFrame = throttlePerFrame.throttlePerFrame
  }
  const nextThrottle = throttlePerFrame == null ? 0 : Number(throttlePerFrame) || 0
  const nextFps = fps == null ? 0 : Number(fps) || 0
  return { nextThrottle, nextFps }
}

/**
 * Change GClass runtime options on the fly without reload.
 * gclassOpts(throttlePerFrame, fps) — both optional numbers.
 * gclassOpts() or gclassOpts(undefined, undefined) resets to defaults (no throttle, default ticker).
 * Also accepts gclassOpts({throttlePerFrame, fps}).
 * Example low-end button: onClick={() => gclassOpts(1, 30)}
 * Example reset: onClick={() => gclassOpts()} // 0, 60fps rAF
 */
export function gclassOpts(throttlePerFrame, fps) {
  const { nextThrottle, nextFps } = normalizeGclassArgs(throttlePerFrame, fps)
  currentThrottle = nextThrottle
  applyFps(nextFps)
  // re-wire observers with new throttle without full boot reload (if already running)
  if (typeof window !== 'undefined' && cleanup && !bootTimeout) {
    try { cleanup() } catch {}
    cleanup = null
    if (getEnabled()) cleanup = initListeners(document, currentThrottle)
  }
  // if boot is in progress we just store for next initAnimations; if not running, next initAnimations will use stored values
  return getConfigSnapshot()
}
export function getGClassConfig() { return getConfigSnapshot() }
export function subscribeGClassConfig(cb) {
  configSubscribers.add(cb)
  return () => configSubscribers.delete(cb)
}

const readBootTime = (els, fallback) => {
  let max = null
  for (const el of els) {
    const cls = [...el.classList].find(c => c.startsWith('boot-time-'))
    if (cls) {
      const n = Number(cls.slice('boot-time-'.length))
      if (!Number.isNaN(n)) max = max === null ? n : Math.max(max, n)
    }
  }
  return max ?? fallback
}

// Boots the GSAP animation system unless animations are disabled (stored "off"
// or reduced-motion fallback with no explicit choice). Idempotent: calling it
// again tears down any previous run first.
// Now also handles boot screen: any HTML/JSX with `.boot-up` anywhere is treated as the boot overlay.
// No separate initBoot needed - just call initAnimations().
// Boot stops all DOM rendering for defaults.bootTime (overwritten by boot-time-N class).
// throttlePerFrame / fps: forwarded to gclassOpts-equivalent runtime.
//   initAnimations(throttlePerFrame, fps) — positional numbers, 0/undefined = defaults
//   initAnimations({throttlePerFrame, fps}) — object overload
//   initAnimations() — uses last gclassOpts values (defaults on first call)
export function initAnimations(throttlePerFrame, fps) {
  // gclassOpts-style normalization: (throttle, fps) positional or {throttlePerFrame, fps} object
  // no args -> fallback to last gclassOpts values (defaults 0 = no throttle, default ticker)
  let effThrottle = currentThrottle
  let effFps = currentFps
  if (throttlePerFrame !== undefined || fps !== undefined) {
    const { nextThrottle, nextFps } = normalizeGclassArgs(throttlePerFrame, fps)
    effThrottle = nextThrottle
    effFps = nextFps
    currentThrottle = effThrottle
    currentFps = effFps
    if (effFps > 0) gsap.ticker.fps(effFps)
    else gsap.ticker.fps(0)
    emitConfig()
  } else {
    if (effFps > 0) gsap.ticker.fps(effFps)
    else gsap.ticker.fps(0)
  }
  if (typeof window === 'undefined' || !getEnabled()) return
  // boot already in progress (first mount in StrictMode) - ignore second mount
  if (bootTimeout) {
    console.log(`[initAnimations] boot already in progress - ignoring duplicate call`)
    return
  }
  if (cleanup) { cleanup(); cleanup = null }
  if (bootCleanup) { bootCleanup(); bootCleanup = null }
  if (bootStyle) { bootStyle.remove(); bootStyle = null; document.documentElement.classList.remove('gclass-booting') }

  const hideBootEls = (els) => {
    // React-safe: don't el.remove() - React owns the nodes and will throw
    // insertBefore/removeChild on next commit if we mutate outside React.
    // Hiding keeps React's tree intact but visually removes boot screen.
    els.forEach(el => {
      el.style.display = 'none'
      el.setAttribute('hidden', '')
      el.setAttribute('data-gclass-boot-hidden', '1')
    })
  }

  const bootEls = typeof document !== 'undefined' ? [...document.querySelectorAll(".boot-up")].filter(el => !el.hasAttribute('data-gclass-boot-hidden')) : []
  if (!bootEls.length) {
    // no .boot-up -> completely skip boot
  } else if (bootEls.length > 1) {
    console.error(`[initAnimations] Multiple .boot-up elements detected (${bootEls.length}) - skipping all boot animations`, bootEls)
    hideBootEls(bootEls)
    hasBooted = true
    // fall through to normal initListeners without pausing DOM
  } else if (hasBooted && !bootTimeout) {
    // path change after already booted (SPA navigation) - skip boot, hard reload resets hasBooted
    console.log(`[initAnimations] skipping boot on path change (already booted)`, bootEls)
    hideBootEls(bootEls)
    hasBooted = true
    // fall through
  } else {
    const bootEl = bootEls[0]
    const hasBootEnd = [...bootEl.classList].some(c => c.startsWith('boot-end-'))
    if (!hasBootEnd) {
      // no boot-end-* -> completely skip boot animation (still pause? spec says skip it)
      // spec: skip boot-end animation if no class, but still do boot pause? user said "completely skip it if no .boot-end-<name> class is present"
      // interpret as skip the exit animation only, still pause for bootTime
      // To match "completely skip it" for boot-end, we just don't play exit tween
    }
    const bootTime = readBootTime(bootEls, defaults.bootTime ?? 2)
    console.log(`[initAnimations] .boot-up found: ${bootEls.length} - pausing DOM for ${bootTime}s`, bootEls)
    hasBooted = true
    // stop all DOM rendering except .boot-up
    bootStyle = document.createElement('style')
    bootStyle.id = 'gclass-boot-style'
    bootStyle.textContent = `html.gclass-booting{visibility:hidden} html.gclass-booting .boot-up,html.gclass-booting .boot-up *{visibility:visible} html.gclass-booting .boot-up{position:fixed;inset:0;z-index:9999;display:grid;place-items:center}`
    document.head.appendChild(bootStyle)
    document.documentElement.classList.add('gclass-booting')
    // ensure boot els are visible even if nested inside hidden ancestors
    bootEls.forEach(el => { el.style.visibility = 'visible' })

    // animations inside boot screen must play while rest of DOM is hidden - init scoped to boot-up
    bootCleanup = initListeners(bootEl, effThrottle)

    bootTimeout = setTimeout(() => {
      const bootEndCls = [...bootEl.classList].find(c => c.startsWith('boot-end-'))
      if (!bootEndCls) {
        // no boot-end -> skip exit animation, just hide
        bootCleanup?.(); bootCleanup = null
        document.documentElement.classList.remove('gclass-booting')
        bootStyle?.remove(); bootStyle = null
        hideBootEls(bootEls)
        bootTimeout = null
        cleanup = initListeners(document, effThrottle)
        return
      }
      const name = bootEndCls.slice('boot-end-'.length) // e.g. spawn-blur
      const cfg = animations.find(a => a.sel === '.' + name)
      const from = cfg?.from
      const easeCl = [...bootEl.classList].find(c => c.startsWith('ease-'))
      const ease = easeCl ? easeCl.split('-')[1] : defaults.ease
      const dur = readBootTime([bootEl], defaults.effectDuration ?? 1) // reuse boot-time- or fallback to effectDuration; if boot-time used for pause, reuse same value for exit unless overridden
      // Actually use boot-end-time-N if present, else effectDuration
      const endTimeCls = [...bootEl.classList].find(c => c.startsWith('boot-end-time-'))
      const endDur = endTimeCls ? Number(endTimeCls.slice('boot-end-time-'.length)) : dur

      const finish = () => {
        bootCleanup?.(); bootCleanup = null
        document.documentElement.classList.remove('gclass-booting')
        bootStyle?.remove(); bootStyle = null
        hideBootEls(bootEls)
        bootTimeout = null
        cleanup = initListeners(document, effThrottle)
      }

      if (!cfg || !from) {
        console.warn(`[initAnimations] boot-end-${name} has no from state - removing without animation`)
        finish()
        return
      }
      // play spawn in reverse (visible -> hidden) before removing
      gsap.to(bootEl, { ...from, duration: endDur, ease, onComplete: finish })
    }, bootTime * 1000)
    return
  }

  cleanup = initListeners(document, effThrottle)
}
