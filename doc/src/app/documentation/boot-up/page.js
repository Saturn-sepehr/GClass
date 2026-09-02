import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Boot-up" };

export default function Page() {
  return (
    <article>
      <H1>.boot-up - Welcome screen</H1>
      <P>
        Any HTML or JSX with <code>.boot-up</code> anywhere in the DOM becomes
        the welcome screen. No <code>Boot.html</code> fetch, no{" "}
        <code>initBoot()</code> - just <code>initAnimations()</code> (
        <code>AnimToggle.js:138</code>). On <strong>hard reload</strong> only,
        the engine pauses all DOM rendering except <code>.boot-up</code> and its
        children for <code>bootTime</code>, then removes the boot screen and
        boots the main animations. SPA path changes skip the boot.
      </P>

      <H2>Basic usage</H2>
      <Code>{`<div class="boot-up boot-time-2 boot-end-spawn-blur">
  <h1 class="spawn-up">GClass</h1>
  <p class="spawn-blur">Loading...</p>
</div>

<script type="module">
  import { initAnimations } from 'gclass-anims'
  initAnimations() // finds .boot-up anywhere, pauses 2s, then removes
</script>`}</Code>
      <Code lang="js">{`// React / Next.js (JSX)
import { useEffect } from 'react'
import { initAnimations } from 'gclass-anims'

export default function App(){
  useEffect(()=>{ initAnimations() },[])
  return <div className="boot-up boot-time-2 boot-end-spawn-blur">...</div>
}`}</Code>

      <H2>Tuneables</H2>
      <ClassRef
        rows={[
          [".boot-up", "Any element with this class is the boot screen. Can be anywhere. Only one per page - multiple logs console.error and skips boot."],
          ["boot-time-N", "Duration in seconds to show boot screen. Overwrites Config.js:74 defaults.bootTime (default 5). e.g. boot-time-2, boot-time-0.5. Max wins."],
          ["boot-end-<name>", "Exit animation in reverse before removing. <name> is a spawn sel without dot, e.g. boot-end-spawn-blur, boot-end-spawn-up. Plays from state via gsap.to. Skipped if absent."],
          ["boot-end-time-N", "Duration for the exit animation only. Falls back to boot-time-N or defaults.effectDuration."],
          ["ease-*", "Easing for the exit animation, e.g. ease-power3. Falls back to defaults.ease."],
        ]}
      />

      <H2>Behavior</H2>
      <P>
        <strong>No .boot-up:</strong> boot completely skipped,{" "}
        <code>initListeners()</code> runs immediately (<code>AnimToggle.js:146</code>).
      </P>
      <P>
        <strong>Single .boot-up:</strong> injects{" "}
        <code>html.gclass-booting&#123;visibility:hidden&#125; .boot-up&#123;visibility:visible;position:fixed;inset:0;z-index:9999&#125;</code>{" "}
        so only boot and children are visible, init is scoped to{" "}
        <code>initListeners(bootEl)</code> (<code>AnimToggle.js:162</code> via{" "}
        <code>Listeners.js:96</code> <code>qAll</code>), so spawn/loop/text inside
        boot still play. After <code>bootTime</code>, plays{" "}
        <code>boot-end</code> reverse if present, then hides boot (display:none +
        data-gclass-boot-hidden, React-safe) and boots main DOM.
      </P>
      <P>
        <strong>Multiple .boot-up:</strong> <code>console.error</code> and all boot
        screens hidden immediately, boot skipped (<code>AnimToggle.js:143</code>).
      </P>
      <P>
        <strong>Hard reload only:</strong> <code>hasBooted</code> flag in{" "}
        <code>AnimToggle.js:119</code> stays true after first boot; SPA path
        changes re-calling <code>initAnimations()</code> find the hidden boot
        (filtered by <code>data-gclass-boot-hidden</code>) and skip. Hard reload
        resets JS and shows boot again. StrictMode double-mount during boot is
        ignored via <code>bootTimeout</code> guard.
      </P>

      <H2>Config</H2>
      <Code lang="js">{`import { defaults } from 'gclass-anims'
defaults.bootTime = 5 // seconds, overwritten by boot-time-N
defaults.effectDuration = 1 // fallback for boot-end duration`}</Code>

      <H2>Examples</H2>
      <Code>{`<!-- 2s boot, exit with spawn-blur reverse -->
<div class="boot-up boot-time-2 boot-end-spawn-blur">
  <p class="typewriter">[  OK  ] Starting...</p>
</div>

<!-- No exit animation - just pause then hide -->
<div class="boot-up boot-time-2">Loading...</div>

<!-- Outside boot, normal animations (delayed until boot done) -->
<div class="spawn-up">reveals after boot</div>`}</Code>

      <Note>
        Animations inside <code>.boot-up</code> are fully playable - use any{" "}
        <code>Config.js:77</code> spawn/loop classes (<code>spawn-up</code>,{" "}
        <code>spawn-blur</code>, <code>float</code> etc). They run via scoped{" "}
        <code>initListeners</code> while main DOM is hidden.
      </Note>
    </article>
  );
}
