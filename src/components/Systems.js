import MagicBento from './MagicBento.js';
import { SYSTEMS } from '../data/systems.js';

/**
 * Landing-page Systems section.
 *
 * Deliberately short: each card shows a one-line summary and turns over for the
 * full explanation. The complete write-up lives on /systems.
 */
export default function Systems() {
  return `
    <section
      id="systems"
      class="py-24"
      aria-labelledby="systems-heading"
    >
      <div class="max-w-7xl mx-auto px-6">

        <div class="max-w-xl mb-14" data-reveal>
          <div class="badge mb-5">What We Build</div>
          <h2
            id="systems-heading"
            class="text-3xl md:text-4xl font-display font-bold text-ink-primary mb-4"
          >
            Six systems. Each one plugs a specific leak.
          </h2>
          <p class="text-ink-secondary leading-relaxed">
            You don't lose revenue to bad traffic — you lose it to slow replies,
            follow-up that never happens, and no-shows. Tap any card to see how
            we close that gap.
          </p>
        </div>

        ${MagicBento(SYSTEMS, { id: 'systems-bento', enableFlip: true, detailHref: '/systems' })}

        <div class="mt-12 text-center" data-reveal>
          <a href="/systems" class="btn btn-secondary" data-magnet>
            See every system in detail
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  `;
}
