import Navbar from "./components/Navbar.js";
import Hero from "./components/Hero.js";
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
        ${Navbar()}
        <main>
            ${Hero()}
            ${InefficiencyCalculator()}
            ${Protocol()}
            ${Results()}
            ${AuditApplication()}
        </main>
        ${Footer()}
    `;

  // Initialize interactive components after render
  initCalculator();
  initAuditForm();
};

// Run
document.addEventListener("DOMContentLoaded", render);
