/**
 * Pricing — project-based pricing section with monthly/yearly toggle.
 * Translated from the PricingSection6 React component.
 * No framer-motion or NumberFlow — uses plain DOM + CSS transitions.
 */

const PLANS = [
  {
    name: 'Starter',
    description:
      'Ideal for businesses ready to identify and eliminate their #1 manual bottleneck.',
    monthly: 997,
    yearly: 797,
    cta: 'Apply Now',
    ctaLink: '#apply',
    popular: false,
    featuresHeader: 'Includes:',
    features: [
      'Full workflow diagnostic',
      '1 automation build',
      '30-day active monitoring',
      'Handoff & team training',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    description:
      'For scaling businesses that need multiple automation flows and ongoing strategy.',
    monthly: 2497,
    yearly: 1997,
    cta: 'Apply Now',
    ctaLink: '#apply',
    popular: true,
    featuresHeader: 'Everything in Starter, plus:',
    features: [
      'Up to 3 automation builds',
      'Priority support channel',
      'Monthly strategy calls',
      'Custom API integrations',
      'Dashboard & reporting setup',
    ],
  },
  {
    name: 'Enterprise',
    description:
      'Full-stack automation infrastructure for complex, high-volume operations.',
    monthly: null,
    yearly: null,
    cta: 'Contact Us',
    ctaLink: '#apply',
    popular: false,
    featuresHeader: 'Everything in Growth, plus:',
    features: [
      'Unlimited automation builds',
      'Dedicated automation engineer',
      'SLA guarantee',
      'Custom dashboards',
      'On-site training available',
    ],
  },
];

function featureList(features) {
  return features.map(f => `
    <li class="pricing-feature-item">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="6" stroke="#818cf8" stroke-width="1.4"/>
        <path d="M4.5 7l2 2 3-3" stroke="#818cf8" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      ${f}
    </li>
  `).join('');
}

function priceBlock(plan) {
  if (plan.monthly === null) {
    return `<span class="pricing-amount-custom">Custom</span>`;
  }
  return `
    <span class="pricing-currency">$</span>
    <span
      class="pricing-amount"
      data-monthly="${plan.monthly}"
      data-yearly="${plan.yearly}"
    >${plan.monthly.toLocaleString()}</span>
    <span class="pricing-period">/project</span>
  `;
}

export default function Pricing() {
  const cards = PLANS.map((plan, i) => `
    <div
      class="pricing-card${plan.popular ? ' pricing-card--popular' : ''}"
      data-reveal
      data-reveal-delay="${i + 1}"
    >
      ${plan.popular ? '<div class="pricing-popular-badge">Most Popular</div>' : ''}

      <div class="pricing-card-header">
        <h3 class="pricing-name">${plan.name}</h3>
        <div class="pricing-price">${priceBlock(plan)}</div>
        <p class="pricing-description">${plan.description}</p>
      </div>

      <div class="pricing-card-body">
        <a
          href="${plan.ctaLink}"
          class="btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} w-full"
          style="margin-bottom: 20px;"
        >${plan.cta}</a>

        <div class="pricing-features">
          <p class="pricing-features-header">${plan.featuresHeader}</p>
          <ul class="pricing-features-list">
            ${featureList(plan.features)}
          </ul>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <section
      id="pricing"
      class="py-28 px-6 relative overflow-hidden"
      style="background: var(--bg-base); border-top: 1px solid var(--border-subtle);"
      aria-labelledby="pricing-heading"
    >
      <!-- Background glow -->
      <div class="pricing-bg-glow" aria-hidden="true"></div>

      <div class="max-w-5xl mx-auto relative" style="z-index: 1;">

        <!-- Header -->
        <div class="text-center mb-14" data-reveal>
          <div class="badge mx-auto mb-5">Transparent Pricing</div>
          <h2
            id="pricing-heading"
            class="text-3xl md:text-5xl font-display font-bold text-ink-primary mb-5 leading-tight"
          >
            Simple, Project-Based
            <span
              class="text-transparent bg-clip-text block"
              style="background-image: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%);"
            >
              Pricing
            </span>
          </h2>
          <p class="text-ink-secondary text-lg max-w-xl mx-auto mb-8">
            No retainers. No hidden fees. You pay once, get the automation, and own it forever.
          </p>

          <!-- Toggle -->
          <div class="pricing-toggle" role="group" aria-label="Billing period">
            <button
              id="toggle-monthly"
              class="pricing-toggle-btn is-active"
              data-period="monthly"
              aria-pressed="true"
            >Monthly</button>
            <button
              id="toggle-yearly"
              class="pricing-toggle-btn"
              data-period="yearly"
              aria-pressed="false"
            >
              Yearly
              <span class="pricing-save-badge">Save 20%</span>
            </button>
          </div>
        </div>

        <!-- Cards grid -->
        <div class="grid md:grid-cols-3 gap-5">
          ${cards}
        </div>

        <!-- Footer note -->
        <p class="text-center text-sm text-ink-muted mt-10" data-reveal>
          All projects include a 30-day satisfaction guarantee. Not sure which plan fits?
          <a href="#apply" class="text-accent hover:text-accent-hover underline underline-offset-2">
            Apply for a free consultation
          </a>.
        </p>

      </div>
    </section>
  `;
}

export function initPricing() {
  const monthlyBtn = document.getElementById('toggle-monthly');
  const yearlyBtn  = document.getElementById('toggle-yearly');
  if (!monthlyBtn || !yearlyBtn) return;

  let isYearly = false;

  function updatePrices() {
    document.querySelectorAll('.pricing-amount[data-monthly]').forEach(el => {
      const val = isYearly
        ? parseInt(el.dataset.yearly, 10)
        : parseInt(el.dataset.monthly, 10);
      el.textContent = val.toLocaleString();
    });
  }

  function setActive(btn, other) {
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');
    other.classList.remove('is-active');
    other.setAttribute('aria-pressed', 'false');
  }

  monthlyBtn.addEventListener('click', () => {
    isYearly = false;
    setActive(monthlyBtn, yearlyBtn);
    updatePrices();
  });

  yearlyBtn.addEventListener('click', () => {
    isYearly = true;
    setActive(yearlyBtn, monthlyBtn);
    updatePrices();
  });
}
