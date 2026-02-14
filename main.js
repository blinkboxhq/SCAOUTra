import Navbar from "Navbar.js";
import Hero from "Hero.js";
import StarBackground, { initStars } from "starBackground.js"; // Import Stars
import InefficiencyCalculator, {
  initCalculator,
} from "InefficiencyCalculator.js";
import Protocol from "Protocol.js";
import Results from "Results.js";
import AuditApplication, {
  initAuditForm,
} from "AuditApplication.js";
import Footer from "Footer.js";

const app = document.getElementById("app");

const render = () => {
  app.innerHTML = `
        ${StarBackground()}  ${Navbar()}
        <main class="relative z-10"> ${Hero()}
            ${InefficiencyCalculator()}
            ${Protocol()}
            ${Results()}
            ${AuditApplication()}
        </main>
        ${Footer()}
    `;

  // Initialize everything
  initStars(); // Start the animation
  initCalculator();
  initAuditForm();
};

document.addEventListener("DOMContentLoaded", render);
