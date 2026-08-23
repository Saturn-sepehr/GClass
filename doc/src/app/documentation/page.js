"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Documentation() {
  const nav = useRouter()
  useEffect(() => {
    nav.push("/documentation/installation")
  } , [])
  return (
    <div>
      <h1 className="text-3xl font-extrabold font-rosemary">Documentation</h1>
      
      <Link
        href="/"
        className="inline-block mt-8 p-2 font-bold bg-slate-700/80 hover:bg-slate-600/80 transition-colors text-cyan-200 rounded-xl"
      >
        ← Back home
      </Link>
    </div>
  );
}
