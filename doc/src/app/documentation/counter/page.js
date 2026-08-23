import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";

export const metadata = { title: "GClass — Counters" };

const CARD =
  "rounded-xl bg-slate-800 p-5 text-center ring-1 ring-slate-700";

export default function Page() {
  return (
    <article>
      <H1>.count — number counters</H1>
      <P>
        <code>.count</code> animates the number inside an element from a start
        value up (or down) to the number found in its content. It is a pure
        counter — only <code>textContent</code> is touched, never opacity — so
        it composes cleanly with <code>.scroll</code>,{" "}
        <code>.scroll-progress</code>, <code>.appear</code> and{" "}
        <code>.leave</code>. Pair it with a spawn like{" "}
        <code>.spawn-fade</code> when you also want a fade-in.
      </P>

      <Code>{`<span class="count">1250</span>            <!-- 0 → 1250 -->
<span class="count spawn-num-100">0</span>      <!-- 100 → 0 (counts down) -->
<span class="count scroll">97531</span>        <!-- replays on every scroll enter -->

<!-- scrubbed directly by the scrollbar -->
<span class="count scroll-progress">100</span>%`}</Code>

      <H2>Demo — the basics</H2>
      <P>
        Four counters that played when this page loaded: a default 0-count, a
        decimal target, a countdown via <code>.spawn-num-N</code>, and a custom
        start point. Reload or revisit the page to replay them.
      </P>
      <Replay>
      <div className="my-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className={CARD}>
          <p className="count text-3xl appear font-extrabold text-cyan-200">1250</p>
          <p className="mt-2 text-xs opacity-60">default · 0 → 1250</p>
        </div>
        <div className={CARD}>
          <p className="count text-3xl appear font-extrabold text-cyan-200">3.14</p>
          <p className="mt-2 text-xs opacity-60">decimals preserved</p>
        </div>
        <div className={CARD}>
          <p className="count spawn-num-100 text-3xl appear font-extrabold text-cyan-200">0</p>
          <p className="mt-2 text-xs opacity-60">.spawn-num-100 · down</p>
        </div>
        <div className={CARD}>
          <p className="count spawn-num-1984 appear text-3xl font-extrabold text-cyan-200">2026</p>
          <p className="mt-2 text-xs opacity-60">starts at 1984</p>
        </div>
        
      </div>
      </Replay>

      <H2>Demo — scroll-triggered</H2>
      <P>
        With <code>.scroll</code> the count runs when the element enters the
        viewport and rewinds to its start value when it leaves — scroll back
        up over these to watch them reset and recount.
      </P>
      <div className="my-4 space-y-[38vh]">
        <div className="text-center">
          <p className="count scroll text-5xl font-extrabold text-cyan-200">
            4200
          </p>
          <p className="mt-2 text-xs opacity-60">.count .spawn-fade .scroll</p>
        </div>
        <div className="text-center">
          <p className="count scroll text-5xl font-extrabold text-cyan-200">
            99.9
          </p>
          <p className="mt-2 text-xs opacity-60">uptime % — one decimal</p>
        </div>
      </div>

      <H2>Demo — scrubbed by the scrollbar</H2>
      <P>
        Combined with <code>.scroll-progress</code> your scroll position IS
        the playhead: the number tracks the scrollbar exactly, up and down.
      </P>
      <div className="h-[35vh]" />
      <Demo className="flex min-h-[160px] items-center justify-center gap-2 py-10 text-center">
        <span className="count scroll-progress spawn-num-0 text-6xl font-extrabold text-cyan-200">
          100
        </span>
        <span className="text-2xl opacity-70">%</span>
      </Demo>
      <div className="h-[35vh]" />

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["spawn-num-N", "Count from N instead of 0 — N above the target counts down"],
          ["time-N", "Seconds the count takes (standard spawn machinery)"],
        ]}
      />
      <Note>
        Put <code>.count</code> on an element containing{" "}
        <b>only the number</b>: the tick rewrites <code>textContent</code>,
        so surrounding currency symbols or suffixes would be wiped. Commas in
        the source are parsed away (<code>$1,250</code> counts to{" "}
        <code>1250</code>) and decimals in the target are kept (
        <code>3.14</code> counts to <code>3.14</code>). The target is cached
        per element so a <code>.scroll</code> reverse can&apos;t collapse the
        range.
      </Note>
    </article>
  );
}
