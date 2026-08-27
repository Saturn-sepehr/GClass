import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import DrawSplitFix from "@/Shared/DrawSplitFix";

export const metadata = { title: "GClass — DrawSVG" };

export default function Page() {
  return (
    <article>
   
      <H1>DrawSVG — stroke reveals</H1>
    
      <P>
        <code>.draw</code> and <code>.draw-split</code> progressively draw an
        SVG stroke from <code>0%</code> to <code>100%</code> using GSAP&apos;s
        DrawSVGPlugin. Strokes only — filled shapes are out of scope. Both are
        spawn classes, so they get <code>.scroll</code>,{" "}
        <code>.scroll-progress</code>, <code>.appear</code>,{" "}
        <code>.leave</code> and all timing tunables for free.
      </P>
      <Code>{`<svg viewBox="0 0 200 80">
  <!-- single-segment path -->
  <path class="draw appear time-2" d="M10 40 C40 10 80 90 120 40 S160 10 190 40"
        fill="none" stroke="currentColor" stroke-width="3" />
</svg>

<svg viewBox="0 0 200 80">
  <!-- multi-segment path (multiple M commands) -->
  <path class="draw-split appear time-2" d="M10 20 L80 20 M10 40 L80 40 M10 60 L80 60"
        fill="none" stroke="currentColor" stroke-width="3" />
</svg>`}</Code>

      <H2>.draw — single stroke</H2>
      <P>
        Draws the target(s) as one stroke via{" "}
        <code>drawSVG: &quot;0%&quot; → &quot;100%&quot;</code>. Works on any
        single-segment <code>&lt;path&gt;</code>, <code>&lt;line&gt;</code>,{" "}
        <code>&lt;polyline&gt;</code> or <code>&lt;circle&gt;</code> that has a
        visible stroke. Applied as{" "}
        <code>from: &#123; drawSVG: &quot;0%&quot; &#125;</code> so scroll
        reversal and leave animations return to undrawn correctly.
      </P>
      <Replay>
        <Demo className="flex min-h-[120px] items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="h-[86px] w-[86px] text-cyan-200"
            style={{ contain: "paint" }}
          >
            <circle
              className="draw appear time-2"
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        </Demo>
      </Replay>

      <H2>.draw-split — multi-segment paths</H2>
      <P>
        Browsers can&apos;t reliably dash-animate a path with multiple{" "}
        <code>M</code> commands as one stroke. <code>.draw-split</code>{" "}
        busts it apart first: each segment becomes its own{" "}
        <code>&lt;path&gt;</code> (attributes copied verbatim, original
        removed), then each segment is drawn sequentially with a slice of{" "}
        <code>time-N</code> proportional to its length — constant pen speed
        across the whole drawing. Result is cached on the element so StrictMode
        remounts don&apos;t churn the DOM.
      </P>
      <Replay>
        <div
          style={{ contain: "paint", contentVisibility: "auto", isolation: "isolate" }}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800/40 p-5 flex min-h-[120px] items-center justify-center isolate will-change-transform"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[86px] w-[86px] text-cyan-200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ contain: "paint" }}
          >
            <path
              className="draw-split appear time-2"
              d="M19 9.77806V16.2C19 17.8801 19 18.7202 18.673 19.3619C18.3854 19.9264 17.9265 20.3854 17.362 20.673C16.7202 21 15.8802 21 14.2 21H9.8C8.11984 21 7.27976 21 6.63803 20.673C6.07354 20.3854 5.6146 19.9264 5.32698 19.3619C5 18.7202 5 17.8801 5 16.2V9.7774M21 12L15.5668 5.96393C14.3311 4.59116 13.7133 3.90478 12.9856 3.65138C12.3466 3.42882 11.651 3.42887 11.0119 3.65153C10.2843 3.90503 9.66661 4.59151 8.43114 5.96446L3 12M14 12C14 13.1045 13.1046 14 12 14C10.8954 14 10 13.1045 10 12C10 10.8954 10.8954 9.99996 12 9.99996C13.1046 9.99996 14 10.8954 14 12Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
      </Replay>
      <P className="text-xs opacity-60">
        If there&apos;s nothing drawable (empty selection or zero-length
        strokes) the helper returns an inert timeline rather than dividing by
        zero.
      </P>

      <H2>.fill-svg — fill after stroke (modifier)</H2>
      <P>
        <code>.fill-svg</code> is a modifier for <code>.draw</code> and{" "}
        <code>.draw-split</code> — add it alongside either class and the
        interior fills after the stroke finishes (<code>draw → fill</code>).
        Requires a fill color on the element (<code>fill</code> attribute or
        CSS); the modifier animates <code>fillOpacity: 0 → 1</code> so the
        color appears only once the outline is complete. Leave / scroll
        reversal un-fills before un-drawing, and <code>.scroll-progress</code>{" "}
        scrubs draw then fill sequentially.
      </P>
      <Code>{`<circle class="draw fill-svg appear time-2 fill-time-1" cx="50" cy="50" r="38"
        fill="currentColor" stroke="currentColor" stroke-width="3" />
<path class="draw-split fill-svg appear time-2 fill-time-0.6" d="M10 20 L80 20 M10 40 ..." 
        fill="currentColor" stroke="currentColor" />`}</Code>

      <Replay>
        <Demo className="flex min-h-[120px] items-center justify-center gap-10">
          <svg
            viewBox="0 0 100 100"
            className="h-[86px] w-[86px] text-cyan-200"
            style={{ contain: "paint" }}
          >
            <circle
              className="draw fill-svg appear time-2 fill-time-0.6"
              cx="50"
              cy="50"
              r="38"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <span className="text-xs opacity-60">.draw + .fill-svg</span>
        </Demo>
      </Replay>

      <Replay>
        <div
          style={{ contain: "paint", contentVisibility: "auto", isolation: "isolate" }}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800/40 p-5 flex min-h-[120px] items-center justify-center gap-6 isolate will-change-transform"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[86px] w-[86px] text-cyan-200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ contain: "paint" }}
          >
            <path
              className="draw-split fill-svg appear time-2 fill-time-0.6"
              d="M19 9.77806V16.2C19 17.8801 19 18.7202 18.673 19.3619C18.3854 19.9264 17.9265 20.3854 17.362 20.673C16.7202 21 15.8802 21 14.2 21H9.8C8.11984 21 7.27976 21 6.63803 20.673C6.07354 20.3854 5.6146 19.9264 5.32698 19.3619C5 18.7202 5 17.8801 5 16.2V9.7774M21 12L15.5668 5.96393C14.3311 4.59116 13.7133 3.90478 12.9856 3.65138C12.3466 3.42882 11.651 3.42887 11.0119 3.65153C10.2843 3.90503 9.66661 4.59151 8.43114 5.96446L3 12M14 12C14 13.1045 13.1046 14 12 14C10.8954 14 10 13.1045 10 12C10 10.8954 10.8954 9.99996 12 9.99996C13.1046 9.99996 14 10.8954 14 12Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="text-xs opacity-60">.draw-split + .fill-svg</span>
        </div>
      </Replay>
      <P className="text-xs opacity-60">
        Fill timing is separate: <code>fill-time-N</code> sets fill duration
        (default <code>0.5× time-N</code>), <code>fill-ease-NAME</code> overrides
        ease (default reuses draw ease). Without <code>.fill-svg</code> the
        element stays stroked with transparent interior.
      </P>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["time-N", "Seconds to draw (split: total time, split proportionally by length)"],
          ["fill-time-N", "Fill duration after draw (default 0.5 × time-N)"],
          ["ease-NAME", "Draw ease (default power3.out)"],
          ["fill-ease-NAME", "Fill ease (default reuses draw ease)"],
          ["delay / priority-N / .order", "Same spawn delay machinery"],
          [".scroll / .scroll-progress", "Enter-replay or scrubbed draw → fill; leave reverses unfill → undraw"],
        ]}
      />
      <Code>{`<path class="draw scroll time-2 ease-power2.out" d="..." />
<path class="draw-split scroll-progress progress-start-20 progress-end-80" d="M10 20 L80 20 M10 40 ..." />
<circle class="draw fill-svg scroll time-2 fill-time-0.6 fill-ease-power2.out" cx="50" cy="50" r="38" fill="currentColor" />
<path class="draw-split fill-svg scroll-progress fill-time-1" d="..." />`}</Code>

      <Note>
        Stroke only — for outline-only reveals keep{" "}
        <code>fill=&quot;none&quot;</code> with a visible{" "}
        <code>stroke</code>/<code>stroke-width</code>. Add{" "}
        <code>.fill-svg</code> with a <code>fill</code> color (
        <code>fill=&quot;currentColor&quot;</code> inherits the text color) to
        fill after the stroke; it animates <code>fillOpacity</code>. Markers
        and multi-path groups are untouched. Draw state is{" "}
        <code>drawSVG: 0% → 100%</code> — the stroke IS the reveal. Splitting
        replaces the source path in the DOM and copies all attributes verbatim.
      </Note>
    </article>
  );
}
