import { CONFIG } from '../settings.js';

export default function Calculator() {
  const defaultHours = CONFIG.DEFAULTS.AVG_MANUAL_HOURS;
  const defaultAnnual = defaultHours * CONFIG.DEFAULTS.HOURLY_RATE_EUR * 52;
  const defaultFill = (defaultHours / 40) * 100;

  return `
    <section
      id="calculator"
      class="py-24 px-6"
      aria-labelledby="calc-heading"
    >
      <div class="max-w-2xl mx-auto">

        <div class="text-center mb-12" data-reveal>
          <div class="badge mx-auto mb-6">ROI Calculator</div>
          <h2
            id="calc-heading"
            class="text-3xl md:text-4xl font-display font-bold text-ink-primary mb-4"
          >
            Discover Your Growth Potential
          </h2>
          <p class="text-ink-secondary">
            See the annual time value you could reclaim by automating
            your most repetitive workflows.
          </p>
        </div>

        <div
          class="card p-8 md:p-10"
          data-reveal
          data-reveal-delay="1"
        >
          <!-- Slider group -->
          <div
            class="mb-10"
            role="group"
            aria-labelledby="slider-label"
          >
            <div class="flex justify-between items-baseline mb-5">
              <label
                id="slider-label"
                for="hours-slider"
                class="text-base font-semibold text-ink-primary"
              >
                Hours spent on manual work each week
              </label>
              <output
                id="hours-display"
                for="hours-slider"
                class="text-2xl font-display font-bold"
                style="color: var(--accent);"
                aria-live="polite"
                aria-atomic="true"
              >${defaultHours} hrs</output>
            </div>

            <input
              type="range"
              id="hours-slider"
              class="slider"
              min="0"
              max="40"
              step="1"
              value="${defaultHours}"
              aria-valuemin="0"
              aria-valuemax="40"
              aria-valuenow="${defaultHours}"
              aria-valuetext="${defaultHours} hours per week"
              style="--fill: ${defaultFill}%;"
            />

            <div class="flex justify-between text-xs text-ink-muted mt-2.5 select-none" aria-hidden="true">
              <span>0 hrs</span>
              <span>20 hrs</span>
              <span>40 hrs</span>
            </div>
          </div>

          <!-- Result panel -->
          <div
            class="rounded-xl p-6 md:p-8"
            style="background: var(--bg-elevated); border: 1px solid var(--border-subtle);"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Calculator results"
          >
            <div class="grid sm:grid-cols-2 gap-6">
              <!-- Primary result -->
              <div>
                <p class="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">
                  Annual time value recoverable
                </p>
                <div
                  id="annual-value"
                  class="text-4xl font-display font-extrabold tracking-tight"
                  style="color: var(--accent);"
                >
                  €${defaultAnnual.toLocaleString()}
                </div>
                <p class="text-xs text-ink-muted mt-2">
                  Based on €${CONFIG.DEFAULTS.HOURLY_RATE_EUR}/hr opportunity cost
                </p>
              </div>

              <!-- Secondary result -->
              <div class="sm:text-right">
                <p class="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">
                  Projected Year 1 ROI
                </p>
                <div
                  id="roi-value"
                  class="text-2xl font-display font-bold text-ink-primary"
                >
                  —
                </div>
                <p class="text-xs text-ink-muted mt-2">
                  vs. one-time implementation fee
                </p>
              </div>
            </div>

            <!-- ROI context message -->
            <p
              id="roi-message"
              class="mt-5 pt-5 text-sm text-ink-secondary leading-relaxed"
              style="border-top: 1px solid var(--border-subtle);"
            ></p>
          </div>

          <!-- CTA -->
          <div class="mt-8 text-center">
            <a href="#apply" class="btn btn-primary">
              Claim This Value — Apply for a Free Audit
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initCalculator() {
  const slider = document.getElementById('hours-slider');
  const hoursDisplay = document.getElementById('hours-display');
  const annualDisplay = document.getElementById('annual-value');
  const roiDisplay = document.getElementById('roi-value');
  const roiMessage = document.getElementById('roi-message');

  if (!slider) return;

  const RATE = CONFIG.DEFAULTS.HOURLY_RATE_EUR;
  const IMPL_COST = 2500;

  function update() {
    const hours = parseInt(slider.value, 10);
    const annualValue = hours * RATE * 52;
    const fillPct = (hours / 40) * 100;

    // Update slider fill
    slider.style.setProperty('--fill', `${fillPct}%`);

    // Update ARIA
    slider.setAttribute('aria-valuenow', hours);
    slider.setAttribute('aria-valuetext', `${hours} hours per week`);

    // Update display
    hoursDisplay.textContent = `${hours} hrs`;
    annualDisplay.textContent = `€${annualValue.toLocaleString()}`;

    if (hours === 0) {
      roiDisplay.textContent = '—';
      roiMessage.textContent = 'Move the slider to see your potential value recovery.';
      return;
    }

    if (annualValue <= IMPL_COST) {
      roiDisplay.textContent = 'Low volume';
      roiMessage.textContent =
        'At this volume, manual processes may still be manageable. As your business grows, automation becomes significantly more valuable.';
      return;
    }

    const roi = Math.round(((annualValue - IMPL_COST) / IMPL_COST) * 100);
    roiDisplay.textContent = `${roi.toLocaleString()}%`;
    roiMessage.textContent = `For every €1 invested in automation, you recover €${(roi / 100 + 1).toFixed(1)} in the first year alone — not counting the compounding gains in years two and three.`;
  }

  slider.addEventListener('input', update);
  update();
}
