const STEPS = [
  {
    number: '01',
    title: 'Diagnostic Audit',
    body: 'We map your entire workflow to pinpoint the highest-value automation opportunity — the one manual process costing you the most time and revenue. You receive a prioritised roadmap, not a generic report.',
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/>
        <path d="M20 20l-3-3"/>
        <path d="M8 11h6M11 8v6"/>
      </svg>
    `,
  },
  {
    number: '02',
    title: 'Architecture & Build',
    body: 'We design and build your automation using enterprise-grade tools — n8n, OpenAI, Google Apps Script, and more. Everything is tested in a sandbox so your live business is never at risk during rollout.',
    color: '#22d3ee',
    bg: 'rgba(34, 211, 238, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    `,
  },
  {
    number: '03',
    title: 'Deployment & Handoff',
    body: 'We go live, train your team on the new system, and provide 30 days of active monitoring. You walk away with a running automation and the knowledge to manage it — no dependency on us required.',
    color: '#86efac',
    bg: 'rgba(134, 239, 172, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    `,
  },
];

export default function Protocol() {
  const cards = STEPS.map(
    (step, i) => `
      <article
        class="card p-8 relative overflow-hidden"
        data-reveal
        data-reveal-delay="${i + 1}"
        aria-labelledby="step-title-${i}"
      >
        <!-- Step number watermark -->
        <span
          class="absolute top-4 right-6 font-display font-black text-7xl leading-none select-none pointer-events-none"
          style="color: ${step.color}; opacity: 0.06;"
          aria-hidden="true"
        >${step.number}</span>

        <!-- Icon -->
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
          style="background: ${step.bg}; color: ${step.color};"
        >
          ${step.icon}
        </div>

        <!-- Content -->
        <h3
          id="step-title-${i}"
          class="text-lg font-display font-bold text-ink-primary mb-3"
        >
          ${step.title}
        </h3>
        <p class="text-sm text-ink-secondary leading-relaxed">
          ${step.body}
        </p>
      </article>
    `
  ).join('');

  return `
    <section
      id="protocol"
      class="py-24"
      style="background: var(--bg-card); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);"
      aria-labelledby="protocol-heading"
    >
      <div class="max-w-7xl mx-auto px-6">

        <div class="max-w-lg mb-14" data-reveal>
          <div class="badge mb-5">Our Process</div>
          <h2
            id="protocol-heading"
            class="text-3xl md:text-4xl font-display font-bold text-ink-primary mb-4"
          >
            The Deployment Protocol
          </h2>
          <p class="text-ink-secondary leading-relaxed">
            We don't do "consulting." We build and install automation
            infrastructure. Our three-step protocol ensures rapid ROI
            without disrupting your day-to-day operations.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6" role="list">
          ${cards}
        </div>
      </div>
    </section>
  `;
}
