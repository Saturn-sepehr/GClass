import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Optimization" };

export default function Page() {
  return (
    <article>
      <H1>Optimization - throttling for low end devices</H1>
      <P>
        GClass runs at full speed by default. No observer throttling and the
        GSAP ticker follows <code>requestAnimationFrame</code>. On low end
        devices you can trade a few frames for smoother interaction by capping
        the ticker and coalescing the three body observers.
      </P>
      <Code>{`import { initAnimations, gclassOpts } from 'gclass-anims'

// default: 0 throttle, default ticker (about 60fps via rAF)
initAnimations()

// capped at boot: 1 observer per frame, 30fps ticker
initAnimations(1, 30)
initAnimations({ throttlePerFrame: 1, fps: 30 })

// change on the fly without reload - e.g. low end mode button
gclassOpts(1, 30) // enable: 1 observer per frame, 30fps
gclassOpts()      // reset: 0 throttle, default ticker
gclassOpts({ throttlePerFrame: 2, fps: 45 })

// read current runtime
import { getGClassConfig } from 'gclass-anims'
getGClassConfig() // { throttlePerFrame: 1, fps: 30 }`}</Code>

      <H2>Demo - what throttling does</H2>
      <P>
        Three observers watch <code>document.body</code> for <code>.flip</code>,
        <code>.appear</code> and <code>.leave</code>. Without throttling they
        fire immediately in the same microtask. With <code>throttlePerFrame=1</code> a
        single hub observer queues mutations and drains them round robin: one
        observer type per <code>requestAnimationFrame</code> (flip then appear
        then leave). A mixed burst that touches all three types therefore
        spreads across three frames.
      </P>
      <div className="my-4 grid gap-3">
        <Demo className="flex flex-col items-start gap-2 py-6 text-sm">
          <span className="font-mono text-xs opacity-60">throttle 0 (default)</span>
          <span>One long task. All three observers fire together. Fastest completion, highest peak main thread cost. Best for desktop.</span>
        </Demo>
        <Demo className="flex flex-col items-start gap-2 py-6 text-sm">
          <span className="font-mono text-xs opacity-60">throttle 1 + fps 30 (low end)</span>
          <span>Three short tasks. One observer per frame and ticker capped at 30fps. Lower peak cost, about 32 to 48ms later for a mixed burst. Best for low end devices.</span>
        </Demo>
        <Demo className="flex flex-col items-start gap-2 py-6 text-sm">
          <span className="font-mono text-xs opacity-60">throttle 2 or 3</span>
          <span>Two or three observers per frame. Middle ground between the two above.</span>
        </Demo>
      </div>

      <H2>Demo - low end toggle</H2>
      <P>
        Copy this pattern for a low end device button. It calls{" "}
        <code>gclassOpts</code> on click and rewires observers immediately
        without a reload or a boot replay.
      </P>
      <Code>{`'use client'
import { gclassOpts } from 'gclass-anims'

export function LowEndToggle() {
  const [on, setOn] = useState(false)
  return (
    <button onClick={() => {
      const next = !on
      setOn(next)
      if (next) gclassOpts(1, 30)
      else gclassOpts() // reset to 0, default ticker
    }}>
      {on ? 'Low-end ON (1, 30)' : 'Enable low-end: gclassOpts(1, 30)'}
    </button>
  )
}`}</Code>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["throttlePerFrame", "Observers per rAF frame. 0 = no throttling (default, 3 observers immediate). 1 = round robin one per frame. 2 to 3 = two or three per frame"],
          ["fps", "GSAP ticker cap. 0 = default rAF (about 60fps, no cap). 30 = low end, 45 = balanced, 60 = capped 60"],
          ["initAnimations(throttle, fps)", "Set at boot. Also accepts initAnimations({throttlePerFrame, fps}). No args keeps last gclassOpts values"],
          ["gclassOpts(throttle, fps)", "Live switch. Both args optional, missing falls back to 0. gclassOpts() resets. Also accepts gclassOpts({throttlePerFrame, fps}). Rewires observers if running"],
          ["getGClassConfig()", "Read current {throttlePerFrame, fps}"],
          ["subscribeGClassConfig(cb)", "Subscribe to config changes, returns unsubscribe"],
        ]}
      />

      <Note>
        Defaults are intentionally minimal. Keep <code>0</code> and default
        ticker for marketing pages and desktops. Enable <code>gclassOpts(1, 30)</code> only
        when you detect a low end device or when a stress test with 150 to 200
        simultaneous <code>.appear</code> inserts shows a long task over 50ms in
        the Performance panel. The hub never drops mutations, it only spreads
        them. A mixed burst with all three types still completes, it just takes
        up to three frames.
      </Note>
    </article>
  );
}
