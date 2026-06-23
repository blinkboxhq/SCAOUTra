import './main.css';

import VideoBackground,  { initVideoBackground }  from './components/VideoBackground.js';
import Navbar,            { initNavbar }           from './components/Navbar.js';
import Footer                                      from './components/Footer.js';
import Modals,            { initModals }            from './components/Modals.js';
import WebPricing,        { initWebPricing }        from './components/WebPricing.js';
import { initReveal }                              from './utils/reveal.js';
import { initSmoothScroll }                        from './utils/smoothScroll.js';
import { initCounters }                            from './utils/counter.js';
import { initMagnet }                              from './utils/magnet.js';
import { initScramble }                            from './utils/scramble.js';
import { initTransition }                          from './utils/transition.js';
import { initSpotlight }                           from './utils/spotlight.js';

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${VideoBackground()}
    ${Navbar()}
    <main id="main-content" tabindex="-1">
      ${WebPricing()}
    </main>
    ${Footer()}
    ${Modals()}
  `;

  initTransition(); // must be first — curtain covers page on load
  initSmoothScroll();
  initVideoBackground();
  initNavbar();
  initWebPricing();
  initModals();
  initReveal();
  initCounters();
  initScramble();
  initMagnet();
  initSpotlight();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
