import gsap from 'gsap'
import {
  initAnimations,
  toggleAnimations,
  enableReducedMotion,
  disableReducedMotion,
  registerComplete,
  customAnims,
  defaults,
  animations,
} from '../index.js'

window.gsap = gsap
window.gclass = {
  initAnimations,
  toggleAnimations,
  enableReducedMotion,
  disableReducedMotion,
  registerComplete,
  customAnims,
  defaults,
  animations,
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => initAnimations())
}