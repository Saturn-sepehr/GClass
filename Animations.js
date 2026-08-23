import { Flip, SplitText, TextPlugin } from "gsap/all";
import gsap from "gsap";

gsap.registerPlugin(Flip)
gsap.registerPlugin(SplitText)
gsap.registerPlugin(TextPlugin)

// A tasteful fallback whenever a call site omits an ease, so the animation
// never lapses into the raw "none" look. Callers still override this freely.
const DEFAULT_EASE = "power3.out";
const easeOf = (e) => e || DEFAULT_EASE;

// These animations treat `amount` as a scale multiplier, but dampened by a
// factor of 10: `amount-20` scales to 2x rather than 20x. The target scale is
// `amount / 10`, so use `amount-N` as a percentage-style number.

// The resting opacity the element should settle on. GSAP sets the spawn's
// `from` state (opacity 0) on the element before the tween is built, so
// `getComputedStyle` would read that transient 0 rather than the intended
// value. Temporarily drop the inline opacity to read the CSS-defined one (e.g.
// a `disabled:opacity-50`, a `.opacity-*` utility, or the default 1), then
// restore it so the actual animation still starts from the right place.
export const finalOpacity = (target) => {
    const had = target.style.opacity
    target.style.removeProperty("opacity")
    const v = parseFloat(getComputedStyle(target).opacity)
    if (had !== "") target.style.opacity = had
    return isNaN(v) ? 1 : v
}

// TextPlugin tweens take their endpoints from the LIVE DOM: the `.typewriter`
// play callbacks pass `el.innerHTML` as the text to type. The tween's from
// state ("") is applied the instant the tween is created, and a teardown that
// kills the tween mid-flight leaves that wiped state behind — so a later
// engine re-init reading `el.innerHTML` again would type an empty (or
// partially-typed) string forever. Stash the full HTML on first sight and
// reuse it. The stash only refreshes from SETTLED content: never while a
// typewriter tween on the element is actively rendering partial progress, and
// never from a blank DOM. Legit content changes (React re-renders, dynamic
// `.appear` elements) therefore update the stash naturally.
export const stashText = (el) => {
    const busy = (el.typewriter || el._scrollTween)?.isActive?.()
    const html = el.innerHTML
    if (!busy && html && html.trim()) el._gcText = html
    return el._gcText !== undefined ? el._gcText : html
}


//Spawn animations

export function SpawnV (target , delay , dir , dur , ease) {
    const e = easeOf(ease)
    // A whisper of scale in the same breath as the travel keeps the reveal
    // feeling physical instead of a flat 2D slide.
    return gsap.fromTo(target , {opacity:0 , y:dir , scale:0.97} , {ease:e , duration:dur , delay:delay , y:0 , opacity:finalOpacity(target) , scale:1})
}

export function SpawnH (target , delay , dir , dur , ease) {
    const e = easeOf(ease)
    return gsap.fromTo(target , {opacity:0 , x:dir , scale:0.97} , {ease:e , duration:dur , delay:delay , x:0 , opacity:finalOpacity(target) , scale:1})
}

export function expandV (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {opacity:1 , scaleY:0} , {ease:e , duration:dur , delay:delay , scaleY:1 , opacity:finalOpacity(target) , transformOrigin:"50% 50%"})
}

export function expandH (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {opacity:1 , scaleX:0} , {ease:e , duration:dur , delay:delay , scaleX:1 , opacity:finalOpacity(target) , transformOrigin:"50% 50%"})
}
export function expandA (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {opacity:1 , scale:0} , {ease:e , duration:dur , delay:delay , scale:1 , opacity:finalOpacity(target) , transformOrigin:"50% 50%"})
}

export function typewriter (target , text , dur , delay , ease){
    return gsap.fromTo(target , {text:""} , {ease:easeOf(ease) , duration:dur , delay:delay , text:text})
}

export function spawnSpinCCW (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {scale:0 , rotation:-90} , {ease:e , duration:dur , delay:delay , scale:1 , rotation:0 , transformOrigin:"50% 50%"})
}

export function spawnSpinCW (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {scale:0 , rotation:90} , {ease:e , duration:dur , delay:delay , scale:1 , rotation:0 , transformOrigin:"50% 50%"})
}

export function spawnFade (target , delay , dur , ease){
    return gsap.fromTo(target , {opacity:0} , {ease:easeOf(ease) , duration:dur , delay:delay , opacity:finalOpacity(target)})
}

export function spawnBlur (target , delay , dur , ease){
    const e = easeOf(ease)
    // Linger the blur slightly so the focus pull feels deliberate, not abrupt.
    return gsap.fromTo(target , {opacity:0 , filter:"blur(20px)"} , {ease:e , duration:dur , delay:delay , opacity:finalOpacity(target) , filter:"blur(0px)"})
}

// Clip-path reveal: the element's box is wiped open from a chosen edge. `dir`
// is one of up/down/left/right and picks which inset collapses to zero so the
// wipe travels from that edge:
//   up    - hidden at the bottom, wipes open upward (bottom -> top)
//   down  - hidden at the top, wipes open downward (top -> bottom)
//   left  - hidden on the right, wipes open leftward (right -> left)
//   right - hidden on the left, wipes open rightward (left -> right)
// The `from` inset is mirrored in the Config entry so
// `.scroll`/`.scroll-progress`/`.leave` reversal and `.appear` all know the
// hidden state. No opacity is involved — pure clip wipe.
const CLIP_FROM = {
    up: "inset(0% 0% 100% 0%)",
    down: "inset(100% 0% 0% 0%)",
    left: "inset(0% 0% 0% 100%)",
    right: "inset(0% 100% 0% 0%)",
}
export function spawnClipReveal (target , delay , dur , ease , dir = "up"){
    const from = CLIP_FROM[dir] || CLIP_FROM.up
    return gsap.fromTo(target , {clipPath: from} , {clipPath:"inset(0% 0% 0% 0%)" , ease:easeOf(ease) , duration:dur , delay:delay})
}

// Curtain reveal: opens outward from the horizontal centre — a vertical slit in
// the middle widens left and right until the whole box is shown.
export function curtainHorizontal (target , delay , dur , ease){
    return gsap.fromTo(target , {clipPath:"inset(0% 50% 0% 50%)"} , {clipPath:"inset(0% 0% 0% 0%)" , ease:easeOf(ease) , duration:dur , delay:delay})
}

// Curtain reveal: opens outward from the vertical centre — a horizontal slit in
// the middle widens up and down until the whole box is shown.
export function curtainVertical (target , delay , dur , ease){
    return gsap.fromTo(target , {clipPath:"inset(50% 0% 50% 0%)"} , {clipPath:"inset(0% 0% 0% 0%)" , ease:easeOf(ease) , duration:dur , delay:delay})
}

export function spawnXUp (target , delay , dur , ease){
    const e = easeOf(ease)
    // Card-spawn: a full 360° front-flip that unfolds into place, with a soft
    // depth scale and an edge anchor so the pivot reads like a flipping card.
    return gsap.fromTo(target , {scale:0 , rotationX:360 , opacity:0} , {ease:e , duration:dur , delay:delay , scale:1 , rotationX:0 , opacity:finalOpacity(target) , transformOrigin:"50% 50%"})
}

export function spawnXDown (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {scale:0 , rotationX:-360 , opacity:0} , {ease:e , duration:dur , delay:delay , scale:1 , rotationX:0 , opacity:finalOpacity(target) , transformOrigin:"50% 50%"})
}

export function spawnYRight (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {scale:0 , rotationY:360 , opacity:0} , {ease:e , duration:dur , delay:delay , scale:1 , rotationY:0 , opacity:finalOpacity(target) , transformOrigin:"50% 50%"})
}

export function spawnYLeft (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {scale:0 , rotationY:-360 , opacity:0} , {ease:e , duration:dur , delay:delay , scale:1 , rotationY:0 , opacity:finalOpacity(target) , transformOrigin:"50% 50%"})
}

export function expandRight (target , delay , dur , ease){
        const e = easeOf(ease)
        const tl = gsap.timeline()
    tl.set(target , {transformOrigin : "100% 50%"})
    .fromTo(target , {opacity:1 , scaleX:0} , {ease:e , duration:dur , delay:delay , scaleX:1 , opacity:finalOpacity(target)})

    return tl
    
}

export function expandLeft (target , delay , dur , ease){
    const e = easeOf(ease)
    const tl = gsap.timeline()
        tl.set(target , {transformOrigin : "0% 50%"})
    .fromTo(target , {opacity:1 , scaleX:0} , {ease:e , duration:dur , delay:delay , scaleX:1 , opacity:finalOpacity(target)})

    
    return tl
}

export function expandUp (target , delay , dur , ease){
    const e = easeOf(ease)
    const tl = gsap.timeline()
    tl.set(target , {transformOrigin : "50% 100%"})
    .fromTo(target , {opacity:1 , scaleY:0} , {ease:e , duration:dur , delay:delay , scaleY:1 , opacity:finalOpacity(target)})

    return tl
}

export function expandDown (target , delay , dur , ease){
    const e = easeOf(ease)
    const tl = gsap.timeline()
    tl.set(target , {transformOrigin : "50% 0%"})
    .fromTo(target , {opacity:1 , scaleY:0} , {ease:e , duration:dur , delay:delay , scaleY:1 , opacity:finalOpacity(target)})

    return tl
}

export function countTargetVars (target){
    // Cache on the element so the target number survives a `.scroll` reverse
    // (which rewrites textContent back to the start value). Re-reading it from
    // the live text each play would otherwise collapse the range to start==end.
    if (target._countTarget) return target._countTarget
    // Extract the number from the element, ignoring any surrounding text
    // (e.g. "$1,250 total" -> 1250). Keeps decimals so 3.14 counts to 3.14.
    const match = (target.textContent || "0").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/)
    const end = match ? parseFloat(match[0]) : 0
    const decimals = match?.[0].includes(".") ? (match[0].split(".")[1] || "").length : 0
    // Count FROM `.spawn-num-N` (N = the starting number) up to `end`. When the
    // class is absent, fall back to 0.
    const startCls = [...target.classList].find(c => c.startsWith("spawn-num-"))
    const start = startCls ? parseFloat(startCls.slice("spawn-num-".length)) : 0
    return target._countTarget = { start, end, decimals }
}

export function countUp (target , delay , dur, ease){
    const e = easeOf(ease)
    const { start, end, decimals } = countTargetVars(target)
    const obj = { n: start }
    // Pure counter: animates the number only, leaving opacity untouched, so it
    // composes cleanly with `.scroll` / `.scroll-progress` / `.appear` /
    // `.leave` without imposing a fade.
    return gsap.timeline({ delay }).fromTo(obj , { n: start } , { n: end , duration:dur , ease:e , onUpdate: () => { target.textContent = obj.n.toFixed(decimals) } } , 0)
}


//Mouse animations

export function verticalmove (target , amount , dur , ease){
    const e = easeOf(ease)
    // A hint of scale makes the lift read as pressing/pulling rather than a
    // detached translate, and easing by weight keeps it from feeling springy.
    return gsap.to(target , {y:amount , scale:1 + amount / 1000 , duration:dur , ease:e})
}

export function expandmove (target , amount , dur , ease){
    // `amount` uses the dampened `amount-N` scale system: the target scale is
    // `amount / 10`. Rest state (scale 1) is therefore amount = 10.
    return gsap.to(target , {scale:amount / 10 , duration:dur , ease:easeOf(ease)})
}

export function magnet (target , x , y , scale , dur , ease){
    // Drives a cursor-attracted element: translate toward the given point while
    // scaling up. `overwrite:"auto"` kills the in-flight tween on every
    // mousemove so motion stays snappy instead of queuing up behind itself.
    // Passing x:0, y:0, scale:1 resets it back to rest on mouseleave.
    return gsap.to(target , {x , y , scale , duration:dur , ease:easeOf(ease) , overwrite:"auto"})
}

export function magnet3d (target , x , y , scale , rotX , rotY , dur , ease){
    // Like `magnet` but also tilts the element in 3D space to face the cursor:
    // translation pulls it toward the pointer while rotationX/rotationY lean it
    // so the face tracks the cursor. `transformOrigin:"50% 50%"` keeps the tilt
    // pivoting around the element's centre and `transformPerspective` gives the
    // rotation its depth (without it, rotationX/rotationY on a flat element look
    // like a subtle skew rather than a real 3D tilt). Passing x:0, y:0, scale:1,
    // rotX:0, rotY:0 resets it back to rest on mouseleave.
    return gsap.to(target , {x , y , scale , rotationX:rotX , rotationY:rotY , transformOrigin:"50% 50%" , transformPerspective:600 , duration:dur , ease:easeOf(ease) , overwrite:"auto"})
}

export function reset (target , dur , ease){
    gsap.to(target, { x: 0, y: 0, scale: 1, duration: dur/2, ease: ease })
}




//Loop animations

export function spinCW (target , delay , dur , ease){
        const e = easeOf(ease)
        const tl = gsap.timeline()
     tl.fromTo(target , {scale:1 , rotation:0} , {ease:e , duration:dur , delay:delay , rotation:360})
    .to(target , {scale:1 , duration: delay})
    return tl
    }   
export function spinCCW (target , delay , dur , ease){
        const e = easeOf(ease)
        const tl = gsap.timeline()
         tl.fromTo(target , {scale:1 , rotation:0} , {ease:e , duration:dur , delay:delay , rotation:-360})
    .to(target , {scale:1 , duration: delay})
    return tl
}

export function bounce (delay , target , amount , dur , ease){
    const e = easeOf(ease)
    const tl = gsap.timeline()
    tl.set(target , {transformOrigin : "50% 100%"})
    // A quick, punchy hop: one continuous eased rise to the crest (no
    // intermediate tween to decelerate into, so it can't hang mid-air), then a
    // weighted squash-and-settle on the way down.
    .to(target , {y:-amount - amount * 0.25 , scaleX:0.97 , scaleY:1.03 , duration:dur * 0.48 , ease:"power1.out"})
    .to(target , {y:0 , scaleX:1.08 , scaleY:0.88 , duration:dur * 0.3 , ease:"power2.in"})
    .to(target , {y:0 , scaleX:1 , scaleY:1 , duration:dur * 0.12 , ease:e})

        .to(target , {x:0 , duration:delay})
    
    return tl
}


export function shake (delay , target , amount , dur , ease){
    const tl = gsap.timeline()
    // Damped oscillation: each swing decays so it feels like real inertia
    // settling, rather than a metronome ticking back and forth.
    tl.to(target , {x:amount , duration:dur * 0.1 , ease:"power2.out"})
    .to(target , {x:-amount * 0.8, duration:dur * 0.15 , ease:"power2.inOut"})
    .to(target , {x:amount * 0.5, duration:dur * 0.2 , ease:"power2.inOut"})
    .to(target , {x:-amount * 0.25, duration:dur * 0.2 , ease:"power2.inOut"})
    .to(target , {x:0 , duration:dur * 0.2  , ease:easeOf(ease)})
    .to(target , {x:0 , duration:delay})
    
    return tl
}


export function bell (delay , target , amount , dur , ease){
    const tl = gsap.timeline()
    tl.set(target , {transformOrigin : "50% 0%"})
    // A quick toll that overshoots and damps down — reads as a physical strike
    // instead of a symmetrical wiggle.
    .to(target , {rotate:amount , duration:dur * 0.12 , ease:"power2.out"})
    .to(target , {rotate:-amount * 0.7, duration:dur * 0.18 , ease:"power2.inOut"})
    .to(target , {rotate:amount * 0.4, duration:dur * 0.22 , ease:"power2.inOut"})
    .to(target , {rotate:-amount * 0.15, duration:dur * 0.22 , ease:"power2.inOut"})
    .to(target , {rotate:0 , duration:dur * 0.2  , ease:easeOf(ease)})
    .to(target , {rotate:0 , duration:delay})
    
    return tl
}

export function pulse (delay , target , amount , dur , ease){
    const e = easeOf(ease)
    const tl = gsap.timeline()
    // Overshoot a touch past the target then fall back, so the pulse has a
    // lively beat rather than a flat up-and-down.
    tl.to(target , {scale:(amount / 10) * 1.05 , duration:dur * 0.35 , ease:"power2.out"})
    .to(target , {scale:1 , duration:dur * 0.45 , ease:e})

    .to(target , {scale:1 , duration:delay})
  
    
    return tl
}

export function radiate (delay , target , amount , dur , ease , zIndex){
    const clone = target.cloneNode(true)
    // Tagged so engine teardown can sweep up clones whose tween was killed
    // before its onComplete (route changes mid-animation).
    clone.setAttribute("data-gsap-radiate", "1")
    clone.style.cssText = `position:fixed;left:0;top:0;right:auto;bottom:auto;margin:0;pointer-events:none;transform-origin:50% 50%;${zIndex != null ? `z-index:${zIndex};` : ""}`
    // Keep the ripple glued to the target so it tracks scroll/resize instead of
    // getting stranded at the position captured when the animation was built.
    // Reposition on scroll/resize (throttled to one pass per frame) rather than
    // reading the rect on EVERY tick: the latter forces a synchronous reflow per
    // frame, a layout-thrash Firefox pays for far more heavily than Chromium.
    let tick = false
    const applyRect = () => {
        const r = target.getBoundingClientRect()
        clone.style.left = `${r.left}px`
        clone.style.top = `${r.top}px`
        clone.style.width = `${r.width}px`
        clone.style.height = `${r.height}px`
    }
    const schedule = () => {
        if (tick) return
        tick = true
        requestAnimationFrame(() => { tick = false; applyRect() })
    }
    document.body.appendChild(clone)
    applyRect()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    // Killing the tween (teardown, hover/click rebuilds) must clean up exactly
    // like natural completion — otherwise clones + listeners leak.
    const cleanup = () => {
        clone.remove()
        window.removeEventListener("scroll", schedule)
        window.removeEventListener("resize", schedule)
    }

    return gsap.fromTo(clone , {scale:1 , opacity:1} , {
        scale:amount / 10 ,
        opacity:0 ,
        duration:dur ,
        delay:delay ,
        ease:easeOf(ease) ,
        onComplete: cleanup ,
        onInterrupt: cleanup ,
    })
}


export function hover (delay , target , amount , dur , ease){
    const tl = gsap.timeline()
    // Smooth, symmetric drift up and back down reads as floating rather than
    // bouncing. A gentle sine ease plus a soft scale breathing keeps it alive.
    tl.set(target , {transformOrigin : "50% 50%"})
    .to(target , {y:-amount , scaleX:0.98 , scaleY:1.02 , duration:dur/2 , ease:"sine.inOut"})
    .to(target , {y:0 , scaleX:1 , scaleY:1 , duration:dur/2 , ease:"sine.inOut"})

    return tl
}


export function marquee (target , dir , duration , xOffset = 0 , yOffset = 0 , noRepeat = false){
    const horizontal = dir === "left" || dir === "right"
    // Anchor the track to the top-left corner so its two identical copies tile
    // the container exactly. The track is positioned absolutely, out of the
    // container's flex layout — otherwise a `justify-center` (or any alignment)
    // on the container centers the overflowing track and shifts the tile seam,
    // which opens a gap on the trailing edge at some point in the loop.
    target.style.position = "relative"
    target.style.overflow = "hidden"

    // Rebuilds over the SAME element (engine restarts, StrictMode remounts)
    // must reuse the existing track. Re-creating it would swallow the old
    // absolute track as the first "child", repeat THAT as the tiling unit —
    // every copy stacks at the same offset and scrollWidth collapses.
    let track = target._gcTrack
    if (!track || !track.isConnected) {
        track = document.createElement("div")
        track.style.cssText = `position:absolute;top:${yOffset}px;left:${xOffset}px;display:flex;flex-direction:${horizontal ? "row" : "column"};width:max-content;will-change:transform;`
        while (target.firstChild) track.appendChild(target.firstChild)
        target.appendChild(track)
        // Guard against legacy poisoned DOM: older builds could wrap a previous
        // absolute track inside this one. Unwrap any nested engine tracks so
        // the stashed unit is always the raw content.
        while (
            track.children.length &&
            [...track.children].every((c) => c.style.position === "absolute" && c.style.display === "flex")
        ) {
            const inner = track.firstElementChild
            while (inner.firstChild) track.insertBefore(inner.firstChild, inner)
            track.removeChild(inner)
        }
        target._gcUnitHtml = track.innerHTML
    }
    track.style.flexDirection = horizontal ? "row" : "column"
    const unitHtml = target._gcUnitHtml

    // Measure ONE unit on its own: the live track may already hold N copies
    // (or stale content), which would inflate unitSize and starve `copies`.
    const measurer = document.createElement("div")
    measurer.style.cssText = track.style.cssText + "visibility:hidden;"
    measurer.innerHTML = unitHtml
    target.appendChild(measurer)
    const unitSize = horizontal ? measurer.scrollWidth : measurer.scrollHeight
    measurer.remove()

    // Nothing to tile (empty content) — return an inert tween rather than one
    // dividing by a zero-width unit.
    if (!unitSize) return gsap.fromTo(track, {}, { duration: 0 })

    // The track is absolutely positioned, so a bare-text host can collapse to
    // zero height and `overflow:hidden` would clip the strip away entirely.
    if (target.offsetHeight === 0 && track.offsetHeight > 0) {
        target.style.height = track.offsetHeight + "px"
    }

    // Default: repeat the unit until the whole strip is at least as wide as the
    // viewport (plus one extra copy so the trailing edge stays covered mid-loop).
    // `.marquee-no-repeat` opts into the minimal 2-copy single-seam behaviour.
    let copies
    if (noRepeat) {
        copies = 2
    } else {
        const viewport = horizontal ? target.offsetWidth : target.offsetHeight
        copies = Math.max(2, Math.ceil(viewport / unitSize) + 1)
    }
    track.innerHTML = unitHtml.repeat(copies)

    const dist = unitSize
    const vars = { duration: duration, ease: "none" }

    if (dir === "right") return gsap.fromTo(track, { x: -dist }, { x: 0, ...vars })
    if (dir === "up")   return gsap.fromTo(track, { y: 0 }, { y: -dist, ...vars })
    if (dir === "down") return gsap.fromTo(track, { y: -dist }, { y: 0, ...vars })
    return gsap.fromTo(track, { x: 0 }, { x: -dist, ...vars }) // left
}

//Extras
export function flip (state , ease , dur){
    Flip.from(state, {duration: dur, ease: ease || DEFAULT_EASE});
}

export function animatecss (target , dur , delay , ease, propertyS , propertySValue , propertyE , propertyEValue) {
    return gsap.fromTo(target , {[propertyS]:propertySValue} , {[propertyE]:propertyEValue , ease:ease, duration:dur, delay:delay})
}