import gsap from 'gsap'
import {
  initAnimations,
  toggleAnimations,
  enableReducedMotion,
  disableReducedMotion,
  initListeners,
  registerComplete,
  customAnims,
  defaults,
  animations,
  normalize,
} from '../index.js'
import { resolveHandler } from '../Listeners.js'
import { Example } from '../CustomAnims.js'
import * as anims from '../Animations.js'

window.gsap = gsap
window.gclass = {
  initAnimations,
  toggleAnimations,
  enableReducedMotion,
  disableReducedMotion,
  initListeners,
  registerComplete,
  resolveHandler,
  customAnims,
  Example,
  defaults,
  animations,
  normalize,
  ...anims,
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => initAnimations())
}