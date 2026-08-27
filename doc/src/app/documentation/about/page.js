import { H1, H2, P } from '@/Shared/DocsUI';
import Link from 'next/link';
import React from 'react'


export const metadata = { title: "GClass - About" };
export default function page() {
  return (
   <article>
    <H1>About</H1>
    <P>This project was originally started on a Next.js app i've been making for a programming school, but I randomly decided to turn it into an npm package :3</P>
    <P>Due to me being still very new to javascript and web development in general i've been using AI to make a lot of this project however I've been trying to use this project as a way to learn javascript more and rely less on AI</P>
    <H2>Ramblings</H2>
    <P>Since this is my first npm package I originally wanted the versions to be 1.0.0-beta.X to 2.0.0-beta.X until version 1.0.0 but I've learned that that's not how it works, so i have to bump the version to 1.0.0-beta.X until release 1.0.0 TmT</P>
    <H2>Shameless plugs</H2>
    <P>My Twitter (or X) where I put my artwork sometimes</P>
    <Link href="https://x.com/Saturn_sepehr" className='order typewriter text-cyan-300 underline'>https://x.com/Saturn_sepehr</Link>
   </article>
  )
}
