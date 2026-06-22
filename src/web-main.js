import './main.css';

import ShaderBackground, { initShaderBackground } from './components/ShaderBackground.js';
import Cursor,            { initCursor }           from './components/Cursor.js';
import Navbar,            { initNavbar }           from './components/Navbar.js';
import Footer                                      from './components/Footer.js';
import Modals,            { initModals }            from './components/Modals.js';
import WebPricing,        { initWebPricing }        from './components/WebPricing.js';
import { initReveal }                              from './utils/reveal.js';
import { initSmoothScroll }                        from './utils/smoothScroll.js';
import { initCounters }                            from './utils/counter.js';

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Cursor()}
    ${ShaderBackground()}
    ${Navbar()}
    <main id="main-content" tabindex="-1">
      ${WebPricing()}
    </main>
    ${Footer()}
    ${Modals()}
  `;

  initSmoothScroll();
  initCursor();
  initShaderBackground();
  initNavbar();
  initWebPricing();
  initModals();
  initReveal();
  initCounters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
