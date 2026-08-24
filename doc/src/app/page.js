import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-full flex items-center justify-center p-5 pt-6 sm:p-10 sm:pt-6 text-center">
      <main className="w-full max-w-2xl">
        <h1 className="text-cyan-200 text-4xl font-extrabold order spawn-text-spawn-down letter font-rosemary">GClass</h1>
        <h3 className="text-cyan-200/60 typewriter-split letter order">A Quality of life library for <a href="https://gsap.com/" className="font-extrabold underline text-green-500">GSAP</a></h3>
        <div className="w-full bg-slate-800/50 ring-1 ring-slate-700 p-5 sm:p-8 order spawn-down rounded-xl mt-6 max-w-2xl">
          <h2 className="text-xl text-cyan-200 font-bold text-left order typewriter">Quick start</h2>
          <h2 className="text-slate-400 font-bold text-left mt-3 order typewriter">Installation</h2>
          <div className="mt-2 p-5 rounded-xl bg-slate-950/80 ring-1 ring-slate-700/60 order curtain-vertical">
            <p className="text-cyan-200/90 text-left order typewriter">npm install gclass-anims</p>
          </div>
          <h2 className="text-slate-400 font-bold text-left mt-4 order typewriter">Usage</h2>
          <p className="text-slate-400 text-left order typewriter">Framework agnostic</p>
          <div className="mt-2 p-5 rounded-xl bg-slate-950/80 ring-1 ring-slate-700/60 order curtain-vertical">
            <p className="text-cyan-200/90 text-left order typewriter">initAnimations()</p>
          </div>
          <br></br>
          <div className="mt-4 order spawn-down bounce click-hover wrap-div compatibility cursor-pointer">
            <Link
              href="/documentation"
              className="block p-2 font-bold border border-cyan-200/25 bg-cyan-200/5 hover:bg-cyan-200/15 transition-colors text-cyan-200 rounded-xl text-center"
            >
              Docs
            </Link>
          </div>
          <br></br>
          <p className="text-red-500 typewriter order">GCLASS IS STILL IN BETA, EXPECT A LOT BUGS</p>
        </div>
      </main>
    </div>
  );
}
