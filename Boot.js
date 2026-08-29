import { initAnimations } from './AnimToggle.js'

// Raw JS boot overlay — framework-agnostic, no React.
// Shows #boot-overlay once per session, delays main DOM wiring until finished,
// and keeps Config.js animations usable inside the overlay.
// Works with any framework (vanilla, React, Vue, Svelte, Next, Nuxt, Angular) and with/without Tailwind.

let hasBooted = false
const BOOT_KEY = 'gclass-boot-done' // kept for optional persistence, not used for gate

const readBootTime = (el, fallback) => {
  const cls = [...el.classList].find(c => c.startsWith('boot-time-'))
  return cls ? Number(cls.slice('boot-time-'.length)) : fallback
}

export async function initBoot({ enabled = false, time = 2, id = 'boot-overlay', onDone } = {}) {
  if (typeof window === 'undefined') return () => {}
  if (!enabled) {
    initAnimations()
    return () => {}
  }
  if (hasBooted) {
    initAnimations()
    return () => {}
  }

  let overlay = document.getElementById(id)
  if (!overlay) {
    const tryFetch = async (url) => {
      try {
        const res = await fetch(url)
        if (res.ok) return await res.text()
      } catch {}
      return null
    }
    let html = await tryFetch(new URL('./Boot.html', import.meta.url).href)
    if (!html) html = await tryFetch('/Boot.html')
    if (!html) html = await tryFetch('./Boot.html')
    if (html) {
      const tpl = document.createElement('template')
      tpl.innerHTML = html.trim()
      const node = tpl.content.firstElementChild
      if (node) {
        document.body.prepend(node)
        overlay = document.getElementById(id) ?? node
      }
    }
  }
  if (!overlay) {
    initAnimations()
    return () => {}
  }

  hasBooted = true
  overlay.style.position = 'fixed'
  overlay.style.inset = '0'
  overlay.style.zIndex = '9999'
  overlay.style.display = 'grid'
  overlay.style.placeItems = 'center'
  if (!overlay.style.background && !overlay.style.backgroundColor) {
    overlay.style.background = '#020617'
  }

  // Isolate: detach all body content except overlay so first initAnimations() only wires overlay
  // This works for vanilla <main>, React #root, Vue #app, Next #__next, Nuxt, Svelte, Angular
  // Listeners.js scans body * regardless of display:none, so must physically detach
  const toIsolate = [...document.body.children].filter(el => {
    if (el.id === id) return false
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'TEMPLATE' || el.tagName === 'LINK') return false
    if (el.id === 'next-route-announcer' || el.hasAttribute('data-nextjs')) return false
    return true
  })
  const placements = toIsolate.map(el => ({ el, parent: el.parentNode, next: el.nextSibling }))
  placements.forEach(({ el }) => el.remove())
  const prevOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  initAnimations()
  placements.forEach(({ parent, next, el }) => {
    if (!parent || el.isConnected) return
    if (next && next.isConnected && next.parentNode === parent) {
      parent.insertBefore(el, next)
    } else {
      parent.appendChild(el)
    }
  })

  const duration = readBootTime(overlay, time)

  const timer = setTimeout(() => {
    overlay.style.transition = 'opacity 0.4s ease'
    overlay.style.opacity = '0'
    setTimeout(() => {
      overlay.remove()
      document.body.style.removeProperty('overflow')
      if (prevOverflow) document.body.style.overflow = prevOverflow
      initAnimations()
      onDone?.()
    }, 400)
  }, duration * 1000)

  return () => {
    clearTimeout(timer)
    document.body.style.removeProperty('overflow')
    if (prevOverflow) document.body.style.overflow = prevOverflow
    placements.forEach(({ el, parent, next }) => {
      if (!el.isConnected && parent) {
        if (next && next.isConnected && next.parentNode === parent) parent.insertBefore(el, next)
        else parent.appendChild(el)
      }
    })
  }
}

export async function createBootOverlay(html, opts = {}) {
  if (document.getElementById(opts.id ?? 'boot-overlay')) return initBoot(opts)
  if (!html) {
    const tryFetch = async (url) => {
      try { const r = await fetch(url); if (r.ok) return await r.text() } catch {}
      return null
    }
    html = await tryFetch(new URL('./Boot.html', import.meta.url).href)
    if (!html) html = await tryFetch('/Boot.html')
  }
  const div = document.createElement('div')
  div.id = opts.id ?? 'boot-overlay'
  if (!html) {
    div.className = `boot-time-${opts.time ?? 2}`
    div.style.cssText = 'position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:#020617;'
    div.innerHTML = '<h1 class="spawn-up time-1">Loading...</h1>'
  } else {
    const tpl = document.createElement('template')
    tpl.innerHTML = html.trim()
    const node = tpl.content.firstElementChild
    if (node) {
      document.body.prepend(node)
      return initBoot(opts)
    }
    div.innerHTML = html
  }
  document.body.prepend(div)
  return initBoot(opts)
}

export default initBoot
