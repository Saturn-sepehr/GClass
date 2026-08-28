import { H1, H2, P, Note, Code, QSButtons } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";

export const metadata = { title: "GClass - Quick start" };

export default function Page() {
  return (
    <article>
      <H1>Quick start</H1>
      <P>
        Import <code>initAnimations</code> once your DOM is ready. From then on,
        everything is class-driven: add a utility class to an element and it
        animates - no per-element JS, no config files.
      </P>

      <div className="grid grid-cols-2 gap-2">
        <QSButtons link="/documentation/quick-start-js">
          <svg width="64" height="64" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-300">
            <path fillRule="nonzero" clipRule="nonzero" d="M0 1.75C0 0.783501 0.783502 0 1.75 0H14.25C15.2165 0 16 0.783502 16 1.75V3.75C16 4.16421 15.6642 4.5 15.25 4.5C14.8358 4.5 14.5 4.16421 14.5 3.75V1.75C14.5 1.61193 14.3881 1.5 14.25 1.5H1.75C1.61193 1.5 1.5 1.61193 1.5 1.75V14.25C1.5 14.3881 1.61193 14.5 1.75 14.5H15.25C15.6642 14.5 16 14.8358 16 15.25C16 15.6642 15.6642 16 15.25 16H1.75C0.783501 16 0 15.2165 0 14.25V1.75ZM8.25 5.75C8.66421 5.75 9 6.08579 9 6.5V10.5C9 11.5048 8.72399 12.2584 8.15514 12.7324C7.61223 13.1848 6.95384 13.25 6.5 13.25C6.08579 13.25 5.75 12.9142 5.75 12.5C5.75 12.0858 6.08579 11.75 6.5 11.75C6.84617 11.75 7.06277 11.6902 7.19486 11.5801C7.301 11.4916 7.5 11.2452 7.5 10.5V6.5C7.5 6.08579 7.83578 5.75 8.25 5.75ZM11.2757 6.58011C11.6944 6.08164 12.3507 5.75 13.25 5.75C14.0849 5.75 14.7148 6.03567 15.1394 6.48481C15.4239 6.78583 15.4105 7.26052 15.1095 7.54505C14.8085 7.82958 14.3338 7.81621 14.0493 7.51519C13.9394 7.39898 13.7204 7.25 13.25 7.25C12.7493 7.25 12.5306 7.41836 12.4243 7.54489C12.2934 7.70065 12.25 7.896 12.25 8C12.25 8.104 12.2934 8.29935 12.4243 8.45511C12.5306 8.58164 12.7493 8.75 13.25 8.75C13.3257 8.75 13.3988 8.76121 13.4676 8.78207C14.1307 8.87646 14.6319 9.17251 14.9743 9.58011C15.3684 10.0493 15.5 10.604 15.5 11C15.5 11.396 15.3684 11.9507 14.9743 12.4199C14.5556 12.9184 13.8993 13.25 13 13.25C12.1651 13.25 11.5352 12.9643 11.1106 12.5152C10.8261 12.2142 10.8395 11.7395 11.1405 11.4549C11.4415 11.1704 11.9162 11.1838 12.2007 11.4848C12.3106 11.601 12.5296 11.75 13 11.75C13.5007 11.75 13.7194 11.5816 13.8257 11.4551C13.9566 11.2993 14 11.104 14 11C14 10.896 13.9566 10.7007 13.8257 10.5449C13.7194 10.4184 13.5007 10.25 13 10.25C12.9243 10.25 12.8512 10.2388 12.7824 10.2179C12.1193 10.1235 11.6181 9.82749 11.2757 9.41989C10.8816 8.95065 10.75 8.396 10.75 8C10.75 7.604 10.8816 7.04935 11.2757 6.58011Z" fill="currentColor" />
          </svg>
          Javascript
        </QSButtons>
        <QSButtons link="/documentation/quick-start-react">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-300">
            <circle cx="12" cy="12" r="1.8" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="currentColor" strokeWidth="1.4" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="currentColor" strokeWidth="1.4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="currentColor" strokeWidth="1.4" transform="rotate(120 12 12)" />
          </svg>
          React
        </QSButtons>
        <QSButtons link="/documentation/quick-start-vue">
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-300">
            <path d="M2.5 5 L16 26 L29.5 5 L23.5 5 L16 18 L8.5 5 Z" fill="currentColor" />
            <path d="M8.5 5 L16 18 L23.5 5 L19.8 5 L16 12.5 L12.2 5 Z" fill="#082f49" fillOpacity="0.35" />
          </svg>
          Vue
        </QSButtons>
        <QSButtons link="/documentation/quick-start-svelte">
          <svg width="64px" height="64px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-300">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.438 2.94656C13.0222 3.84625 13.0826 4.82176 12.784 5.56064C12.2332 5.04017 11.5732 4.66735 10.8806 4.48388C10.8888 4.33095 10.8504 4.17412 10.7606 4.03584C10.535 3.68845 10.0705 3.58972 9.72314 3.81532L8.0472 4.90369C8.04673 4.90399 8.04627 4.90429 8.0458 4.9046L5.52979 6.53851C5.1824 6.76411 5.08367 7.22861 5.30926 7.57599C5.53486 7.92338 5.99936 8.02212 6.34675 7.79652L8.86347 6.16214C8.86323 6.16229 8.86371 6.16198 8.86347 6.16214C9.81822 5.54278 11.3592 5.87563 12.2475 7.24351C13.1361 8.61173 12.813 10.1553 11.8583 10.7753L6.82625 14.0431C5.87156 14.6631 4.33001 14.3304 3.44148 12.9622C2.85722 12.0625 2.79684 11.087 3.09545 10.3481C3.64623 10.8686 4.30624 11.2414 4.99882 11.4249C4.99062 11.5778 5.02903 11.7347 5.11882 11.8729C5.34442 12.2203 5.80892 12.3191 6.15631 12.0935L10.3497 9.37027C10.697 9.14467 10.7958 8.68017 10.5702 8.33279C10.3446 7.9854 9.88009 7.88666 9.5327 8.11226L7.01644 9.74634C7.01652 9.74629 7.01635 9.7464 7.01644 9.74634C6.06172 10.3661 4.52038 10.0334 3.63192 8.66527C2.74339 7.29705 3.06648 5.75348 4.02117 5.13349L9.0532 1.86566C10.0079 1.24567 11.5494 1.57834 12.438 2.94656ZM13.7667 6.88194C14.7218 5.56301 14.6705 3.63028 13.696 2.1296C12.4789 0.255528 10.0607 -0.577139 8.23624 0.607651L3.20422 3.87549C1.52381 4.96675 1.20205 7.21441 2.11271 9.02685C1.15769 10.3458 1.20893 12.2785 2.18348 13.7792C3.40052 15.6533 5.81879 16.4859 7.64321 15.3011L12.6752 12.0333C14.3556 10.942 14.6774 8.69437 13.7667 6.88194Z" fill="currentColor"></path>
            </g>
          </svg>
          Svelte
        </QSButtons>
        <QSButtons link="/documentation/quick-start-next">
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-300">
            <circle cx="16" cy="16" r="14" fill="currentColor" />
            <path d="M10 10.5 L10 21.5 L12.2 21.5 L12.2 14.8 L20 21.5 L22 21.5 L22 10.5 L19.8 10.5 L19.8 17.2 L12 10.5 Z" fill="#020617" />
          </svg>
          Next.js
        </QSButtons>
        <QSButtons link="/documentation/quick-start-vite">
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-300">
            <path d="M29.88 6.146 L16.74 29.646 C16.47 30.131 15.77 30.134 15.5 29.651 L2.1 6.148 C1.8 5.622 2.25 4.985 2.85 5.091 L16 7.443 L28.88 5.095 C29.48 4.987 29.93 5.619 29.88 6.146 Z" fill="currentColor" opacity="0.95" />
            <path d="M22.26 2.007 L12.54 3.913 C12.36 3.95 12.25 4.12 12.25 4.242 L11.65 14.346 C11.64 14.584 11.85 14.769 12.09 14.715 L14.8 14.09 C15.05 14.03 15.28 14.25 15.23 14.51 L14.42 18.45 C14.37 18.71 14.62 18.94 14.88 18.86 L16.55 18.35 C16.81 18.27 17.06 18.5 17 18.77 L15.72 24.95 C15.64 25.34 16.16 25.55 16.37 25.22 L24.44 9.185 C24.57 8.92 24.35 8.618 24.06 8.674 L21.27 9.212 C21.01 9.263 20.79 9.019 20.86 8.762 L22.68 2.456 C22.75 2.2 22.53 1.955 22.26 2.007 Z" fill="#082f49" fillOpacity="0.45" />
          </svg>
          Vite
        </QSButtons>
        <QSButtons link="/documentation/quick-start-angular">
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-300">
            <path d="M16 3 L27.5 8.2 L25.8 24.5 L16 29 L6.2 24.5 L4.5 8.2 Z" fill="currentColor" />
            <path d="M16 6 L16 26 L23.8 22.8 L25.2 9.5 Z" fill="#082f49" fillOpacity="0.35" />
            <path d="M16 6 L8.2 9.5 L6.8 22.8 L16 26 Z" fill="currentColor" opacity="0.9" />
            <path d="M13.2 13 L18.8 13 L17.9 19 L16 20.5 L14.1 19 Z" fill="#020617" />
          </svg>
          Angular
        </QSButtons>
        <QSButtons link="/documentation/quick-start-nuxt">
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-300">
            <path d="M4 24 L10 10 L16 18 L20.5 12 L28 24 Z" fill="currentColor" />
            <path d="M10 10 L16 18 L20.5 12 L16 6 Z" fill="currentColor" opacity="0.7" />
            <path d="M4 24 L28 24 L28 26 L4 26 Z" fill="currentColor" opacity="0.9" />
          </svg>
          Nuxt
        </QSButtons>
      </div>

      <H2>Your first animation</H2>
      <P>
        Press Replay to remove and re-insert the box below - the engine watches
        the DOM for <code>.appear</code> elements and plays their entrance each
        time they mount.
      </P>
      <Replay>
        <div className="appear scroll spawn-up flex min-h-[72px] min-w-[220px] items-center justify-center rounded-xl bg-slate-800 p-5 ring-1 ring-slate-700">
          .appear.scroll.spawn-up
        </div>
      </Replay>

      <Note>
        Class anatomy: <b>behaviour</b> (<code>.spawn-up</code>) +{" "}
        <b>trigger</b> (<code>.scroll</code>, <code>.appear</code>) +{" "}
        <b>tunables</b> (<code>.time-1</code>, <code>.ease-back</code>,{" "}
        <code>.priority-2</code>). Combine freely - order in{" "}
        <code>class</code> does not matter.
      </Note>
    </article>
  );
}
