import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Angular)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Angular</H1>
      <P>
        Framework-agnostic - call <code>initAnimations()</code> once the view is
        ready and re-call it after SPA navigation. The engine is SSR-safe
        (checks <code>window</code>) but you should still guard with{" "}
        <code>isPlatformBrowser</code> and run only on the client.
      </P>
      <Note>
        Placeholder - Angular quick-start is coming soon. Will cover standalone
        components, SSR with Angular Universal, and router re-init.
      </Note>

      <H2>Usage - Standalone root component</H2>
      <P>
        Mirrors the verified test in <code>gclass-test-angular</code> (
        <code>src/app/app.component.ts:21</code>). Uses a dynamic import so
        GSAP stays client-only.
      </P>
      <Code>{`import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const { initAnimations } = await import('gclass-anims');
    initAnimations();

    // Re-init on SPA navigation (same as Vue router.afterEach)
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(async () => {
        await new Promise((r) => setTimeout(r, 0));
        initAnimations();
      });
  }
}`}</Code>

      <H2>Alternate - afterNextRender (Angular 16+)</H2>
      <Code>{`import { afterNextRender, Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({ selector: 'app-root', template: '<router-outlet />' })
export class AppComponent {
  constructor(@Inject(PLATFORM_ID) pid: Object, router: Router) {
    if (!isPlatformBrowser(pid)) return;
    afterNextRender(() => {
      import('gclass-anims').then(({ initAnimations }) => {
        initAnimations();
        router.events.pipe(filter(e => e instanceof NavigationEnd))
          .subscribe(() => initAnimations());
      });
    });
  }
}`}</Code>

      <H2>What&apos;s next</H2>
      <P>
        Add utility classes to your templates (
        <code>class="appear scroll spawn-up"</code>, <code>class="float magnet"</code>).
        No directives or wrappers needed. Mark persistent layout shells with{" "}
        <code>.preserve</code> so they skip re-animation on route change.
      </P>
    </article>
  );
}
