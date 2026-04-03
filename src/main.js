import './main.css';

import ShaderBackground, { initShaderBackground } from './components/ShaderBackground.js';
import Navbar,            { initNavbar }           from './components/Navbar.js';
import Hero                                        from './components/Hero.js';
import Results                                     from './components/Results.js';
import ContainerScroll,   { initContainerScroll }  from './components/ContainerScroll.js';
import TextReveal,        { initTextReveal }        from './components/TextReveal.js';
import Protocol                                    from './components/Protocol.js';
import LeadForm,          { initLeadForm }          from './components/LeadForm.js';
import Footer                                      from './components/Footer.js';
import Modals,            { initModals }            from './components/Modals.js';
import { initReveal }                              from './utils/reveal.js';

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${ShaderBackground()}
    ${Navbar()}
    <main id="main-content" tabindex="-1">
      ${Hero()}
      ${Results()}
      ${ContainerScroll()}
      ${TextReveal({
        text:  'We map your operations, find the bottlenecks costing you the most, and build the infrastructure to eliminate them — permanently, without disrupting your business.',
        id:    'value-prop',
        badge: 'The Scoutra Approach',
      })}
      ${Protocol()}
      ${LeadForm()}
    </main>
    ${Footer()}
    ${Modals()}
  `;

  // Initialise interactive modules (order matters)
  initShaderBackground();
  initNavbar();
  initContainerScroll();
  initTextReveal();
  initLeadForm();
  initModals();

  // Scroll-reveal must run last so all elements are in the DOM
  initReveal();
}

// Guard against DOMContentLoaded having already fired (Vite HMR)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
