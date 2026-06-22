import './main.css';

import ShaderBackground, { initShaderBackground } from './components/ShaderBackground.js';
import Navbar,            { initNavbar }           from './components/Navbar.js';
import Footer                                      from './components/Footer.js';
import Modals,            { initModals }            from './components/Modals.js';
import WebPricing,        { initWebPricing }        from './components/WebPricing.js';
import { initReveal }                              from './utils/reveal.js';

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${ShaderBackground()}
    ${Navbar()}
    <main id="main-content" tabindex="-1">
      ${WebPricing()}
    </main>
    ${Footer()}
    ${Modals()}
  `;

  initShaderBackground();
  initNavbar();
  initWebPricing();
  initModals();
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
