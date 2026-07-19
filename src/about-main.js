import './main.css';

import Navbar,   { initNavbar }   from './components/Navbar.js';
import About                      from './components/About.js';
import Footer                     from './components/Footer.js';
import Modals,   { initModals }   from './components/Modals.js';
import { initReveal }             from './utils/reveal.js';
import { initSmoothScroll }       from './utils/smoothScroll.js';
import { initMagnet }             from './utils/magnet.js';
import { initScramble }           from './utils/scramble.js';
import { initTransition }         from './utils/transition.js';
import { initParallax }           from './utils/parallax.js';
import { initSpotlight }          from './utils/spotlight.js';

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main id="main-content" tabindex="-1">
      ${About()}
    </main>
    ${Footer()}
    ${Modals()}
  `;

  initTransition(); // must be first — curtain covers page on load
  initSmoothScroll();
  initNavbar();
  initModals();
  initReveal();
  initScramble();
  initMagnet();
  initParallax();
  initSpotlight();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
