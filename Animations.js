import { DrawSVGPlugin, Flip, MotionPathPlugin, ScrambleTextPlugin, SplitText, TextPlugin } from "gsap/all";
import gsap from "gsap";
import { defaults } from './Config.js'

gsap.registerPlugin(Flip)
gsap.registerPlugin(SplitText)
gsap.registerPlugin(TextPlugin)
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)
gsap.registerPlugin(ScrambleTextPlugin)

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
// kills the tween mid-flight leaves that wiped state behind - so a later
// engine re-init reading `el.innerHTML` again would type an empty (or
// partially-typed) string forever. Stash the full HTML on first sight and
// reuse it. The stash only refreshes from SETTLED content: never while a
// typewriter tween on the element is actively rendering partial progress, and
// never from a blank DOM. Legit content changes (React re-renders, dynamic
// `.appear` elements) therefore update the stash naturally.
export const stashText = (el) => {
    const busy = (el.typewriter || el._spawnTween || el._scrollTween)?.isActive?.()
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
// hidden state. No opacity is involved - pure clip wipe.
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

// Curtain reveal: opens outward from the horizontal centre - a vertical slit in
// the middle widens left and right until the whole box is shown.
export function curtainHorizontal (target , delay , dur , ease){
    return gsap.fromTo(target , {clipPath:"inset(0% 50% 0% 50%)"} , {clipPath:"inset(0% 0% 0% 0%)" , ease:easeOf(ease) , duration:dur , delay:delay})
}

// Curtain reveal: opens outward from the vertical centre - a horizontal slit in
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

// Helpers for the `fill-svg` draw-modifier. When an element carries both
// `.draw`/`.draw-split` and `.fill-svg`, the stroke is drawn first and then
// the interior fills. `fill-time-N` / `fill-ease-NAME` override the fill
// phase; otherwise the fill takes half of `dur` and reuses the draw ease.
const fillTimeOf = (el , fallback) => {
    const m = [...el.classList].find(c => c.startsWith("fill-time-"))
    return m ? Number(m.slice("fill-time-".length)) : fallback * 0.5
}
const fillEaseOf = (el , fallbackEase) => {
    const m = [...el.classList].find(c => c.startsWith("fill-ease-"))
    return m ? m.slice("fill-ease-".length) : fallbackEase
}

// Stroke-draw reveal (strokes only - filled SVGs are deliberately out of
// scope for now). Explicit fromTo endpoints so the animation's hidden state
// matches this class's Config `from` metadata exactly: `.scroll-progress`
// scrubs between those two values and `.leave`/`.scroll` reversal tweens back
// into them. When the target also carries `.fill-svg`, the interior is filled
// after the stroke finishes (draw → fill sequential timeline).
export function drawsvg (target , delay , dur , ease){
    const e = easeOf(ease)
    const first = gsap.utils.toArray(target)[0]
    const hasFill = !!first?.classList?.contains("fill-svg")
    if (!hasFill) {
        return gsap.fromTo(target , {drawSVG:"0%"} , {ease:e , duration:dur , delay:delay , drawSVG:"100%"})
    }
    const fillDur = fillTimeOf(first , dur)
    const fillEase = fillEaseOf(first , ease)
    const fillTargets = gsap.utils.toArray(target).filter(el => el.classList.contains("fill-svg"))
    const tl = gsap.timeline({ delay })
    // Keep fill invisible while the stroke draws
    if (fillTargets.length) gsap.set(fillTargets , { fillOpacity: 0 })
    tl.fromTo(target , {drawSVG:"0%"} , {ease:e , duration:dur , drawSVG:"100%"})
    if (fillTargets.length) {
        tl.fromTo(fillTargets , {fillOpacity:0} , {ease:easeOf(fillEase) , duration:fillDur , fillOpacity:1})
    }
    return tl
}

// Busts a multi-segment <path> (one containing multiple "M" commands) apart
// into one single-segment <path> per segment. Browsers can't reliably render
// a stroke-dash progressive reveal across disconnected subpaths, while
// separate paths draw correctly. Adapted from the official DrawSVGPlugin
// helper, with one addition: splitting REPLACES the source path in the DOM,
// so the result is cached on that element and reused while the segments are
// still live - an engine re-init (StrictMode remount, route change) must not
// churn the DOM a second time. Attributes are copied verbatim; filled SVGs
// are simply untouched territory for now.
export function splitPaths (paths){
    const toSplit = gsap.utils.toArray(paths)
    let newPaths = []
    if (toSplit.length > 1) {
        toSplit.forEach(path => newPaths.push(...splitPaths(path)))
        return newPaths
    }
    const path = toSplit[0]
    if (!path) return newPaths
    if (path._gcSplitPaths?.[0]?.isConnected) return path._gcSplitPaths
    const rawPath = MotionPathPlugin.getRawPath(path)
    const parent = path.parentNode
    const attributes = [...path.attributes]
    newPaths = rawPath.map(segment => {
        const newPath = document.createElementNS("http://www.w3.org/2000/svg" , "path")
        let i = attributes.length
        while (i--) {
            const attr = attributes[i]
            // Don't copy GSAP wiring or appear/scroll triggers - children are
            // animated via the returned timeline, not as independent spawns.
            // Copying "appear" caused appearObserver → split → appear loop.
            if (attr.nodeName === "class") {
                const filtered = attr.nodeValue
                    .split(/\s+/)
                    .filter(c => c && c !== "appear" && c !== "scroll" && c !== "scroll-progress" && c !== "draw" && c !== "draw-split")
                    .join(" ")
                if (filtered) newPath.setAttributeNS(null, "class", filtered)
                continue
            }
            if (attr.nodeName.startsWith("data-gsap")) continue
            newPath.setAttributeNS(null , attr.nodeName , attr.nodeValue)
        }
        newPath.setAttributeNS(null , "d" ,
            "M" + segment[0] + "," + segment[1] +
            "C" + segment.slice(2).join(",") +
            (segment.closed ? "z" : ""))
        // Isolate paint and mark as split child so future inits skip it
        newPath.dataset.gsapSplit = "1"
        newPath.style.contain = "paint"
        newPath.style.willChange = "transform"
        parent.insertBefore(newPath , path)
        return newPath
    })
    parent.removeChild(path)
    return path._gcSplitPaths = newPaths
}

// Like drawsvg but built for MULTI-SEGMENT paths: splitPaths() first, then
// draw each resulting segment one after another, giving every segment a slice
// of `dur` proportional to its own stroke length so the pen travels at a
// constant speed across the whole drawing. Returns a timeline, so leave /
// scroll reversal un-draws the segments back-to-front and the engine's
// onComplete hooks fire only after the final segment lands. When the source
// also carries `.fill-svg`, every resulting segment is filled together after
// the last draw segment lands (draw → fill).
export function drawsvgSplit (target , delay , dur , ease){
    const e = easeOf(ease)
    const first = gsap.utils.toArray(target)[0]
    const hasFill = !!first?.classList?.contains("fill-svg")
    const fillDur = hasFill ? fillTimeOf(first , dur) : 0
    const fillEase = hasFill ? fillEaseOf(first , ease) : ease
    const tl = gsap.timeline({ delay })
    const paths = splitPaths(target)
    let distance = 0
    paths.forEach(segment => distance += segment.getTotalLength())
    // Nothing drawable (empty selection / zero-length strokes): hand back the
    // inert timeline rather than divide by zero below.
    if (!distance) return tl
    if (hasFill && paths.length) gsap.set(paths , { fillOpacity: 0 })
    paths.forEach(segment => {
        tl.fromTo(segment ,
            {drawSVG:"0%"} ,
            {ease:e , duration:dur * (segment.getTotalLength() / distance) , drawSVG:"100%"})
    })
    if (hasFill && paths.length) {
        tl.fromTo(paths , {fillOpacity:0} , {ease:easeOf(fillEase) , duration:fillDur , fillOpacity:1})
    }
    return tl
}

// Scramble plumbing. Only the element's TOP-LEVEL TEXT runs are scrambled:
// each run is wrapped in its own span and tweened separately, while real child
// elements (links, icons, ...) are left completely untouched - their markup
// survives the animation intact. Wraps are cached on the element so replays
// (engine re-inits, .appear re-triggers) reuse the same spans instead of
// churning the DOM.
export const scrambleSegments = (target) => {
    let wraps = target._gcScrambleSegs
    if (!wraps || !wraps.length || !wraps.every((w) => w.parentNode === target)) {
        wraps = []
        ;[...target.childNodes].forEach((node) => {
            // Whitespace-only runs stay bare so natural spacing is preserved;
            // everything else becomes an individually scrambable span.
            if (node.nodeType !== 3 || !node.textContent.trim()) return
            // ScrambleTextPlugin TRIMS its targets, so a span holding
            // " with a " would resolve to "with a" and swallow the spaces
            // around a neighbouring element. Split the edge whitespace off
            // into bare text nodes and wrap only the trimmed core.
            const raw = node.textContent
            const core = raw.trim()
            const leadIdx = raw.indexOf(core[0])
            const trailStart = leadIdx + core.length
            const frag = document.createDocumentFragment()
            if (leadIdx > 0) frag.appendChild(document.createTextNode(raw.slice(0 , leadIdx)))
            const span = document.createElement("span")
            span.textContent = core
            frag.appendChild(span)
            if (trailStart < raw.length) frag.appendChild(document.createTextNode(raw.slice(trailStart)))
            target.insertBefore(frag , node)
            target.removeChild(node)
            wraps.push(span)
        })
        target._gcScrambleSegs = wraps
    }
    return wraps.map((w) => ({ t: w , text: w.textContent }))
}

// Reads a scramble element's modifier classes and resolves them against the
// package defaults:
//   .amount-N        -> ScrambleText speed (default 1, GSAP's own default)
//   .reveal-delay-N  -> revealDelay in seconds (default defaults.revealDelay)
//   .chars-[...]     -> character pool taken verbatim from inside the brackets
//                       (default defaults.characterlist)
export function scrambleVars (target){
    const num = (prefix , fallback) => {
        const match = [...target.classList].find(c => c.startsWith(prefix))
        return match ? Number(match.slice(prefix.length)) : fallback
    }
    // Greedy up to the LAST "]" so pools containing "]" survive intact.
    const charsCls = [...target.classList].find(c => /^chars-\[(.*)\]$/.test(c))
    return {
        segs: scrambleSegments(target) ,
        chars: charsCls ? charsCls.slice("chars-[".length , -1) : defaults.characterlist ,
        speed: num("amount-" , 1) ,
        revealDelay: num("reveal-delay-" , defaults.revealDelay) ,
        // .scramble-rtl flips the reveal direction (ScrambleTextPlugin's
        // rightToLeft) so the sweep travels right -> left.
        rtl: target.classList.contains("scramble-rtl") ,
    }
}

// Scramble spawn: the text starts empty and resolves into the real content
// through garbage characters - no opacity involved, the scramble IS the
// reveal. Unlike typewriter there is no opacity fade to hide behind, so the
// package default "back" ease would visually finish at ~36% of `dur` (back.out
// crosses ~99% early and the reveal index clamps): unless an explicit ease-*
// class is present the tween therefore eases linearly, making time-N the TRUE
// total reveal time. One timeline holds a per-text-run tween at position 0 so
// leave/scroll reversal and onComplete hooks treat it as a single animation.
//
// Variants / modifiers:
//   .scramble-all     - no empty-start typing: the already-finished string
//                       flips to garbage as a whole and sweeps back (native
//                       ScrambleTextPlugin resolve).
//   .scramble-rtl     - reveal travels right -> left.
export function scramble (target , delay , dur , ease){
    const e = [...target.classList].some(c => c.startsWith("ease-")) ? easeOf(ease) : "none"
    const { segs , chars , speed , revealDelay , rtl } = scrambleVars(target)
    const all = target.classList.contains("scramble-all")
    const tl = gsap.timeline({ delay })
    segs.forEach(({ t , text }) => {
        if (all) {
            tl.to(t ,
                {scrambleText:{text , chars , speed , revealDelay , rightToLeft:rtl} , ease:e , duration:dur} , 0)
        } else {
            tl.fromTo(t ,
                {scrambleText:{text:"" , chars}} ,
                {scrambleText:{text , chars , speed , revealDelay , rightToLeft:rtl} , ease:e , duration:dur} , 0)
        }
    })
    return tl
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
    // A quick toll that overshoots and damps down - reads as a physical strike
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
    // Don't animate detached targets — return inert tween
    if (!target.isConnected) {
        return gsap.fromTo(clone, {}, { duration: 0 })
    }
    document.body.appendChild(clone)
    applyRect()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    // Killing the tween (teardown, hover/click rebuilds) must clean up exactly
    // like natural completion - otherwise clones + listeners leak.
    let tween = null
    const cleanup = () => {
        clone.remove()
        window.removeEventListener("scroll", schedule)
        window.removeEventListener("resize", schedule)
        if (observer) observer.disconnect()
    }
    // If target is removed from DOM (React unmount, .remove(), SPA navigation),
    // kill the tween and remove the clone — mirrors React useEffect cleanup
    const observer = new MutationObserver(() => {
        if (!target.isConnected) {
            if (tween) tween.kill()
            cleanup()
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    tween = gsap.fromTo(clone , {scale:1 , opacity:1} , {
        scale:amount / 10 ,
        opacity:0 ,
        duration:dur ,
        delay:delay ,
        ease:easeOf(ease) ,
        onComplete: () => { observer.disconnect(); cleanup(); },
        onInterrupt: () => { observer.disconnect(); cleanup(); },
    })
    return tween
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
    // container's flex layout - otherwise a `justify-center` (or any alignment)
    // on the container centers the overflowing track and shifts the tile seam,
    // which opens a gap on the trailing edge at some point in the loop.
    target.style.position = "relative"
    target.style.overflow = "hidden"

    // Rebuilds over the SAME element (engine restarts, StrictMode remounts)
    // must reuse the existing track. Re-creating it would swallow the old
    // absolute track as the first "child", repeat THAT as the tiling unit -
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

    // Nothing to tile (empty content) - return an inert tween rather than one
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