import { CONFIG } from "./settings.js";

export default function InefficiencyCalculator() {
  return `
    <section id="calculator" class="py-24 bg-brand-dark relative overflow-hidden border-t border-brand-gray/30">
        <div class="max-w-4xl mx-auto px-6 relative z-10">
            
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                    The Cost of <span class="text-red-500">Doing Nothing</span>
                </h2>
                <p class="text-brand-gray-light text-lg">
                    Every hour you spend on manual tasks is revenue stolen from your growth.
                </p>
            </div>

            <div class="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm shadow-2xl">
                
                <div class="mb-12">
                    <label class="block text-white text-xl mb-4 font-display">
                        Hours spent manually copy-pasting, emailing, or organizing per week?
                    </label>
                    <input type="range" id="hoursInput" min="0" max="40" value="${CONFIG.DEFAULTS.AVG_MANUAL_HOURS}" 
                        class="w-full h-3 bg-brand-gray rounded-lg appearance-none cursor-pointer accent-brand-accent hover:accent-white transition-all">
                    <div class="flex justify-between text-brand-gray-light mt-2 text-sm">
                        <span>0 hrs</span>
                        <span id="hoursDisplay" class="text-brand-accent font-bold text-xl">${CONFIG.DEFAULTS.AVG_MANUAL_HOURS} hrs/week</span>
                        <span>40 hrs</span>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-8 items-center border-t border-white/10 pt-8">
                    <div>
                        <p class="text-gray-400 mb-2">Annual Revenue Wasted</p>
                        <div id="annualLoss" class="text-4xl md:text-5xl font-bold text-red-500 tracking-tight">
                            €39,000
                        </div>
                        <p class="text-xs text-gray-500 mt-2">*Calculated at avg opportunity cost of €50/hr</p>
                    </div>
                    
                    <div class="text-right">
                        <p class="text-gray-400 mb-2">Potential Automation Cost</p>
                        <div class="text-3xl font-bold text-brand-accent">
                            €2,500
                        </div>
                        <p class="text-xs text-gray-500 mt-2">One-time implementation fee</p>
                    </div>
                </div>

                <div class="mt-8 pt-6 border-t border-white/10 text-center">
                    <p id="roiText" class="text-white text-lg">
                        <span class="text-brand-accent font-bold">1,460% ROI</span> in the first year.
                    </p>
                </div>

            </div>
        </div>
    </section>
    `;
}

// Logic to make the numbers move
export function initCalculator() {
  const slider = document.getElementById("hoursInput");
  const display = document.getElementById("hoursDisplay");
  const lossDisplay = document.getElementById("annualLoss");
  const roiDisplay = document.getElementById("roiText");
  const RATE = CONFIG.DEFAULTS.HOURLY_RATE_EUR;
  const IMPLEMENTATION_COST = 2500;

  if (!slider) return;

  const update = () => {
    const hours = parseInt(slider.value);
    const annualLoss = hours * RATE * 52;

    // Update Text
    display.innerText = `${hours} hrs/week`;
    lossDisplay.innerText = `€${annualLoss.toLocaleString()}`;

    // Update ROI Logic
    if (annualLoss > IMPLEMENTATION_COST) {
      const roi = Math.round(
        ((annualLoss - IMPLEMENTATION_COST) / IMPLEMENTATION_COST) * 100,
      );
      roiDisplay.innerHTML = `<span class="text-brand-accent font-bold">${roi.toLocaleString()}% ROI</span> in the first year.`;
    } else {
      roiDisplay.innerHTML = `<span class="text-gray-500">Not enough volume for automation yet.</span>`;
    }
  };

  slider.addEventListener("input", update);
  update(); // Run once on load
}
