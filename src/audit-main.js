import './main.css';

import Navbar,   { initNavbar }   from './components/Navbar.js';
import Audit,    { initAudit }    from './components/Audit.js';
import Footer                     from './components/Footer.js';
import Modals,   { initModals }   from './components/Modals.js';
import { initReveal }             from './utils/reveal.js';
import { initSmoothScroll }       from './utils/smoothScroll.js';
import { initTransition }         from './utils/transition.js';

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main id="main-content" tabindex="-1">
      ${Audit()}
    </main>
    ${Footer()}
    ${Modals()}
  `;

  initTransition(); // must be first — curtain covers page on load
  initSmoothScroll();
  initNavbar();
  initModals();
  initAudit();
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
