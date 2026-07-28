import { PROTOCOL } from '../data/systems.js';

/**
 * Landing-page process section — one line per step.
 * The full description of each step lives on /systems.
 */
export default function Protocol() {
  const cards = PROTOCOL.map(
    (step, i) => `
      <article
        class="card p-8 relative overflow-hidden"
        data-reveal
        data-reveal-delay="${i + 1}"
        aria-labelledby="step-title-${i}"
      >
        <span
          class="absolute top-4 right-6 font-display font-black text-7xl leading-none select-none pointer-events-none"
          style="color: ${step.color}; opacity: 0.06;"
          aria-hidden="true"
        >${step.number}</span>

        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
          style="background: ${step.bg}; color: ${step.color};"
        >
          ${step.icon}
        </div>

        <h3
          id="step-title-${i}"
          class="text-lg font-display font-bold text-ink-primary mb-3"
        >
          ${step.title}
        </h3>
        <p class="text-sm text-ink-secondary leading-relaxed">
          ${step.short}
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
            Three steps, no consulting theatre. We build and install the
            infrastructure — you keep running your practice.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6" role="list">
          ${cards}
        </div>

        <div class="mt-12" data-reveal>
          <a href="/systems#protocol" class="text-sm font-medium text-accent hover:underline">
            What happens in each step &rarr;
          </a>
        </div>
      </div>
    </section>
  `;
}
