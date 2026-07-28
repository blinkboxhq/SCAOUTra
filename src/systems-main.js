import './main.css';

import Navbar,        { initNavbar }   from './components/Navbar.js';
import SystemsDetail                    from './components/SystemsDetail.js';
import Footer                           from './components/Footer.js';
import Modals,        { initModals }    from './components/Modals.js';
import { initReveal }                   from './utils/reveal.js';
import { initSmoothScroll }             from './utils/smoothScroll.js';
import { initMagnet }                   from './utils/magnet.js';
import { initScramble }                 from './utils/scramble.js';
import { initTransition }               from './utils/transition.js';
import { initParallax }                 from './utils/parallax.js';
import { initSpotlight }                from './utils/spotlight.js';

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main id="main-content" tabindex="-1">
      ${SystemsDetail()}
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

  // The card links arrive as /systems#slug; the anchor exists only after the
  // markup above is written, so jump to it once rendering is done.
  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
