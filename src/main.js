import './main.css';

import VideoBackground,  { initVideoBackground }  from './components/VideoBackground.js';
import Navbar,            { initNavbar }           from './components/Navbar.js';
import Hero                                        from './components/Hero.js';
import Marquee                                     from './components/Marquee.js';
import Results                                     from './components/Results.js';
import ContainerScroll,   { initContainerScroll }  from './components/ContainerScroll.js';
import TextReveal,        { initTextReveal }        from './components/TextReveal.js';
import Protocol                                    from './components/Protocol.js';
import LeadForm,          { initLeadForm }          from './components/LeadForm.js';
import Footer                                      from './components/Footer.js';
import Modals,            { initModals }            from './components/Modals.js';
import { initReveal }                              from './utils/reveal.js';
import { initSmoothScroll }                        from './utils/smoothScroll.js';
import { initCounters }                            from './utils/counter.js';
import { initMagnet }                              from './utils/magnet.js';
import { initScramble }                            from './utils/scramble.js';
import { initTransition }                          from './utils/transition.js';
import { initParallax }                            from './utils/parallax.js';
import { initSpotlight }                           from './utils/spotlight.js';

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${VideoBackground()}
    ${Navbar()}
    <main id="main-content" tabindex="-1">
      ${Hero()}
      ${Marquee()}
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
  initTransition(); // must be first — curtain covers page on load
  initSmoothScroll();
  initVideoBackground();
  initNavbar();
  initContainerScroll();
  initTextReveal();
  initLeadForm();
  initModals();

  // Scroll-reveal + counters must run last so all elements are in the DOM
  initReveal();
  initCounters();
  initScramble();
  initMagnet();
  initParallax();
  initSpotlight();
}

// Guard against DOMContentLoaded having already fired (Vite HMR)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
