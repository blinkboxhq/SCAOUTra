import Navbar from "./components/Navbar.js";
import Hero from "./components/Hero.js";
import StarBackground, { initStars } from "./components/starBackground.js"; // Import Stars
import InefficiencyCalculator, {
  initCalculator,
} from "./components/InefficiencyCalculator.js";
import Protocol from "./components/Protocol.js";
import Results from "./components/Results.js";
import AuditApplication, {
  initAuditForm,
} from "./components/AuditApplication.js";
import Footer from "./components/Footer.js";

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
