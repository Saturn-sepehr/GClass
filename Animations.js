import { Flip, SplitText, TextPlugin } from "gsap/all";
import gsap from "gsap";

gsap.registerPlugin(Flip)
gsap.registerPlugin(SplitText)
gsap.registerPlugin(TextPlugin)

// A tasteful fallback whenever a call site omits an ease, so the animation
// never lapses into the raw "none" look. Callers still override this freely.
const DEFAULT_EASE = "power3.out";
const easeOf = (e) => e || DEFAULT_EASE;

// These animations treat `amount` as a scale multiplier: the value of the
// `amount-N` class is used directly as the target scale. Pass decimal values
// like amount-1.5 rather than pixel-style numbers.


//Spawn animations

export function SpawnV (target , delay , dir , dur , ease) {
    const e = easeOf(ease)
    // A whisper of scale in the same breath as the travel keeps the reveal
    // feeling physical instead of a flat 2D slide.
    return gsap.fromTo(target , {opacity:0 , y:dir , scale:0.97} , {ease:e , duration:dur , delay:delay , y:0 , opacity:1 , scale:1})
}

export function SpawnH (target , delay , dir , dur , ease) {
    const e = easeOf(ease)
    return gsap.fromTo(target , {opacity:0 , x:dir , scale:0.97} , {ease:e , duration:dur , delay:delay , x:0 , opacity:1 , scale:1})
}

export function expandV (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {opacity:1 , scaleY:0} , {ease:e , duration:dur , delay:delay , scaleY:1 , opacity:1 , transformOrigin:"50% 50%"})
}

export function expandH (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {opacity:1 , scaleX:0} , {ease:e , duration:dur , delay:delay , scaleX:1 , opacity:1 , transformOrigin:"50% 50%"})
}
export function expandA (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {opacity:1 , scale:0} , {ease:e , duration:dur , delay:delay , scale:1 , opacity:1 , transformOrigin:"50% 50%"})
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
    return gsap.fromTo(target , {opacity:0} , {ease:easeOf(ease) , duration:dur , delay:delay , opacity:1})
}

export function spawnBlur (target , delay , dur , ease){
    const e = easeOf(ease)
    // Linger the blur slightly so the focus pull feels deliberate, not abrupt.
    return gsap.fromTo(target , {opacity:0 , filter:"blur(20px)"} , {ease:e , duration:dur , delay:delay , opacity:1 , filter:"blur(0px)"})
}

export function spawnXUp (target , delay , dur , ease){
    const e = easeOf(ease)
    // Card-spawn: a full 360° front-flip that unfolds into place, with a soft
    // depth scale and an edge anchor so the pivot reads like a flipping card.
    return gsap.fromTo(target , {scale:0 , rotationX:360 , opacity:0} , {ease:e , duration:dur , delay:delay , scale:1 , rotationX:0 , opacity:1 , transformOrigin:"50% 50%"})
}

export function spawnXDown (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {scale:0 , rotationX:-360 , opacity:0} , {ease:e , duration:dur , delay:delay , scale:1 , rotationX:0 , opacity:1 , transformOrigin:"50% 50%"})
}

export function spawnYRight (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {scale:0 , rotationY:360 , opacity:0} , {ease:e , duration:dur , delay:delay , scale:1 , rotationY:0 , opacity:1 , transformOrigin:"50% 50%"})
}

export function spawnYLeft (target , delay , dur , ease){
    const e = easeOf(ease)
    return gsap.fromTo(target , {scale:0 , rotationY:-360 , opacity:0} , {ease:e , duration:dur , delay:delay , scale:1 , rotationY:0 , opacity:1 , transformOrigin:"50% 50%"})
}

export function expandRight (target , delay , dur , ease){
        const e = easeOf(ease)
        const tl = gsap.timeline()
    tl.set(target , {transformOrigin : "100% 50%"})
    .fromTo(target , {opacity:1 , scaleX:0} , {ease:e , duration:dur , delay:delay , scaleX:1 , opacity:1})

    return tl
    
}

export function expandLeft (target , delay , dur , ease){
    const e = easeOf(ease)
    const tl = gsap.timeline()
        tl.set(target , {transformOrigin : "0% 50%"})
    .fromTo(target , {opacity:1 , scaleX:0} , {ease:e , duration:dur , delay:delay , scaleX:1 , opacity:1})

    
    return tl
}

export function expandUp (target , delay , dur , ease){
    const e = easeOf(ease)
    const tl = gsap.timeline()
    tl.set(target , {transformOrigin : "50% 100%"})
    .fromTo(target , {opacity:1 , scaleY:0} , {ease:e , duration:dur , delay:delay , scaleY:1 , opacity:1})

    return tl
}

export function expandDown (target , delay , dur , ease){
    const e = easeOf(ease)
    const tl = gsap.timeline()
    tl.set(target , {transformOrigin : "50% 0%"})
    .fromTo(target , {opacity:1 , scaleY:0} , {ease:e , duration:dur , delay:delay , scaleY:1 , opacity:1})

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
    return gsap.to(target , {scale:amount , duration:dur , ease:easeOf(ease)})
}

export function magnet (target , x , y , scale , dur , ease){
    // Drives a cursor-attracted element: translate toward the given point while
    // scaling up. `overwrite:"auto"` kills the in-flight tween on every
    // mousemove so motion stays snappy instead of queuing up behind itself.
    // Passing x:0, y:0, scale:1 resets it back to rest on mouseleave.
    return gsap.to(target , {x , y , scale , duration:dur , ease:easeOf(ease) , overwrite:"auto"})
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
    tl.to(target , {scale:amount * 1.05 , duration:dur * 0.35 , ease:"power2.out"})
    .to(target , {scale:1 , duration:dur * 0.45 , ease:e})

    .to(target , {scale:1 , duration:delay})
  
    
    return tl
}

export function radiate (delay , target , amount , dur , ease){
    const clone = target.cloneNode(true)
    clone.style.cssText = `position:fixed;left:0;top:0;margin:0;pointer-events:none;transform-origin:50% 50%;`
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

    return gsap.fromTo(clone , {scale:1 , opacity:1} , {
        scale:amount ,
        opacity:0 ,
        duration:dur ,
        delay:delay ,
        ease:easeOf(ease) ,
        onComplete: () => {
            clone.remove()
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
        } ,
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
    const track = document.createElement("div")
    track.style.cssText = `position:absolute;top:${yOffset}px;left:${xOffset}px;display:flex;flex-direction:${horizontal ? "row" : "column"};width:max-content;will-change:transform;`
    while (target.firstChild) track.appendChild(target.firstChild)
    target.appendChild(track)

    const first = track.children[0]
    if (!first) return gsap.fromTo(track, {}, { duration: 0 })

    // A single copy of the content (the width one loop step must travel).
    const unitHtml = track.innerHTML
    const unitSize = horizontal ? track.scrollWidth : track.scrollHeight

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
