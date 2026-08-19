// Shared "reset" helper for the live demo pages.
//
// Every animated demo element gets:
//   1. the `.appear` class — the engine's opt-in gate that animates an element
//      when it is (re-)added to the DOM, and
//   2. a small ↻ reset button that removes the element and re-inserts it, so
//      the MutationObserver re-wires and re-animates it from scratch.
//
// Order-grouped elements (`.priority-N.order`) share ONE button that re-animates
// the whole group together, preserving their stagger/order.
//
// This file MUST be loaded BEFORE gclass-bundle.js so it can snapshot each
// element's original (pre-engine) HTML before the engine splits/mutates it.
(function () {
  const ANIM = /^(spawn|expand|clip-|curtain|typewriter|count|shake|spin-|bounce|bell|pulse|radiate|float|marquee|magnet|click-|hover-|css-|scroll|parallax|progress-|pin|words|lines|letter|stagger|no-revert|reduced|appear|leave|flip|preserve|on-|time-|etime-|edelay-|amount-|mtime-|mgrow-|mtilt-|ctime-|priority-|order|reverse|ease-|spawn-num-|spawn-text)/

  // el -> { snapshot: fresh Element with `.appear` }
  const registry = new Map()
  // elements that belong to an order group (reset via the group button, not individually)
  const groupMembers = new Set()

  const isDemo = (el) =>
    el.nodeType === 1 &&
    el.classList &&
    el.classList.length > 0 &&
    [...el.classList].some((c) => ANIM.test(c))

  const makeButton = (label, onClick) => {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.textContent = label
    btn.className =
      "mt-2 block rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:border-slate-500 hover:text-cyan-300"
    btn.addEventListener("click", onClick)
    return btn
  }

  const snapshotFor = (el) => {
    const s = el.cloneNode(true)
    s.classList.add("appear")
    return s
  }

  const register = (el) => {
    if (registry.has(el)) return
    registry.set(el, { snapshot: snapshotFor(el) })
    el.classList.add("appear")
  }

  // Replace a single element with a fresh copy and re-register it.
  const resetOne = (el) => {
    const entry = registry.get(el)
    if (!entry) return
    const fresh = entry.snapshot.cloneNode(true)
    fresh.classList.add("appear")
    el.replaceWith(fresh)
    registry.set(fresh, { snapshot: entry.snapshot })
    return fresh
  }

  const resetGroup = (group) => {
    for (let i = 0; i < group.members.length; i++) {
      const fresh = resetOne(group.members[i])
      if (fresh) group.members[i] = fresh
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const demos = [...document.querySelectorAll("main [class]")].filter(isDemo)

    // Partition order-grouped elements (`.order`) by their nearest section.
    const orderGroups = new Map() // section -> { members: [] }
    demos.filter((el) => el.classList.contains("order")).forEach((el) => {
      const sec = el.closest("section") || el.parentElement
      if (!orderGroups.has(sec)) orderGroups.set(sec, { members: [] })
      const group = orderGroups.get(sec)
      group.members.push(el)
      groupMembers.add(el)
      register(el)
    })

    // Individual elements: one button each. The button always sits directly
    // after its element, so reset the element that currently precedes it — that
    // way repeated resets keep targeting the live element after replacements.
    demos.forEach((el) => {
      register(el)
      if (groupMembers.has(el)) return
      const btn = makeButton("↻ reset", () => {
        const current = btn.previousElementSibling
        if (current) resetOne(current)
      })
      el.insertAdjacentElement("afterend", btn)
    })

    // Order groups: one shared button per group.
    orderGroups.forEach((group) => {
      const last = group.members[group.members.length - 1]
      last.insertAdjacentElement("afterend", makeButton("↻ reset group", () => resetGroup(group)))
    })
  })
})()