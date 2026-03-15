import './main.css';

import CanvasBackground, { initCanvas } from './components/CanvasBackground.js';
import Navbar, { initNavbar } from './components/Navbar.js';
import Hero from './components/Hero.js';
import Results from './components/Results.js';
import Protocol from './components/Protocol.js';
import Calculator, { initCalculator } from './components/Calculator.js';
import LeadForm, { initLeadForm } from './components/LeadForm.js';
import Footer from './components/Footer.js';
import { initReveal } from './utils/reveal.js';

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${CanvasBackground()}
    ${Navbar()}
    <main id="main-content" tabindex="-1">
      ${Hero()}
      ${Results()}
      ${Protocol()}
      ${Calculator()}
      ${LeadForm()}
    </main>
    ${Footer()}
  `;

  // Initialise interactive modules
  initCanvas();
  initNavbar();
  initCalculator();
  initLeadForm();

  // Scroll-reveal must run last so all elements are in the DOM
  initReveal();
}

// Guard against DOMContentLoaded having already fired (Vite HMR)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
