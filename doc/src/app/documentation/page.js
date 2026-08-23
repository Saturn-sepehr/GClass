import Link from "next/link";

export const metadata = {
  title: "GClass — Documentation",
};

export default function Documentation() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold font-rosemary">Documentation</h1>
      <p className="mt-4 opacity-70">Placeholder — docs are under construction.</p>
      <Link
        href="/"
        className="inline-block mt-8 p-2 font-bold bg-slate-700/80 hover:bg-slate-600/80 transition-colors text-cyan-200 rounded-xl"
      >
        ← Back home
      </Link>
    </div>
  );
}
