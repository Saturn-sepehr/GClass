# GClass

A Tailwind-style utility layer on top of GSAP. Drop a few CSS classes onto any
element and it gets animated — no JavaScript configuration required.

Framework-agnostic: works in vanilla JS, React, Vue, Svelte, or any bundler.

## Installation

```
npm install gclass
```

GSAP is installed automatically as a dependency.

> GSAP is not bundled into this package. It is used under the Webflow Standard
> No-Charge GSAP License and installed separately via npm.

## Quick start

Import the public API and call `initAnimations()` once the DOM is ready.

### Vanilla JS

```html
<script type="module">
  import { initAnimations } from 'gclass'
  initAnimations()
</script>
```

### React (any component)

```jsx
import { useEffect } from 'react'
import { initAnimations } from 'gclass'

function App() {
  useEffect(() => {
    initAnimations()
    // optional cleanup: re-call to reset, or call a returned teardown
  }, [])
  return <div>...</div>
}
```

### Vue

```js
import { onMounted } from 'vue'
import { initAnimations } from 'gclass'

export default {
  setup() {
    onMounted(() => initAnimations())
  },
}
```

## Usage

Add utility classes to your markup. Everything is class-driven — no config.

```html
<div class="spawn-up">reveals sliding up on scroll</div>
<div class="float">loops a floating animation</div>
<button class="magnet click-expand">magnet + click</button>
```

### Toggling animations

```js
import { initAnimations, toggleAnimations } from 'gclass'

toggleAnimations() // persists the choice to localStorage and reloads
```

### Custom animations

Add entries to `customAnims` (a class, `from` state, and a `play` callback) and
they integrate with the existing scroll/leave/order/delay/ease machinery.

```js
import { customAnims } from 'gclass'

customAnims.push({
  sel: '.whirl',
  from: { opacity: 0, rotation: 90, scale: 0.7 },
  play: (el, delay, dur, ease) =>
    gsap.fromTo(el, { opacity: 0, rotation: 90, scale: 0.7 }, {
      ease, duration: dur, delay, rotation: 0, scale: 1, opacity: 1,
    }),
})
```

## License

MIT — except GSAP, which is used under the Webflow Standard No-Charge GSAP
License and is not bundled or redistributed.
