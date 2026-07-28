import { SYSTEMS, PROTOCOL } from '../data/systems.js';

/**
 * /systems — the long-form page. Everything trimmed off the landing page lives
 * here in full, one anchored block per system so the card links land directly
 * on the right entry.
 */

function systemBlock(item, i) {
  return `
    <article
      id="${item.slug}"
      class="systems-detail-row"
      data-reveal
      data-reveal-delay="${(i % 3) + 1}"
      aria-labelledby="detail-title-${item.slug}"
    >
      <div class="systems-detail-aside">
        <div
          class="systems-detail-icon"
          style="background:${item.bg}; color:${item.color};"
          aria-hidden="true"
        >${item.icon}</div>
        <span class="systems-detail-number" style="color:${item.color};" aria-hidden="true">${item.number}</span>
      </div>

      <div class="systems-detail-body">
        <div class="systems-detail-tier">${item.tier || 'The Protocol'}</div>
        <h3 id="detail-title-${item.slug}" class="systems-detail-title">${item.title}</h3>
        <p class="systems-detail-short">${item.short}</p>
        <p class="systems-detail-text">${item.body}</p>
      </div>
    </article>
  `;
}

export default function SystemsDetail() {
  const core = SYSTEMS.filter(s => s.tier === 'Evergreen Core');
  const full = SYSTEMS.filter(s => s.tier === 'Evergreen Full');

  return `
    <section class="pt-32 pb-20 md:pt-40" aria-labelledby="systems-detail-heading">
      <div class="max-w-5xl mx-auto px-6">
        <div class="max-w-2xl" data-reveal>
          <div class="badge mb-5">Every System, In Full</div>
          <h1
            id="systems-detail-heading"
            class="text-4xl md:text-5xl font-display font-bold text-ink-primary mb-6 leading-tight"
          >
            What each system actually does
          </h1>
          <p class="text-lg text-ink-secondary leading-relaxed">
            The short version is on the home page. This is the long one — what
            every system does, why it exists, and how the build runs from first
            call to handoff.
          </p>
        </div>
      </div>
    </section>

    <section class="pb-8" aria-labelledby="core-heading">
      <div class="max-w-5xl mx-auto px-6">
        <div class="systems-detail-grouphead" data-reveal>
          <h2 id="core-heading" class="systems-detail-groupname">Evergreen Core</h2>
          <span class="h-px flex-1 bg-ink-border"></span>
        </div>
        ${core.map(systemBlock).join('')}
      </div>
    </section>

    <section class="pb-8" aria-labelledby="full-heading">
      <div class="max-w-5xl mx-auto px-6">
        <div class="systems-detail-grouphead" data-reveal>
          <h2 id="full-heading" class="systems-detail-groupname">Evergreen Full</h2>
          <span class="text-xs font-medium text-accent uppercase tracking-widest">Core + Growth</span>
          <span class="h-px flex-1 bg-ink-border"></span>
        </div>
        ${full.map(systemBlock).join('')}
      </div>
    </section>

    <section
      id="protocol"
      class="py-20"
      style="background: var(--bg-card); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);"
      aria-labelledby="protocol-detail-heading"
    >
      <div class="max-w-5xl mx-auto px-6">
        <div class="max-w-xl mb-12" data-reveal>
          <div class="badge mb-5">Our Process</div>
          <h2
            id="protocol-detail-heading"
            class="text-3xl md:text-4xl font-display font-bold text-ink-primary mb-4"
          >
            How the build runs
          </h2>
          <p class="text-ink-secondary leading-relaxed">
            We don't do "consulting." We build and install the booking,
            follow-up, and payment infrastructure coaches need to stop losing
            clients to slow replies — without disrupting your day-to-day practice.
          </p>
        </div>
        ${PROTOCOL.map(systemBlock).join('')}
      </div>
    </section>

    <section class="py-24 text-center" aria-labelledby="systems-cta-heading">
      <div class="max-w-2xl mx-auto px-6" data-reveal>
        <h2
          id="systems-cta-heading"
          class="text-3xl md:text-4xl font-display font-bold text-ink-primary mb-5"
        >
          Not sure which system you need?
        </h2>
        <p class="text-ink-secondary leading-relaxed mb-8">
          The audit tells you which leak is costing you the most — before you
          commit to anything.
        </p>
        <a href="/#apply" class="btn btn-primary" data-magnet>
          Apply for a Free Audit
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  `;
}
