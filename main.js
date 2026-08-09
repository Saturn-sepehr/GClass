import './style.css'
// Importing AnimToggle auto-boots the GSAP system on DOMContentLoaded.
import { initAnimations, toggleAnimations } from './AnimToggle'

// Expose the toggle on window so it can be wired to an onClick in markup.
window.toggleAnimations = toggleAnimations
window.initAnimations = initAnimations
