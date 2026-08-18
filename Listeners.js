import gsap from 'gsap'
import { SpawnV, verticalmove, expandmove, magnet, reset, typewriter, countTargetVars } from './Animations'
import { customAnims } from './CustomAnims'
import { defaults, normalize } from './Config'
import { TextPlugin, ScrollTrigger, SplitText } from 'gsap/all'

// Prefix for SplitText text-reveal classes. Distinct from the raw `text-*`
// so it can't collide with Tailwind utility classes like `text-red-500`.
const TEXT_PREFIX = "spawn-text-"
const TEXT_PREFIX_LEN = TEXT_PREFIX.length

// The engine is fully config-driven. All animation definitions live in
// Config.js; here we just normalise them into the two internal views the
// machinery consumes (spawn/entrance + loop) plus the raw `all` list.
const { all: animAll, spawnConfigs, loopConfigs } = normalize(customAnims)

// --- Named onComplete handler registry -------------------------------------
// `on-<kind>-complete-<name>` classes resolve `<name>` to a function here
// (preferred) or to a global `window[<name>]` as a fallback. Register your
// handlers with `registerComplete(name, fn)` so the engine can find them
// without polluting the global scope.
const completeHandlers = new Map()
export function registerComplete(name, fn) {
    if (typeof fn === "function") completeHandlers.set(name, fn)
    return fn
}
export function resolveHandler(name) {
    if (completeHandlers.has(name)) return completeHandlers.get(name)
    if (typeof window !== "undefined" && typeof window[name] === "function") return window[name]
    return null
}

export default function initListeners() {
    gsap.registerPlugin(TextPlugin, ScrollTrigger, SplitText)

    const registeredListeners = []
        const onCompleteTweens = []
        const addListener = (el, type, fn) => {
            el.addEventListener(type, fn)
            registeredListeners.push({ el, type, fn })
        }
        const readClassNumber = (el, prefix, fallback) => {
            const match = [...el.classList].find(c => c.startsWith(prefix))
            return match ? Number(match.slice(prefix.length)) : fallback
        }
        const getEase = (el) => {
            const match = [...el.classList].find(c => c.startsWith("ease-"))
            return match ? match.split("-")[1] : defaults.ease
        }

        // Reduced-motion support. `.reduced` is a per-element opt-out: when the
        // OS has "reduce motion" enabled, any element carrying `.reduced` is left
        // completely un-animated (its spawn/loop/click/scroll/setup all skip).
        const reducedMotion = () =>
            (typeof window !== "undefined" && window.matchMedia?.(`(prefers-reduced-motion: reduce)`)?.matches) ?? false
        const isReduced = (el) => reducedMotion() && el.classList.contains("reduced")

        // `.preserve` keeps an already-rendered element (e.g. one that persists
        // in a shared layout across route changes) from being re-animated when
        // the Listeners setup re-runs. The element is animated the first time it
        // appears and tagged with data-gsap-preserved; on a later path change the
        // tag survives on the persistent DOM node, so setup skips it.
        // `.preserve` keeps an already-rendered element from being re-animated. It
        // applies to the element AND its children: any preserved ancestor also
        // suppresses animation on this node.
        const isPreserved = (el) => {
            for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
                if (node.classList.contains("preserve") && node.dataset.gsapPreserved) return true
            }
            return false
        }
        const markPreserved = (el) => { if (el.classList.contains("preserve")) el.dataset.gsapPreserved = "1" }

        // `spawnConfigs` is derived from the config in Config.js (see top of
        // file). Adding/removing an entry there automatically re-wires every
        // spawn feature below: order, scroll, leave, appear and text variants.

        // Leave animations derive from spawnConfigs so adding an entry here
        // automatically enables its leave/exit reverse too (single source of truth).
        const findSpawn = (el) => {
            const direct = spawnConfigs.find(({ sel }) => el.matches?.(sel))
            if (direct) return direct
            const cls = [...el.classList].find(c => c.startsWith(TEXT_PREFIX))
            if (!cls) return null
            return spawnConfigs.find(({ sel }) => sel === "." + cls.slice(TEXT_PREFIX_LEN))
        }

        const isGhost = (el) => el?.dataset?.gsapGhost === "1"
        // Ghosts (leave proxies) must be ignored by every observer, so strip all
        // magic classes and tag them. Otherwise they get re-captured and re-animated.
        const markGhost = (el) => {
            el.classList.remove("leave", "appear")
            spawnConfigs.forEach(({ sel }) => el.classList.remove(sel.slice(1)))
            el.setAttribute("data-gsap-ghost", "1")
        }

        const leaveStates = new WeakMap()

        const captureLeave = (node) => {
            if (!node.classList?.contains("leave")) return
            const config = findSpawn(node)
            if (!config || config.typewriter) return
            leaveStates.set(node, {
                html: node.outerHTML,
                rect: node.getBoundingClientRect(),
                tween: node._spawnTween || node._scrollTween,
                from: config.from,
                ease: getEase(node),
                parent: node.parentNode,
                next: node.nextElementSibling,
                margin: getComputedStyle(node).margin,
                zIndex: getComputedStyle(node).zIndex,
            })
        }

                const flipStates = new WeakMap()
        // Elements currently being flipped (re-entrancy guard).
        const flipping = new WeakSet()

        // Document-relative bounds. getBoundingClientRect() is viewport-relative,
        // so its values shift by window scroll; using document coords keeps the
        // FLIP delta free of any scroll that happened between capture and play.
        const flipPos = (node) => {
            const r = node.getBoundingClientRect()
            return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height }
        }

        // Capture the element's first (resting) bounds. A later layout change
        // morphs from this snapshot to the live position — a vanilla FLIP.
        const captureFlip = (node) => {
            if (!node.classList?.contains("flip")) return
            const config = findSpawn(node)
            if (!config || config.typewriter) return
            if (flipping.has(node)) return
            flipStates.set(node, flipPos(node))
        }

        // Last = current bounds; Invert = delta to rewind to the captured
        // bounds; Play = fromTo(transform) back to 0 so the element slides
        // from its first position into its new layout spot.
        const playFlip = (node) => {
            // A new flip supersedes an in-flight one: just kill the old tween
            // and clear its transform so the rect below reads the true layout,
            // otherwise the leftover mid-flight transform compounds each time.
            if (node._flipTween) {
                node._flipTween.kill()
                node._flipTween = null
                gsap.set(node, { clearProps: "transform" })
                flipping.delete(node)
            }

            const old = flipStates.get(node)
            const cur = flipPos(node)
            // Re-anchor the baseline to the current layout; if we have no
            // previous state this is just an initial capture.
            flipStates.set(node, cur)
            if (!old) return

            const dx = Math.round(old.x - cur.x)
            const dy = Math.round(old.y - cur.y)
            if (!dx && !dy) return

            flipping.add(node)
            node._flipTween = gsap.fromTo(node,
                { x: dx, y: dy },
                {
                    x: 0, y: 0,
                    duration: readClassNumber(node, "time-", defaults.effectDuration),
                    ease: getEase(node),
                    onComplete: () => {
                        flipping.delete(node)
                        node._flipTween = null
                    },
                }
            )
        }

        // Animate every captured `.flip` element under a scope whose layout just
        // changed (called after reflow, so Flip reads the new bounds).
        const animateFlip = (scope) => {
            if (!scope) return
            gsap.utils.toArray(scope.querySelectorAll?.(".flip") || [])
                .forEach((el) => { if (el.isConnected) playFlip(el) })
        }


        const playLeave = (node) => {
            const snap = leaveStates.get(node)
            leaveStates.delete(node)
            if (!snap || node._leaving) return
            node._leaving = true

            // Hold the removed node's layout space during the leave animation so
            // the content below doesn't jump up the instant it's removed. The
            // node is re-attached as a fixed ghost (out of layout), so without
            // this placeholder everything beneath snaps into place before the
            // exit finishes. The spacer is dropped once the leave completes.
            const placeSpacer = (snap) => {
                if (!snap.parent || snap.parent.nodeType !== 1) return null
                const spacer = document.createElement("div")
                spacer.style.cssText = `box-sizing:border-box;width:${snap.rect.width}px;height:${snap.rect.height}px;`
                if (snap.margin) spacer.style.margin = snap.margin
                // The captured `next` sibling may itself have been removed by the
                // time this runs (e.g. several siblings leave together). Only use
                // it as an anchor if it's still a live child; otherwise append.
                const next = snap.next && snap.next.parentNode === snap.parent ? snap.next : null
                snap.parent.insertBefore(spacer, next)
                return spacer
            }

            // True reverse of the real tween. If the node was already removed
            // (external removal), re-attach that same element fixed at its last
            // position so the reversed tween is actually visible. Observer-facing
            // classes are stripped so the re-attach can't re-trigger enter/leave.
            if (snap.tween) {
                const reattached = !node.isConnected
                const spacer = reattached ? placeSpacer(snap) : null
                if (reattached) {
                    node.classList.remove("leave", "appear", "scroll", "scroll-progress")
                    node.style.cssText = `position:fixed;z-index:${snap.zIndex};left:${snap.rect.left}px;top:${snap.rect.top}px;
                        width:${snap.rect.width}px;height:${snap.rect.height}px;margin:0;`
                    document.body.appendChild(node)
                }
                snap.tween.reverse()
                snap.tween.eventCallback("onReverseComplete", () => {
                    if (reattached) node.remove()
                    else node.style.display = "none"
                    spacer?.remove()
                })
                return
            }

            // Fallback: no tween captured -> clone a ghost and animate to the
            // spawn's "from" state (best-effort reverse).
            const ghost = document.createElement("div")
            ghost.innerHTML = snap.html
            const g = ghost.firstElementChild
            g.classList.remove("leave", "appear", "scroll", "scroll-progress")
            g.style.cssText = `position:fixed;z-index:${snap.zIndex};left:${snap.rect.left}px;top:${snap.rect.top}px;
                width:${snap.rect.width}px;height:${snap.rect.height}px;margin:0;`
            document.body.appendChild(g)
            const spacer = placeSpacer(snap)

            gsap.to(g, {
                ...snap.from,
                duration: defaults.effectDuration,
                ease: snap.ease || defaults.ease,
                onComplete: () => { g.remove(); spacer?.remove() },
            })
        }

        const collectLeave = (node) => {
            if (!node || node.nodeType !== 1) return []
            if (node.classList?.contains("leave")) return [node]
            return gsap.utils.toArray(node.querySelectorAll?.(".leave"))
        }

        // Refresh the cached rect to the element's RESTING position (after its
        // spawn transform settles), so re-attaching the leave ghost doesn't snap.
        const refreshLeaveRect = (el) => {
            const s = leaveStates.get(el)
            if (s) {
                s.rect = el.getBoundingClientRect()
                // The spawn tween is created AFTER captureLeave (which runs on
                // node-insert). Pick it up here so a later leave can reverse the
                // real tween (fading + counting back down) instead of a bare ghost.
                s.tween = el._spawnTween || el._scrollTween || s.tween
            }
        }

        // Selector covering every spawn/expand class plus its auto-generated
        // `.spawn-text-*` variant. Queried fresh inside getOrderDelay because the
        // captured set must always reflect the current DOM (dynamically added or
        // SplitText text elements can otherwise be missed, breaking their order).
        const orderSelector = () =>
            spawnConfigs.map(({ sel }) => sel).join(",") + "," +
            spawnConfigs.map(({ sel }) => "." + TEXT_PREFIX + sel.slice(1)).join(",")

        const getOrderDelay = (el, priority) => {
            const samepri = gsap.utils.toArray(orderSelector())
                .filter((e) => {
                    if (!e.classList.contains("order")) return false
                    const match = [...e.classList].find(p => p.startsWith("priority-"))
                    return (match ? Number(match.split("-")[1]) : 0) === priority
                })
            let order = samepri.indexOf(el)
            if (el.classList.contains("reverse")) {
                order = samepri.length - 1 - order
            }
            return order / defaults.orderDivide
        }

        const readTiming = (el) => {
            const priority = readClassNumber(el, "priority-", 0)
            return {
                delay: el.classList.contains("order")
                    ? getOrderDelay(el, priority)
                    : priority * defaults.spawnDelayMultiplier,
                duration: readClassNumber(el, "time-", 1),
                ease: getEase(el),
            }
        }

        // --- on-<kind>-complete-* handling ------------------------------------
        // Triggered when a spawn / loop / click tween finishes. The class names a
        // function to call, or (via `-anim-<name>`) an animation to play once.
        //   on-spawn-complete-<fn>          on-spawn-complete-anim-<anim>
        //   on-loop-complete-<fn>           on-loop-complete-anim-<anim>
        //   on-click-complete-<fn>          on-click-complete-anim-<anim>
        const playNamed = (el, name) => {
            const entry = animAll.find((a) => a.sel === "." + name)
            if (!entry) return
            // `.complete-time-N` / `.complete-delay-N` override the triggered
            // animation's duration / delay. They apply to spawn-style entries
            // (passed into `play`); loop entries define their own duration, so
            // only the delay is applied to them.
            const delay = readClassNumber(el, "complete-delay-", 0)
            const dur = readClassNumber(el, "complete-time-", 1)
            const tween = entry.play
                ? entry.play(el, delay, dur, getEase(el))
                : entry.build(el, readLoopCtx(el))
            if (!tween) return
            if (!entry.play) tween.delay(delay)
            el[name] = tween
            onCompleteTweens.push(tween)
        }
        const fireOnComplete = (el, kind) => {
            const prefix = `on-${kind}-complete-`
            const cls = [...el.classList].find((c) => c.startsWith(prefix))
            if (!cls) return
            const val = cls.slice(prefix.length)
            if (val.startsWith("anim-")) playNamed(el, val.slice(5))
            else {
                const fn = resolveHandler(val)
                if (fn) fn(el)
            }
        }

        const scrollTriggers = []
        const computeTo = (from) => {
            const to = {}
            for (const [key] of Object.entries(from)) {
                if (key === "opacity") to[key] = 1
                else if (key === "filter") to[key] = "blur(0px)"
                else if (key === "clipPath") to[key] = "inset(0% 0% 0% 0%)"
                else to[key] = key.startsWith("scale") ? 1 : 0
            }
            return to
        }

        // SplitText: `.spawn-text-<spawn/expand>` splits the element's text into
        // chars (or words/lines) and animates each part with the same `from`
        // state as its base spawn config. Granularity is chosen via an extra
        // `.words` / `.lines` class (default `chars`). Per-part stagger is set
        // with `stagger-N`.
        const textSplits = []
        const splitCache = new WeakMap()
        const RTL_RE = /[\u0590-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
        const isRTLText = (el) => RTL_RE.test(el.textContent || "")
        // Split granularity. Explicit `.lines` / `.words` override everything;
        // `.letter` opts back into the per-character mode (the old
        // default). Default (no class) is per-WORD: far fewer split nodes, so
        // the per-part spawn is much cheaper to animate and paint.
        const getGranularity = (el) => {
            if (el.classList.contains("lines")) return "lines"
            if (el.classList.contains("words")) return "words"
            if (el.classList.contains("letter")) return "chars"
            return "words"
        }
        // Cursive RTL scripts (Arabic/Persian) render each letter as a distinct
        // glyph and join neighbours during text shaping. Naively splitting at
        // char level puts each letter in its own span, breaking those joins so
        // words look disconnected/isolated (and for single-word strings would
        // collapse into one part). Instead we use GSAP's splitArabicText trick:
        // split into words first, then re-wrap every letter in its own span,
        // injecting Zero-Width-Joiners so neighbours stay connected while each
        // letter remains individually animatable.
        const RTL_NON_JOINABLE = /[اأإآدذرزوؤءة]/
        const RTL_DIACRITICS = /[\u064B-\u065F\u0670]/g
        // Spacing-only characters (the Persian half-space ZWNJ, a literal ZWJ and
        // whitespace) must not become tween targets; they are kept as inert text
        // nodes so the natural gap is preserved and never animated.
        const RTL_JOIN_BREAK = /[\u200C\u200D\s]/
        // A real Arabic/Persian joining letter. Any other visible character —
        // Latin, digits, punctuation (، ؟ ؛ . ! …) — is NOT a joining letter: it
        // must not give the preceding letter a trailing Zero-Width-Joiner (which
        // would render it in its connecting form instead of its correct END form),
        // but it should still be split into its own span so it animates too.
        const RTL_LETTER = /[\u0621-\u064A\u066E-\u06D5\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
        const getRTLCharSplit = (el) => new SplitText(el, {
            type: "words",
            linesClass: "gsap-line",
            wordsClass: "gsap-word",
            charsClass: "gsap-char",
            onSplit(self) {
                const ZWJ = "\u200D"
                const connects = (s) => !RTL_NON_JOINABLE.test(s.replace(RTL_DIACRITICS, "").slice(-1))
                self.chars.length = 0
                self.words.forEach((wordEl) => {
                    const chars = Array.from(wordEl.textContent)
                    const segs = []   // { text, brk:true=spacing, letter:false=punctuation }
                    let i = 0
                    while (i < chars.length) {
                        const c = chars[i]
                        if (RTL_JOIN_BREAK.test(c)) {
                            segs.push({ text: c, brk: true })
                            i++
                            continue
                        }
                        if (!RTL_LETTER.test(c)) {
                            segs.push({ text: c, brk: false, letter: false })
                            i++
                            continue
                        }
                        let g = c
                        if (c === "\u0644" && i + 1 < chars.length) {
                            let j = i + 1
                            let d = ""
                            while (j < chars.length && RTL_DIACRITICS.test(chars[j])) d += chars[j++]
                            if (j < chars.length && /[\u0622\u0623\u0625\u0627]/.test(chars[j])) {
                                g += d + chars[j]
                                i = j
                            }
                        }
                        while (i + 1 < chars.length && RTL_DIACRITICS.test(chars[i + 1])) {
                            g += chars[i + 1]
                            i++
                        }
                        i++
                        segs.push({ text: g, brk: false, letter: true })
                    }
                    wordEl.textContent = ""
                    let prevConnectable = false
                    segs.forEach((seg, si) => {
                        if (seg.brk) {
                            // keep spacing as an inert text node: it preserves the
                            // natural gap and never becomes a tween target
                            wordEl.appendChild(document.createTextNode(seg.text))
                            prevConnectable = false
                            return
                        }
                        if (!seg.letter) {
                            // visible non-letter (punctuation/digit/…): animate it
                            // as its own span but it never joins, and it ends the
                            // current run so the next letter can't connect to it
                            const pEl = document.createElement("div")
                            pEl.style.display = "inline-block"
                            pEl.className = "gsap-char"
                            pEl.textContent = seg.text
                            wordEl.appendChild(pEl)
                            self.chars.push(pEl)
                            prevConnectable = false
                            return
                        }
                        const connectable = connects(seg.text)
                        let s = seg.text
                        if (prevConnectable) s = ZWJ + s
                        const nextIsLetter = si + 1 < segs.length && segs[si + 1].letter
                        if (nextIsLetter && connectable) s += ZWJ
                        const charEl = document.createElement("div")
                        charEl.style.display = "inline-block"
                        charEl.className = "gsap-char"
                        charEl.textContent = s
                        wordEl.appendChild(charEl)
                        self.chars.push(charEl)
                        prevConnectable = connectable
                    })
                })
                self.words.forEach((w) => w.replaceWith(...w.childNodes))
                self.words.length = 0
            },
        })

        const getSplit = (el, gran) => {
            let s = splitCache.get(el)
            const rtlChars = gran === "chars" && isRTLText(el)
            const key = rtlChars ? "rtl-chars" : gran
            if (!s || s.granularity !== key) {
                s?.revert()
                s = rtlChars
                    ? getRTLCharSplit(el)
                    : new SplitText(el, {
                        type: gran,
                        linesClass: "gsap-line",
                        wordsClass: "gsap-word",
                        charsClass: "gsap-char",
                    })
                s.granularity = key
                splitCache.set(el, s)
                textSplits.push(s)
            }
            return s
        }
        const getParts = (el, gran) => {
            const s = getSplit(el, gran)
            const parts = (gran === "chars" && isRTLText(el)) ? (s.chars || []) : (s[gran] || [])
            // Explicitly promote each part to its own compositing layer. Chromium
            // does this automatically for animated elements; Firefox is
            // conservative and otherwise repaints these inline-block parts on the
            // main thread every frame, which is what makes split-text lag there.
            for (let i = 0; i < parts.length; i++) {
                parts[i].style.willChange = "transform, opacity"
            }
            return parts
        }

        // Collapse a split back into a single text node once the part-spawn
        // finishes. Unless the author opts out with `.no-revert`, this frees the
        // hundreds of per-letter elements so the browser stops reflowing them.
        const revertSplit = (el) => {
            if (el.classList.contains("no-revert")) return
            const s = splitCache.get(el)
            if (!s) return
            splitCache.delete(el)
            const idx = textSplits.indexOf(s)
            if (idx !== -1) textSplits.splice(idx, 1)
            s.revert()
        }
        // The whole point of `.time-X` on a `.spawn-text-X` element is that the
        // FULL reveal (first part starting to last part finishing) takes X
        // seconds, no matter how many chars/words/lines it got split into.
        // GSAP staggered tweens actually finish at `duration + stagger * (n-1)`,
        // so `dur` can't be handed straight to `duration` as before — instead we
        // solve for `duration`/`stagger` together so they always sum to `dur`.
        // An explicit `.stagger-N` class is honored as-is; only `duration` is
        // back-solved in that case so the last part still lands on `dur`.
        const playText = (el, from, delay, dur, ease) => {
            const gran = getGranularity(el)
            const parts = getParts(el, gran)
            if (!parts.length) return
            const requestedStagger = readClassNumber(el, "stagger-", null)
            let stagger, duration
            if (requestedStagger != null) {
                // Explicit stagger: honor it as-is, back-solve duration so the
                // last part still lands on `dur` (floored so motion stays visible
                // even if that pushes the true total slightly past `dur`).
                stagger = requestedStagger
                duration = Math.max(dur - stagger * (parts.length - 1), defaults.minTextPartDuration)
            } else {
                // No explicit stagger: keep each part's own duration a real,
                // visible chunk of time (not shrinking toward 0 as part count
                // grows) and shrink the STAGGER instead, so parts overlap more
                // as there are more of them but the whole reveal still finishes
                // at `dur`.
                duration = Math.min(dur, Math.max(dur / 3, defaults.minTextPartDuration))
                stagger = parts.length > 1 ? (dur - duration) / (parts.length - 1) : 0
            }
            return gsap.fromTo(parts, { ...from }, {
                ...computeTo(from), ease, duration, delay, stagger,
                onComplete: () => {
                    if (el.classList.contains("leave")) refreshLeaveRect(el)
                    revertSplit(el)
                    fireOnComplete(el, "spawn")
                },
            })
        }

        // Per-letter typewriter: split into chars and reveal each one in place,
        // one after another (stagger) so it reads like being typed, unlike the
        // single-stream TextPlugin `typewriter`. Already-typed chars stay visible.
        const playTypewriterSplit = (el, delay, dur, ease) => {
            const gran = getGranularity(el)
            const parts = getParts(el, gran)
            if (!parts.length) return
            const perChar = dur / Math.max(parts.length, 1)
            return gsap.fromTo(parts, { opacity: 0 }, {
                opacity: 1,
                ease,
                duration: Math.min(defaults.typewriterSplitCharDuration, perChar),
                delay,
                stagger: perChar,
                onComplete: () => revertSplit(el),
            })
        }

        const textClsFor = (el) => [...el.classList].find(c => c.startsWith(TEXT_PREFIX))
        const isTextElement = (el) => {
            const cls = textClsFor(el)
            if (!cls) return false
            return !!spawnConfigs.find(({ sel }) => sel === "." + cls.slice(TEXT_PREFIX_LEN))
        }
        // Sticky-pin: hold the element fixed to the viewport across a scroll
        // range. The range is `progress-start-N` -> `progress-end-N` when those
        // classes are present (N = how many % into view to engage, and how far
        // out of view to release), else the full `top top` -> `bottom bottom`.
        const setupPin = (el) => {
            if (!el.classList.contains("pin") || el.dataset.gsapPinned) return
            const clamp = (n) => Math.min(100, Math.max(0, n))
            const startClass = readClassNumber(el, "progress-start-", null)
            const endClass = readClassNumber(el, "progress-end-", null)
            const start = startClass != null ? `top ${clamp(100 - startClass)}%` : "top top"
            const end = endClass != null ? `top ${clamp(100 - endClass)}%` : "bottom bottom"
            const t = ScrollTrigger.create({
                trigger: el,
                start,
                end,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
            })
            el.dataset.gsapPinned = "1"
            scrollTriggers.push(t)
        }

        // Pins inject spacers that shift everything below them, so they MUST be
        // created before any scroll/scroll-progress trigger measures its position.
        // Setting them up here (before the trigger pass below) keeps offsets correct
        // and lets the single ScrollTrigger.refresh() at the end reconcile layout.
        gsap.utils.toArray(".pin").forEach(setupPin)

        // Scroll-driven extras — class-driven ScrollTrigger behaviours that don't
        // fit the spawn/loop machinery (no `play`/`build`), handled like `.pin`:
        //   .parallax-N            - element drifts relative to scroll. N is a
        //                            speed factor: 1 = static, <1 = slower,
        //                            >1 = faster (opposite travel direction).
        //   .progress-bar/.scroll-fill - fill 0->100% across a scroll range
        //                            (scaleX, anchored left). progress-start-N /
        //                            progress-end-N / progress-reverse honored.
        //   .scroll-fade-bg         - lerp background-position across scroll
        //                            (needs a background larger than the box).
        //   .scroll-horizontal      - pinned section that pans its `.scroll-track`
        //                            child left across the pinned range.
        // (.clip-reveal and .curtain-* are spawn classes defined in Config.js,
        // so they flow through the normal spawn/scroll/appear/leave machinery.)
        const setupScrollDriven = (el) => {
            if (el.dataset?.gsapScrollDriven) return
            el.dataset.gsapScrollDriven = "1"
            if (isReduced(el)) return
            const cls = [...el.classList]
            const clamp = (n) => Math.min(100, Math.max(0, n))

            const parallaxCls = cls.find((c) => c.startsWith("parallax-"))
            if (parallaxCls) {
                const factor = parseFloat(parallaxCls.slice("parallax-".length)) || 1
                if (factor === 1) return
                const amt = (factor - 1) * 50
                const t = gsap.fromTo(el,
                    { yPercent: -amt },
                    {
                        yPercent: amt, ease: "none",
                        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
                    }
                )
                scrollTriggers.push(t.scrollTrigger)
                return
            }

            if (el.classList.contains("progress-bar") || el.classList.contains("scroll-fill")) {
                const startClass = readClassNumber(el, "progress-start-", null)
                const endClass = readClassNumber(el, "progress-end-", null)
                const t = gsap.fromTo(el,
                    { scaleX: 0 },
                    {
                        scaleX: 1, ease: "none", transformOrigin: "left center",
                        scrollTrigger: {
                            trigger: el,
                            start: startClass != null ? `top ${clamp(100 - startClass)}%` : "top bottom",
                            end: endClass != null ? `top ${clamp(100 - endClass)}%` : "bottom top",
                            scrub: true,
                            reversed: el.classList.contains("progress-reverse"),
                        },
                    }
                )
                scrollTriggers.push(t.scrollTrigger)
                return
            }

            if (el.classList.contains("scroll-fade-bg")) {
                const t = gsap.fromTo(el,
                    { backgroundPosition: "0% 0%" },
                    {
                        backgroundPosition: "100% 100%", ease: "none",
                        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
                    }
                )
                scrollTriggers.push(t.scrollTrigger)
                return
            }

            if (el.classList.contains("scroll-horizontal")) {
                const track = el.querySelector(".scroll-track")
                if (!track) return
                const getAmount = () => track.scrollWidth - el.clientWidth
                const t = gsap.to(track, {
                    x: () => -getAmount(), ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "top top",
                        end: () => `+=${getAmount()}`,
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })
                scrollTriggers.push(t.scrollTrigger)
            }
        }
        gsap.utils.toArray('[class^="parallax-"], .progress-bar, .scroll-fill, .scroll-fade-bg, .scroll-horizontal').forEach(setupScrollDriven)

        // `.scroll`/`.scroll-progress` entrance animation, driven by ScrollTrigger.
        // Split out into a helper so DYNAMICALLY-added elements (e.g. pagination
        // rendered after a data fetch) get a trigger too, instead of only elements
        // already in the DOM at setup time. A `.scroll` element is owned by its
        // ScrollTrigger; `animateAppear` skips it so the entrance never double-fires.
        const setupScroll = (el) => {
            if (el.dataset?.gsapScroll) return
            if (isTextElement(el)) return
            if (isReduced(el)) return
            el.dataset.gsapScroll = "1"
            const config = findSpawn(el)
            if (!config) return
            const { from, typewriter: isTypewriter, typewriterSplit, play } = config

            if (el.classList.contains("scroll-progress")) {
                const ease = isTypewriter
                    ? ([...el.classList].find(c => c.startsWith("ease-"))?.split("-")[1] ?? "none")
                    : getEase(el)

                const to = {}
                for (const [key] of Object.entries(from)) {
                    if (key === "opacity") to[key] = 1
                    else if (key === "filter") to[key] = "blur(0px)"
                    else if (key === "text") to[key] = el.innerHTML
                    else if (key === "clipPath") to[key] = "inset(0% 0% 0% 0%)"
                    else to[key] = key.startsWith("scale") ? 1 : 0
                }

                const startClass = readClassNumber(el, "progress-start-", null)
                const endClass = readClassNumber(el, "progress-end-", null)
                const clamp = (n) => Math.min(100, Math.max(0, n))

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: startClass != null ? `top ${clamp(100 - startClass)}%` : defaults.progressStart,
                        end: endClass != null ? `top ${clamp(100 - endClass)}%` : defaults.progressEnd,
                        scrub: true,
                        reversed: el.classList.contains("progress-reverse"),
                    },
                })
                if (config.count) {
                    // Counter driven by scroll progress: count from `.spawn-num-N`
                    // to the target as the scrub advances (no opacity fade).
                    const { start, end, decimals } = countTargetVars(el)
                    const obj = { n: start }
                    tl.fromTo(obj, { n: start }, { n: end, ease, onUpdate: () => { el.textContent = obj.n.toFixed(decimals) } }, 0)
                } else if (typewriterSplit) {
                    const parts = getParts(el, getGranularity(el))
                    if (parts.length) tl.fromTo(parts, { opacity: 0 }, { opacity: 1, ease })
                } else {
                    tl.fromTo(el, { ...from }, { ...to, ease })
                }
                scrollTriggers.push(tl.scrollTrigger)
                return
            }

            if (!el.classList.contains("scroll")) return
            const { delay, duration } = readTiming(el)
            const ease = isTypewriter
                ? ([...el.classList].find(c => c.startsWith("ease-"))?.split("-")[1] ?? "none")
                : getEase(el)

            const fullText = el.innerHTML

            const enter = () => {
                if (el._scrollTween) el._scrollTween.kill()
                el._scrollTween = isTypewriter
                    ? (typewriterSplit
                        ? playTypewriterSplit(el, delay, duration, ease)
                        : typewriter(el, fullText, duration, delay, ease))
                    : play(el, delay, duration, ease)
                el._scrollTween.eventCallback("onComplete", () => fireOnComplete(el, "spawn"))
            }
            const reverseToStart = () => {
                if (config.count) {
                    // A count spawn is a pure number timeline. Reversing it counts
                    // back down to the `.spawn-num-N` start value, so re-entering
                    // view counts up cleanly from scratch.
                    const t = el._scrollTween
                    if (t && t.progress() > 0 && !t.reversed()) t.reverse()
                    return
                }
                el._scrollTween?.kill()
                if (isTypewriter && !typewriterSplit) {
                    el.innerHTML = fullText
                    return
                }
                if (typewriterSplit) {
                    const parts = getParts(el, getGranularity(el))
                    if (parts.length) gsap.to(parts, { opacity: 0, ease, duration: 0.3 })
                    return
                }
                el._scrollTween = gsap.to(el, { ...from, ease, duration: 0.3 })
            }

            const st = ScrollTrigger.create({
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                onEnter: enter,
                onEnterBack: enter,
                onLeave: reverseToStart,
                onLeaveBack: reverseToStart,
            })
            scrollTriggers.push(st)
        }
        gsap.utils.toArray(".scroll, .scroll-progress").forEach(setupScroll)

        // SplitText scroll variants: `.spawn-text-<spawn>.scroll` plays the per-part
        // tween when the element enters the viewport and reverses on exit.
        spawnConfigs.forEach(({ sel, from, typewriter: isTypewriter, text }) => {
            if (isTypewriter || text === false) return
            const tSel = "." + TEXT_PREFIX + sel.slice(1)

            gsap.utils.toArray(tSel + ".scroll:not(.scroll-progress)").forEach((el) => {
                if (isReduced(el)) return
                const { delay, duration } = readTiming(el)
                const ease = getEase(el)
                const enter = () => {
                    el._scrollTween?.kill()
                    el._scrollTween = playText(el, from, delay, duration, ease)
                }
                const reverseToStart = () => {
                    el._scrollTween?.kill()
                    const parts = getParts(el, getGranularity(el))
                    if (parts.length) gsap.to(parts, { ...from, ease, duration: 0.3 })
                }
                scrollTriggers.push(ScrollTrigger.create({
                    trigger: el,
                    start: "top bottom",
                    end: "top top",
                    onEnter: enter,
                    onEnterBack: enter,
                    onLeave: reverseToStart,
                    onLeaveBack: reverseToStart,
                }))
            })

            gsap.utils.toArray(tSel + ".scroll-progress").forEach((el) => {
                if (isReduced(el)) return
                const ease = getEase(el)
                const parts = getParts(el, getGranularity(el))
                if (!parts.length) return
                const to = computeTo(from)
                const startClass = readClassNumber(el, "progress-start-", null)
                const endClass = readClassNumber(el, "progress-end-", null)
                const clamp = (n) => Math.min(100, Math.max(0, n))
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: startClass != null ? `top ${clamp(100 - startClass)}%` : defaults.progressStart,
                        end: endClass != null ? `top ${clamp(100 - endClass)}%` : defaults.progressEnd,
                        scrub: true,
                        reversed: el.classList.contains("progress-reverse"),
                    },
                })
                tl.fromTo(parts, { ...from }, { ...to, ease })
                scrollTriggers.push(tl.scrollTrigger)
            })
        })
        ScrollTrigger.refresh()
        window.addEventListener("load", ScrollTrigger.refresh)

        // Entrance tweens (expand-down / spawn-down on containers) shift layout
        // while they run. ScrollTriggers bound to their descendants (list rows,
        // pagination, cards) that get measured mid-animation report stale,
        // compressed positions, so they all fire onEnter/onLeave at the same
        // scroll spot regardless of their real resting place. Debounce a refresh
        // that fires shortly after the LAST entrance tween completes, re-measuring
        // every trigger at its true position.
        let refreshTimer = null
        const scheduleRefresh = () => {
            clearTimeout(refreshTimer)
            refreshTimer = setTimeout(() => {
                refreshTimer = null
                ScrollTrigger.refresh()
            }, 60)
        }
        // A couple of early passes too, in case no entrance tween completes on a
        // scroll-only page: catch mounts that settle before anything finishes.
        setTimeout(scheduleRefresh, 400)
        setTimeout(scheduleRefresh, 1200)

        spawnConfigs.forEach(({ sel, typewriter: isTypewriter, typewriterSplit, play }) => {
            gsap.utils.toArray(sel).forEach((el) => {
                if (el.classList.contains("scroll") || el.classList.contains("scroll-progress")) return
                if (isPreserved(el)) return
                if (isReduced(el)) return
                const { delay, duration } = readTiming(el)
                if (isTypewriter) {
                    const easeClass = [...el.classList].find(c => c.startsWith("ease-"))
                    const elEase = easeClass ? easeClass.split("-")[1] : "none"
                    if (typewriterSplit) {
                        el._spawnTween = playTypewriterSplit(el, delay, duration, elEase)
                    } else {
                        el.typewriter?.kill()
                        el.typewriter = typewriter(el, el.innerHTML, duration, delay, elEase)
                    }
                } else {
                    el._spawnTween = play(el, delay, duration, getEase(el))
                    el._spawnTween.eventCallback("onComplete", () => {
                        if (el.classList.contains("leave")) refreshLeaveRect(el)
                        if (el.classList.contains("flip")) captureFlip(el)
                        if (isCompatibility(el)) resumeCompatLoops(el)
                        scheduleRefresh()
                        fireOnComplete(el, "spawn")
                    })
                }
                markPreserved(el)
            })
        })

        // SplitText static pass: `.spawn-text-<spawn>` plays the per-part tween on
        // load (no scroll/appear). Derived from spawnConfigs so any new spawn
        // class automatically gets a `.spawn-text-` variant.
        spawnConfigs.forEach(({ sel, from, typewriter: isTypewriter, text }) => {
            if (isTypewriter || text === false) return
            const tSel = "." + TEXT_PREFIX + sel.slice(1)
            gsap.utils.toArray(tSel).forEach((el) => {
                if (el.classList.contains("scroll") || el.classList.contains("scroll-progress")) return
                if (isPreserved(el)) return
                if (isReduced(el)) return
                const { delay, duration } = readTiming(el)
                el._spawnTween = playText(el, from, delay, duration, getEase(el))
                markPreserved(el)
            })
        })

        const magnetQuery = typeof window !== "undefined" ? window.matchMedia("(hover: none)") : null
        const magnetState = []
        const magnetListeners = []
        const magnetOnMove = (el, pull, grow, duration, elEase) => (ev) => {
            const r = el.getBoundingClientRect()
            const dx = ev.clientX - (r.left + r.width / 2)
            const dy = ev.clientY - (r.top + r.height / 2)
            magnet(el, dx * pull, dy * pull, grow, duration, elEase)
        }
        const magnetOnLeave = (el, duration, elEase) => () => magnet(el, 0, 0, 1, duration, elEase)

        const applyMagnet = () => {
            if (!magnetQuery) return
            const touch = magnetQuery.matches

            magnetListeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn))
            magnetListeners.length = 0

            if (touch) return

            magnetState.forEach(({ el, onMove, onLeave }) => {
                el.addEventListener("mousemove", onMove)
                el.addEventListener("mouseleave", onLeave)
                magnetListeners.push({ el, type: "mousemove", fn: onMove }, { el, type: "mouseleave", fn: onLeave })
            })
        }

        const setupMagnet = (el) => {
            if (!el.classList.contains("magnet")) return
            const duration = readClassNumber(el, "mtime-", 0.4)
            const pull = readClassNumber(el, "amount-", 0.3)
            const grow = readClassNumber(el, "mgrow-", 1.1)
            const elEase = getEase(el)

            magnetState.push({
                el,
                onMove: magnetOnMove(el, pull, grow, duration, elEase),
                onLeave: magnetOnLeave(el, duration, elEase),
            })
        }

        if (magnetQuery) magnetQuery.addEventListener("change", applyMagnet)

        // `.compatibility` lets an always-on loop (shake/bounce/pulse/...) coexist
        // with a hover/click interaction on the SAME element. Both write to the
        // same transform properties, so without this the two tweens fight. While
        // a hover/click is active we pause every tracked loop tween on the element
        // and resume it once the interaction ends. Loops are only tracked when the
        // `.compatibility` class is present, so nothing else changes behaviour.
        const isCompatibility = (el) => el.classList.contains("compatibility")
        const compatLoopsOf = (el) => {
            if (!el._gsapCompatLoops) el._gsapCompatLoops = []
            return el._gsapCompatLoops
        }
        const trackCompatLoop = (el, tween) => {
            if (tween && isCompatibility(el)) compatLoopsOf(el).push(tween)
            return tween
        }
        const pauseCompatLoops = (el) => compatLoopsOf(el).forEach((t) => t.pause())
        const resumeCompatLoops = (el) => compatLoopsOf(el).forEach((t) => t.resume())

        const setupClicks = (el) => {
            if (isReduced(el)) return
            setupMagnet(el)
            if (el.classList.contains("click-hover")) {
                const area = wrapTarget(el)
                let touch = false
                const duration = readClassNumber(el, "ctime-", defaults.clickDuration)
                const lift = readClassNumber(el, "amount-", defaults.clickOffset)
                const elEase = getEase(el)

                addListener(area, "mousedown", () => { if (!touch) { pauseCompatLoops(el); verticalmove(el, -lift / 2, duration, elEase) } })
                addListener(area, "mouseover", () => { if (!touch) { pauseCompatLoops(el); verticalmove(el, -lift, duration, elEase) } })
                addListener(area, "mouseleave", () => { if (!touch) { verticalmove(el, 0, duration, elEase); resumeCompatLoops(el) } })
                addListener(area, "mouseup", () => { if (!touch) verticalmove(el, -lift, duration, elEase) })

                addListener(area, "touchstart", () => { touch = true, pauseCompatLoops(el), verticalmove(el, lift / 2, duration, elEase) })
                addListener(area, "touchend", () => {
                    touch = true, verticalmove(el, 0, duration, elEase), setTimeout(() => { touch = false }, 0)
                })
            }
            if (el.classList.contains("click-expand")) {
                let touch = false
                const duration = readClassNumber(el, "ctime-", defaults.clickDuration)
                const lift = readClassNumber(el, "amount-", defaults.clickExpandOffset)
                const elEase = getEase(el)

                addListener(el, "mousedown", () => { if (!touch) { pauseCompatLoops(el); expandmove(el, 1, duration, elEase).eventCallback("onComplete", () => fireOnComplete(el, "click")) } })
                addListener(el, "mouseover", () => { if (!touch) { pauseCompatLoops(el); expandmove(el, lift, duration, elEase) } })
                addListener(el, "mouseleave", () => { if (!touch) { expandmove(el, 1, duration, elEase); resumeCompatLoops(el) } })
                addListener(el, "mouseup", () => { if (!touch) expandmove(el, lift, duration, elEase) })

                addListener(el, "touchstart", () => { touch = true, pauseCompatLoops(el), expandmove(el, lift, duration, elEase) })
                addListener(el, "touchend", () => {
                    touch = true, expandmove(el, 1, duration, elEase).eventCallback("onComplete", () => fireOnComplete(el, "click")), setTimeout(() => { touch = false }, 0)
                })
            }
        }

        // `loopConfigs` is derived from the config in Config.js (see top of file).
        // A shared ctx object bundles the per-element timing/ease classes so each
        // entry's `build(el, ctx)` stays simple and declarative.
        const readLoopCtx = (el) => ({
            edelay: readClassNumber(el, "edelay-", defaults.effectDelay),
            amount: readClassNumber(el, "amount-", defaults.effectOffset),
            etime: readClassNumber(el, "etime-", defaults.effectDuration),
            ease: getEase(el),
            time: readClassNumber(el, "time-", 20),
            mH: readClassNumber(el, "marquee-horizontal-offset-", 0),
            mV: readClassNumber(el, "marquee-vertical-offset-", 0),
            radiateZ: readClassNumber(el, "radiate-z-", null),
        })

        const loopEls = []
        const buildLoops = (el) => {
            if (isReduced(el)) return
            const ctx = readLoopCtx(el)
            loopConfigs.forEach(({ sel, build, key, loop }) => {
                if (el.matches(sel)) {
                    el[key]?.kill()
                    el[key] = trackCompatLoop(el, build(el, ctx))
                    if (loop) el[key].repeat(-1)
                    // Infinite loops never truly complete, so fire on each cycle
                    // (onRepeat); finite ones fire on their real completion.
                    el[key].eventCallback(el[key].repeat() === -1 ? "onRepeat" : "onComplete",
                        () => fireOnComplete(el, "loop"))
                }
            })
        }
        // Find an in-progress spawn tween on the element or any ancestor. For a
        // `.compatibility` element, loop building is deferred until that spawn
        // settles so clone-based loops (radiate) capture the rect at the element's
        // FINAL position instead of its mid-spawn transform offset.
        const findSpawnTween = (el) => {
            for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
                const t = node._spawnTween
                if (t && t.progress() < 1) return t
            }
            return null
        }
        const deferLoopBuild = (el, tween) => {
            if (!tween.__gsapPendingLoops) tween.__gsapPendingLoops = new Set()
            tween.__gsapPendingLoops.add(el)
            if (tween.__gsapPendingHooked) return
            tween.__gsapPendingHooked = true
            const existing = tween.eventCallback("onComplete")
            tween.eventCallback("onComplete", function () {
                existing && existing.call(this)
                const pending = tween.__gsapPendingLoops
                tween.__gsapPendingLoops = new Set()
                tween.__gsapPendingHooked = false
                pending.forEach((e) => buildLoops(e))
            })
        }
        const setupLoops = (el) => {
            const spawnTween = isCompatibility(el) ? findSpawnTween(el) : null
            if (spawnTween) {
                deferLoopBuild(el, spawnTween)
                return
            }
            buildLoops(el)
        }

        // `hover-<name>` and `click-<name>` trigger one of the loop animations on
        // mouseenter/mousedown. The element is wrapped in a parent div that acts as
        // the stable hover/click hit area, while the element itself animates — so
        // the WHOLE box moves/scales instead of just its text, and the area never
        // shifts under the cursor. Marquee is skipped (its build restructures the
        // DOM).
        const wrapTarget = (el) => {
            if (!el.classList.contains("wrapdiv")) return el
            if (el._gsapWrap) return el._gsapWrap
            const area = document.createElement("div")
            el.before(area)
            area.appendChild(el)
            el._gsapWrap = area
            return area
        }

        const setupHoverClick = (el) => {
            if (isReduced(el)) return
            const ctx = readLoopCtx(el)
            loopConfigs.forEach(({ sel, build, key }) => {
                if (sel.startsWith(".marquee")) return
                const name = sel.slice(1)
                if (el.classList.contains("hover-" + name)) {
                    const area = wrapTarget(el)
                    addListener(area, "mouseenter", () => {
                        pauseCompatLoops(el)
                        el[key]?.kill()
                        el[key] = build(el, ctx).repeat(-1)
                        el[key].eventCallback("onRepeat", () => fireOnComplete(el, "loop"))
                    })
                    addListener(area, "mouseleave", () => {
                        el[key]?.kill()
                        el[key] = reset(el, readClassNumber(el, "etime-", defaults.effectDuration), getEase(el))
                        resumeCompatLoops(el)
                    })
                } else if (el.classList.contains("click-" + name)) {
                    const area = wrapTarget(el)
                    addListener(area, "mousedown", () => {
                        pauseCompatLoops(el)
                        el[key]?.kill()
                        el[key] = build(el, ctx)
                        el[key].eventCallback("onComplete", () => fireOnComplete(el, "click"))
                    })
                    addListener(area, "mouseleave", () => {
                        resumeCompatLoops(el)
                    })
                }
            })
        }

        // Dynamic arbitrary-property animation. Class shape:
        //   css-<prop>-<from>-<to>          -> ping-pong loop (yoyo)
        //   spawn-css-<prop>-<from>-<to>    -> play once on load/appear
        //   hover-css-<prop>-<from>-<to>    -> ping-pong while hovered
        //   click-css-<prop>-<from>-<to>    -> play once on mousedown
        //   hover-css-<prop>-<to>           -> simple hold while hovered (no from),
        //                                    reverts to the original value on leave
        //   click-css-<prop>-<to>           -> simple one-shot to the value on mousedown
        // Values are numbers (decimals/negatives ok). hover/click wrap in a div
        // so the hit area stays fixed; `from` should equal the resting value.
        const CSS_VAL = "(-?\\d+(?:\\.\\d+)?|#[0-9a-fA-F]{3,8})"
        const CSS_ANIM_RE = new RegExp(`^((spawn|hover|click)-)?css-([a-zA-Z]+)-${CSS_VAL}-${CSS_VAL}$`)
        const CSS_SINGLE_RE = new RegExp(`^((hover|click)-)css-([a-zA-Z]+)-${CSS_VAL}$`)
        const parseCssVal = (s) => /^#/.test(s) ? s : Number(s)
        const parseCssAnim = (el) => {
            for (const c of el.classList) {
                let m = c.match(CSS_ANIM_RE)
                if (m) return { mode: m[2] || "loop", prop: m[3], from: parseCssVal(m[4]), to: parseCssVal(m[5]) }
                m = c.match(CSS_SINGLE_RE)
                if (m) return { mode: m[2], prop: m[3], to: parseCssVal(m[4]), single: true }
            }
            return null
        }
        const cssTweens = []
        const setupCssAnims = (el) => {
            if (isReduced(el)) return
            const anim = parseCssAnim(el)
            if (!anim) return
            const dur = readClassNumber(el, "time-", 1)
            const ease = getEase(el)
            const key = "_cssAnim"
            const loopVars = { [anim.prop]: anim.to, duration: dur, ease, yoyo: true, repeat: -1 }
            if (anim.mode === "loop") {
                el[key]?.kill()
                el[key] = gsap.fromTo(el, { [anim.prop]: anim.from }, loopVars)
                cssTweens.push(el[key])
            } else if (anim.mode === "spawn") {
                el[key]?.kill()
                el[key] = gsap.fromTo(el, { [anim.prop]: anim.from }, { [anim.prop]: anim.to, duration: dur, ease })
                cssTweens.push(el[key])
            } else if (anim.mode === "hover") {
                const area = wrapTarget(el)
                if (anim.single) {
                    // Single-value hover: tween to the target and HOLD for as long
                    // as it's hovered; on leave, revert to the element's original
                    // value (captured at setup, before any animation touched it).
                    const original = gsap.getProperty(el, anim.prop)
                    addListener(area, "mouseenter", () => {
                        el[key]?.kill()
                        el[key] = gsap.to(el, { [anim.prop]: anim.to, duration: dur, ease })
                        cssTweens.push(el[key])
                    })
                    addListener(area, "mouseleave", () => {
                        el[key]?.kill()
                        el[key] = gsap.to(el, { [anim.prop]: original, duration: dur, ease })
                        cssTweens.push(el[key])
                    })
                } else {
                    addListener(area, "mouseenter", () => {
                        el[key]?.kill()
                        el[key] = gsap.fromTo(el, { [anim.prop]: anim.from }, { ...loopVars })
                        cssTweens.push(el[key])
                    })
                    addListener(area, "mouseleave", () => {
                        el[key]?.kill()
                        el[key] = gsap.to(el, { [anim.prop]: anim.from, duration: dur, ease })
                        cssTweens.push(el[key])
                    })
                }
            } else if (anim.mode === "click") {
                const area = wrapTarget(el)
                if (anim.single) {
                    // Single-value click: tween to the target while pressed, then
                    // revert to the element's original value on mouseup.
                    const original = gsap.getProperty(el, anim.prop)
                    addListener(area, "mousedown", () => {
                        el[key]?.kill()
                        el[key] = gsap.to(el, { [anim.prop]: anim.to, duration: dur, ease })
                        el[key].eventCallback("onComplete", () => fireOnComplete(el, "click"))
                        cssTweens.push(el[key])
                    })
                    addListener(area, "mouseup", () => {
                        el[key]?.kill()
                        el[key] = gsap.to(el, { [anim.prop]: original, duration: dur, ease })
                        cssTweens.push(el[key])
                    })
                } else {
                    addListener(area, "mousedown", () => {
                        el[key]?.kill()
                        el[key] = gsap.fromTo(el, { [anim.prop]: anim.from }, { [anim.prop]: anim.to, duration: dur, ease, yoyo: true, repeat: 1 })
                        el[key].eventCallback("onComplete", () => fireOnComplete(el, "click"))
                        cssTweens.push(el[key])
                    })
                }
            }
        }

        // Per-entry `setup` hook: a "special abilities" extension point. Any
        // config entry with a `setup(el, ctx)` function runs it once for every
        // matching element at wiring time — for behaviour that doesn't fit the
        // scroll/order/loop machinery. If it RETURNS a function, that's treated
        // as a teardown and invoked when the whole engine is torn down, so
        // side-effects (listeners, observers, timers) can be cleaned up.
        const setupTeardowns = []
        const runSetup = (el) => {
            if (isReduced(el)) return
            const ctx = readLoopCtx(el)
            animAll.forEach((a) => {
                if (a.setup && el.matches?.(a.sel)) {
                    const teardown = a.setup(el, ctx)
                    if (typeof teardown === "function") setupTeardowns.push(teardown)
                }
            })
        }

        // Bind click + loop animations to every element present at load, tagging
        // them so the MutationObserver below never double-binds a dynamic one.
        gsap.utils.toArray("body *").forEach((el) => {
            if (el.dataset?.gsapSetup) return
            el.dataset.gsapSetup = "1"
            setupClicks(el)
            setupLoops(el)
            setupHoverClick(el)
            setupCssAnims(el)
            runSetup(el)
        })
        applyMagnet()

        // Layout-change morphs. Deferred to a single rAF past the mutation so
        // layout has settled and the morph reads final positions. Multiple
        // mutations from one commit coalesce; the re-entrancy `flipping` set
        // stops the observer<->morph feedback loop.
        let flipRoots = new Set()
        let flipPendingRaf = null
        const flipObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type !== "childList") continue
                const target = mutation.target
                if (target.nodeType !== 1) continue
                flipRoots.add(target)
            }
            if (!flipPendingRaf) {
                flipPendingRaf = requestAnimationFrame(() => {
                    flipPendingRaf = null
                    if (!flipRoots.size) return
                    // A single frame can register several scopes for the SAME
                    // element: removing a `.leave` node re-attaches a fixed ghost
                    // to <body>, which adds `body` as a second scope alongside the
                    // node's former parent. Running animateFlip per scope re-enters
                    // playFlip on the same element, killing the in-flight tween and
                    // clearing its transform — snapping the element into place.
                    // Dedupe across scopes so each element flips exactly once.
                    const toFlip = new Set()
                    flipRoots.forEach((scope) => {
                        if (!scope) return
                        gsap.utils.toArray(scope.querySelectorAll?.(".flip") || [])
                            .forEach((el) => { if (el.isConnected) toFlip.add(el) })
                    })
                    toFlip.forEach(playFlip)
                    // Refresh baselines for any .flip that settled this frame.
                    gsap.utils.toArray(document.body.querySelectorAll?.(".flip") || []).forEach(captureFlip)
                    flipRoots = new Set()
                })
            }
        })
        flipObserver.observe(document.body, { childList: true, subtree: true })



        const animateAppear = (el) => {
            if (!el.classList.contains("appear") || el._appeared) return
            // A `.scroll`/`.scroll-progress` element is owned by its ScrollTrigger
            // (see setupScroll); `.appear` must not also fire, or it plays on mount
            // AND again on scroll-enter.
            if (el.classList.contains("scroll") || el.classList.contains("scroll-progress")) return
            if (isReduced(el)) return
            el._appeared = true
            const { delay, duration, ease } = readTiming(el)

            const config = findSpawn(el)
            if (isTextElement(el)) {
                el._spawnTween = playText(el, config.from, delay, duration, ease)
                return
            }
            if (!config) return el._spawnTween = SpawnV(el, delay, -defaults.spawnOffset, duration, ease)

            if (config.typewriter) {
                const easeClass = [...el.classList].find(c => c.startsWith("ease-"))
                const elEase = easeClass ? easeClass.split("-")[1] : "none"
                el._spawnTween = config.typewriterSplit
                    ? playTypewriterSplit(el, delay, duration, elEase)
                    : config.play(el, delay, duration, elEase)
            } else {
                el._spawnTween = config.play(el, delay, duration, ease)
                el._spawnTween.eventCallback("onComplete", () => {
                    if (el.classList.contains("leave")) refreshLeaveRect(el)
                    if (el.classList.contains("flip")) captureFlip(el)
                    fireOnComplete(el, "spawn")
                })
            }
        }

        const appearObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return
                    const els = node.querySelectorAll?.("*") ? [node, ...node.querySelectorAll("*")] : [node]
                    let pinned = false
                    els.forEach((el) => {
                        // `.appear` is the opt-in gate for dynamically-added
                        // elements: without it a newly inserted node is ignored.
                        if (!el.classList?.contains("appear")) return
                        animateAppear(el)
                        setupScroll(el)
                        setupScrollDriven(el)
                        if (el.dataset?.gsapSetup) return
                        el.dataset.gsapSetup = "1"
                        setupClicks(el)
                        setupLoops(el)
                        setupHoverClick(el)
                        setupCssAnims(el)
                        runSetup(el)
                        const wasPinned = el.dataset.gsapPinned
                        setupPin(el)
                        if (!wasPinned && el.dataset.gsapPinned) pinned = true
                    })
                    applyMagnet()
                    // A newly added pin changes layout; refresh so its spacer is
                    // accounted for before the next scroll calc.
                    if (pinned) ScrollTrigger.refresh()
                })
            })
        })
        appearObserver.observe(document.body, { childList: true, subtree: true })

        // Capture any .leave elements already present so they can exit later
        gsap.utils.toArray(".leave").forEach(captureLeave)

        const leaveObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type !== "childList") return
                mutation.addedNodes.forEach((n) => collectLeave(n).forEach(captureLeave))
                mutation.removedNodes.forEach((n) => collectLeave(n).forEach(playLeave))
            })
        })
        leaveObserver.observe(document.body, { childList: true, subtree: true })

        // Keep the captured position fresh (throttled to one pass per frame)
        let positionTick = false
        const refreshLeavePositions = () => {
            if (positionTick) return
            positionTick = true
            requestAnimationFrame(() => {
                gsap.utils.toArray(".leave").forEach((el) => {
                    const s = leaveStates.get(el)
                    if (s) s.rect = el.getBoundingClientRect()
                })
                positionTick = false
            })
        }
        window.addEventListener("scroll", refreshLeavePositions, { passive: true })
        window.addEventListener("resize", refreshLeavePositions, { passive: true })

    return () => {
        appearObserver.disconnect()
        leaveObserver.disconnect()
        flipObserver.disconnect()
        window.removeEventListener("scroll", refreshLeavePositions)
        window.removeEventListener("resize", refreshLeavePositions)
        window.removeEventListener("load", ScrollTrigger.refresh)
        clearTimeout(refreshTimer)
        scrollTriggers.forEach((t) => {
            t.kill()
            t.trigger._scrollTween?.kill()
            delete t.trigger._scrollTween
        })
        ScrollTrigger.refresh()
        registeredListeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn))
        magnetListeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn))
        magnetQuery?.removeEventListener("change", applyMagnet)
        loopEls.forEach(({ el, key }) => el[key]?.kill())
        cssTweens.forEach((t) => t?.kill())
        cssTweens.length = 0
        gsap.utils.toArray(".typewriter").forEach(el => el.typewriter?.kill())
        textSplits.forEach((s) => s.revert())
        textSplits.length = 0
        onCompleteTweens.forEach((t) => t?.kill())
        onCompleteTweens.length = 0
        setupTeardowns.forEach((fn) => { try { fn() } catch { /* ignore */ } })
        setupTeardowns.length = 0
    }
}