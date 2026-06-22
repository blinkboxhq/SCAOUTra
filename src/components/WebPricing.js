/**
 * WebPricing — Web design services pricing page component.
 * Follows the same pattern as other Scoutra components:
 * a default export returning an HTML string, plus an init* export for JS.
 */

const TRUST_ITEMS = [
  'Live preview before you pay',
  'We write all your copy',
  'GDPR compliant — EU built',
  'Satisfaction guarantee',
  'You own everything — no lock-in',
];

const PLANS = [
  {
    id: 'launchpad',
    tier: 'Starter',
    name: 'The Launchpad',
    desc: 'For businesses that need to show up online and look credible — fast.',
    price: '500',
    priceNote: 'One-time payment',
    valueBadge: '€1,200 value — launch price',
    valueBadgeMod: 'gray',
    delivery: 'Live in 5 days',
    popular: false,
    elite: false,
    featuresHeader: 'What you get',
    features: [
      'Up to 5 pages (Home, About, Services, Contact + 1)',
      'We write all your copy — answer 10 questions, we do the rest',
      'Mobile-first, fully responsive on every device',
      'Contact form + WhatsApp enquiry button',
      'Google SEO setup — indexed within 2 weeks',
      '90+ PageSpeed score — fast loading',
      'Deployed to your domain — we handle it',
      '2 revision rounds',
      '30-day WhatsApp support after launch',
    ],
    notIncluded: [
      'Scroll animations & cinematic effects',
      'AI chatbot or booking system',
      'Blog or portfolio',
    ],
    ctaText: 'Get started',
    ctaNote: 'Free 20-min discovery call first.<br>No payment until you see a preview.',
  },
  {
    id: 'authority',
    tier: 'Growth',
    name: 'The Authority Site',
    desc: 'A cinematic site that makes you look like the market leader — with automation built in.',
    price: '1,200',
    priceNote: 'One-time payment',
    valueBadge: '€2,800 value — launch price',
    valueBadgeMod: 'green',
    delivery: 'Live in 10 days',
    popular: true,
    elite: false,
    featuresHeader: 'Everything in Starter, plus',
    features: [
      'Up to 8 pages including blog or portfolio',
      'Cinematic hero with GSAP scroll animations',
      'Glass card design — premium, modern feel',
      'AI chatbot — answers FAQs + captures leads 24/7',
      'Online booking system (Cal.com) integrated',
      'Custom brand identity applied throughout',
      'Google Analytics + Search Console setup',
      'Schema markup — rich results in Google',
      '3 revision rounds + priority response',
      '60-day WhatsApp support after launch',
      'Monthly performance report (first 2 months)',
    ],
    notIncluded: [],
    ctaText: 'Get started',
    ctaNote: 'Free 30-min strategy call included.<br>Most clients choose this tier.',
  },
  {
    id: 'growth',
    tier: 'Premium',
    name: 'The Growth Machine',
    desc: 'Your website becomes a full sales system. Leads captured, qualified, and followed up — automatically.',
    price: '2,500',
    priceNote: 'One-time payment',
    valueBadge: '€5,500 value — launch price',
    valueBadgeMod: 'gray',
    delivery: 'Live in 21 days',
    popular: false,
    elite: false,
    featuresHeader: 'Everything in Authority, plus',
    features: [
      'Unlimited pages + custom CMS (update it yourself)',
      '3D / WebGL hero element — truly cinematic',
      'AI lead qualification — bot scores leads before you see them',
      'Automated follow-up email sequence (3 emails, written for you)',
      'CRM sync — every lead auto-logged in Notion or Airtable',
      'Multi-language support (EN + your language)',
      'Dedicated Slack channel during build',
      'Unlimited revisions during build phase',
      '90-day post-launch support + 1 monthly check-in call',
      'Optional €200/mo retainer for ongoing updates',
    ],
    notIncluded: [],
    ctaText: 'Get started',
    ctaNote: 'Free 45-min deep-dive call.<br>For businesses serious about growth.',
  },
  {
    id: 'flagship',
    tier: 'Elite',
    name: 'The Flagship',
    desc: 'A bespoke digital flagship. One-of-a-kind. Built for brands that demand Awwwards-level craft.',
    price: '6,000',
    priceNote: 'Starting price — scoped per project',
    valueBadge: '€14,000+ agency equivalent',
    valueBadgeMod: 'amber',
    delivery: '30–60 day delivery',
    popular: false,
    elite: true,
    featuresHeader: 'Everything in Growth Machine, plus',
    features: [
      'Full custom design system — tokens, components, brand guidelines delivered',
      'GSAP + Three.js — cinematic 3D hero, scroll-storytelling, particle effects',
      'Custom cursor + magnetic button interactions',
      'Page transitions — no jarring reloads, ever',
      'Awwwards-caliber visual direction + motion brief',
      'Core Web Vitals target: 95+ across all metrics',
      'Full n8n automation stack — lead flow, CRM, email, Slack alerts',
      'Heatmap + funnel tracking (Clarity or Hotjar)',
      '6-month post-launch support + bi-weekly performance call',
      'Figma source files delivered — you own the design forever',
      "Priority access to Scoutra's AI automation team",
    ],
    notIncluded: [],
    ctaText: 'Apply for Black Label',
    ctaNote: 'Only 2 projects accepted per quarter.<br>Application required — not every business qualifies.',
  },
];

const COMPARE_ROWS = [
  { feature: 'Pages', values: ['Up to 5', 'Up to 8', 'Unlimited', 'Unlimited'] },
  { feature: 'Copy written for you', values: [true, true, true, true] },
  { feature: 'Mobile responsive', values: [true, true, true, true] },
  { feature: '90+ PageSpeed score', values: [true, true, true, '95+ target'] },
  { feature: 'GSAP scroll animations', values: [false, true, true, true] },
  { feature: '3D / WebGL hero', values: [false, false, true, true] },
  { feature: 'AI chatbot (lead capture)', values: [false, true, true, true] },
  { feature: 'Booking system', values: [false, true, true, true] },
  { feature: 'Automated follow-up emails', values: [false, false, true, true] },
  { feature: 'CRM sync', values: [false, false, true, true] },
  { feature: 'Custom design system', values: [false, false, false, true] },
  { feature: 'Full n8n automation stack', values: [false, false, false, true] },
  { feature: 'Custom cursor + interactions', values: [false, false, false, true] },
  { feature: 'Figma source files', values: [false, false, false, true] },
  { feature: 'Post-launch support', values: ['30 days', '60 days', '90 days', '6 months'] },
  { feature: 'Delivery time', values: ['5 days', '10 days', '21 days', '30–60 days'] },
  { feature: 'Revision rounds', values: ['2', '3', 'Unlimited', 'Unlimited'] },
];

const ALWAYS_ITEMS = [
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M6 8l1.5 1.5L10 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'We write your copy',
    desc: 'Answer 10 questions. We write every word on your site.',
  },
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1l1.5 3 3.5.5-2.5 2.5.5 3.5L8 9 5 10.5l.5-3.5L3 4.5 6.5 4 8 1z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    title: 'We handle deployment',
    desc: 'Domain, hosting setup — all done for you.',
  },
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1L2 4v5c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6V4L8 1z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'GDPR compliant',
    desc: 'Built to EU standards from day one.',
  },
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1" stroke="currentColor" stroke-width="1.4"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    title: 'You own everything',
    desc: 'Code, domain, hosting — no lock-in, ever.',
  },
];

const PROCESS_STEPS = [
  {
    day: 'Day 1',
    title: 'Discovery call',
    desc: 'We understand your business, audience, and the one thing your site must achieve. You fill a short brief after.',
  },
  {
    day: 'Day 1–2',
    title: 'Copy & structure',
    desc: 'We write all your copy and map the site structure. You review and approve before anything is built.',
  },
  {
    day: 'Day 2–4',
    title: 'Design & build',
    desc: "We build your site. You don't see chaos — you see a polished preview when it's ready, not before.",
  },
  {
    day: 'Day 4–5',
    title: 'Review & refine',
    desc: 'Live preview link. You give feedback. We refine. This is where trust is built — and where most clients are surprised.',
  },
  {
    day: 'Day 5+',
    title: 'Launch & handoff',
    desc: 'We deploy to your domain, walk you through everything, and ask for two referrals from happy clients.',
  },
];

function checkSvg() {
  return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style="flex-shrink:0;margin-top:2px"><circle cx="7" cy="7" r="6" stroke="#4ade80" stroke-width="1.4"/><path d="M4.5 7l2 2 3-3" stroke="#4ade80" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function minusSvg() {
  return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style="flex-shrink:0;margin-top:2px"><circle cx="7" cy="7" r="6" stroke="#52525b" stroke-width="1.4"/><line x1="4.5" y1="7" x2="9.5" y2="7" stroke="#52525b" stroke-width="1.4" stroke-linecap="round"/></svg>`;
}

function renderTableCell(value) {
  if (value === true) {
    return `<td class="wp-td wp-td-center"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Yes" style="display:inline-block"><circle cx="7" cy="7" r="6" stroke="#4ade80" stroke-width="1.4"/><path d="M4.5 7l2 2 3-3" stroke="#4ade80" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></td>`;
  }
  if (value === false) {
    return `<td class="wp-td wp-td-center" aria-label="No"><span class="wp-td-dash">—</span></td>`;
  }
  return `<td class="wp-td wp-td-center wp-td-text">${value}</td>`;
}

function renderCard(plan, index) {
  const borderStyle = plan.popular
    ? 'border-color: var(--accent); border-width: 2px;'
    : plan.elite
    ? 'border-color: #854F0B; border-width: 2px;'
    : '';

  const ctaClass = plan.popular
    ? 'btn btn-primary w-full'
    : plan.elite
    ? 'btn w-full wp-btn-elite'
    : 'btn btn-secondary w-full';

  const topBadge = plan.popular
    ? `<div class="wp-popular-badge">Most popular</div>`
    : plan.elite
    ? `<div class="wp-elite-badge">Black Label — by application</div>`
    : '';

  const valueBadgeClass = `wp-value-badge wp-value-badge--${plan.valueBadgeMod}`;

  const featuresHtml = plan.features.map(f => `
    <li>${checkSvg()}${f}</li>
  `).join('');

  const notIncludedHtml = plan.notIncluded.length ? `
    <ul class="wp-feat-list wp-feat-list--not" aria-label="Not included in this plan">
      ${plan.notIncluded.map(f => `<li>${minusSvg()}<span>${f}</span></li>`).join('')}
    </ul>
  ` : '';

  return `
    <article
      class="wp-card card"
      style="${borderStyle}"
      aria-labelledby="plan-name-${plan.id}"
      data-reveal
      data-reveal-delay="${index + 1}"
    >
      ${topBadge}
      <p class="wp-tier-label">${plan.tier}</p>
      <h3 class="wp-card-name" id="plan-name-${plan.id}">${plan.name}</h3>
      <p class="wp-card-desc">${plan.desc}</p>

      <div class="wp-price-row" aria-label="Price: €${plan.price}">
        <span class="wp-currency" aria-hidden="true">€</span>
        <span class="wp-price">${plan.price}</span>
      </div>
      <p class="wp-price-note">${plan.priceNote}</p>
      <div class="${valueBadgeClass}">${plan.valueBadge}</div>

      <div class="wp-delivery-row">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5.5" stroke="var(--accent)" stroke-width="1.3"/>
          <path d="M6.5 3.5V7l2 1.5" stroke="var(--accent)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${plan.delivery}
      </div>

      <hr class="wp-divider" aria-hidden="true">

      <p class="wp-feat-label">${plan.featuresHeader}</p>
      <ul class="wp-feat-list" aria-label="Features included in ${plan.name}">
        ${featuresHtml}
      </ul>
      ${notIncludedHtml}

      <hr class="wp-divider" aria-hidden="true">

      <a href="/#apply" class="${ctaClass}">
        ${plan.ctaText}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <p class="wp-cta-note">${plan.ctaNote}</p>
    </article>
  `;
}

export default function WebPricing() {
  const trustBarHtml = TRUST_ITEMS.map(item => `
    <div class="wp-trust-item">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5" stroke="var(--accent)" stroke-width="1.3"/>
        <path d="M3.5 6l2 2 3-3" stroke="var(--accent)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      ${item}
    </div>
  `).join('');

  const cardsHtml = PLANS.map((plan, i) => renderCard(plan, i)).join('');

  const compareRowsHtml = COMPARE_ROWS.map(row => `
    <tr>
      <td class="wp-td wp-td-feat">${row.feature}</td>
      ${row.values.map(v => renderTableCell(v)).join('')}
    </tr>
  `).join('');

  const alwaysItemsHtml = ALWAYS_ITEMS.map(item => `
    <div>
      <div class="wp-always-item-title">
        <span class="wp-always-icon" aria-hidden="true">${item.icon}</span>
        ${item.title}
      </div>
      <p class="wp-always-item-desc">${item.desc}</p>
    </div>
  `).join('');

  const processHtml = PROCESS_STEPS.map((step, i) => `
    <div class="wp-process-card" data-reveal data-reveal-delay="${i + 1}">
      <p class="wp-process-day">${step.day}</p>
      <h3 class="wp-process-title">${step.title}</h3>
      <p class="wp-process-desc">${step.desc}</p>
    </div>
  `).join('');

  return `
    <!-- ── Hero ──────────────────────────────────────────────── -->
    <section
      id="web-hero"
      class="relative pt-36 pb-20 md:pt-52 md:pb-24 flex flex-col items-center text-center px-6 overflow-hidden"
      aria-labelledby="web-pricing-heading"
    >
      <div class="hero-orb hero-orb-1" aria-hidden="true"></div>
      <div class="hero-orb hero-orb-2" aria-hidden="true"></div>

      <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

        <div class="badge mb-8" data-reveal>
          <span class="badge__dot" aria-hidden="true"></span>
          Scoutra · Web Design Service
        </div>

        <h1
          id="web-pricing-heading"
          class="text-[2.5rem] sm:text-5xl md:text-[3.75rem] font-display font-extrabold text-ink-primary mb-5 leading-[1.08]"
          data-reveal
          data-reveal-delay="1"
        >
          Websites that make your business
          <span class="block" style="color: var(--accent); font-style: italic;">impossible to ignore</span>
        </h1>

        <p
          class="text-lg md:text-xl text-ink-secondary mb-10 max-w-xl leading-relaxed"
          data-reveal
          data-reveal-delay="2"
        >
          Cinematic design. Built with AI precision. Delivered in days — not months.
          Every site is engineered to turn visitors into enquiries.
        </p>

        <div class="wp-trust-bar" data-reveal data-reveal-delay="3" aria-label="Trust signals">
          ${trustBarHtml}
        </div>
      </div>
    </section>

    <!-- ── Stats block ────────────────────────────────────────── -->
    <section class="px-6 pb-20" aria-label="Why a bad website costs you">
      <div class="max-w-7xl mx-auto">
        <div class="wp-stats" data-reveal>
          <div class="text-center">
            <div class="wp-stat-num" aria-label="€4,200 per month">€4,200</div>
            <p class="wp-stat-label">Average lost revenue from low-converting sites per month</p>
          </div>
          <div class="text-center">
            <div class="wp-stat-num" aria-label="7 seconds">7 sec</div>
            <p class="wp-stat-label">Time a visitor decides whether to stay or leave forever</p>
          </div>
          <div class="text-center">
            <div class="wp-stat-num" aria-label="3.8 times">3.8×</div>
            <p class="wp-stat-label">More leads from conversion-engineered sites vs template builds</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Pricing cards ──────────────────────────────────────── -->
    <section
      id="web-pricing"
      class="px-6 pb-16"
      aria-labelledby="pricing-cards-heading"
    >
      <div class="max-w-7xl mx-auto">
        <p class="wp-section-label" id="pricing-cards-heading">Choose your tier</p>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          ${cardsHtml}
        </div>
      </div>
    </section>

    <!-- ── Comparison table ───────────────────────────────────── -->
    <section class="px-6 pb-20" aria-labelledby="compare-heading">
      <div class="max-w-7xl mx-auto">
        <p class="wp-section-label" id="compare-heading">Full comparison</p>
        <div class="wp-compare-wrap">
          <table class="wp-compare-table" aria-label="Plan feature comparison">
            <thead>
              <tr>
                <th class="wp-th" scope="col">Feature</th>
                <th class="wp-th wp-th-center" scope="col">
                  <div>Launchpad</div>
                  <div class="wp-th-price">€500</div>
                </th>
                <th class="wp-th wp-th-center" scope="col">
                  <div>Authority Site</div>
                  <div class="wp-th-price">€1,200</div>
                </th>
                <th class="wp-th wp-th-center" scope="col">
                  <div>Growth Machine</div>
                  <div class="wp-th-price">€2,500</div>
                </th>
                <th class="wp-th wp-th-center" scope="col">
                  <div>The Flagship</div>
                  <div class="wp-th-price">€6,000+</div>
                </th>
              </tr>
            </thead>
            <tbody>
              ${compareRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ── Always included ────────────────────────────────────── -->
    <section class="px-6 pb-16" aria-labelledby="always-heading">
      <div class="max-w-7xl mx-auto">
        <div class="wp-always-box" data-reveal>
          <p class="wp-always-title" id="always-heading">Always included — on every plan</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            ${alwaysItemsHtml}
          </div>
        </div>
      </div>
    </section>

    <!-- ── Guarantee box ──────────────────────────────────────── -->
    <section class="px-6 pb-16" aria-labelledby="guarantee-heading">
      <div class="max-w-7xl mx-auto">
        <div class="wp-guarantee-box" data-reveal>
          <div class="wp-guarantee-header">
            <div class="wp-guarantee-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L4 6.5v8c0 6.5 4.5 10.5 10 12 5.5-1.5 10-5.5 10-12v-8L14 2z" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 14l3.5 3.5 6.5-7" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="wp-guarantee-title" id="guarantee-heading">The preview guarantee — on every plan</h2>
          </div>
          <p class="wp-guarantee-text">
            You see a live preview before you pay a single euro beyond the deposit. If you don't love what you see at first preview, I refund your deposit in full — no questions, no awkwardness. You keep the strategy call and any copy we wrote. I take that risk so you don't have to.
          </p>
        </div>
      </div>
    </section>

    <!-- ── Process steps ──────────────────────────────────────── -->
    <section class="px-6 pb-28" aria-labelledby="process-heading">
      <div class="max-w-7xl mx-auto">
        <p class="wp-section-label" id="process-heading">How every project runs</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          ${processHtml}
        </div>
      </div>
    </section>
  `;
}

export function initWebPricing() {
  // No interactive JS needed currently — scroll reveal is handled by initReveal()
}
