import MagicBento from './MagicBento.js';

const CORE = [
  {
    number: '01',
    title: 'Speed-to-Lead',
    body: "You're not losing clients because your program isn't good enough — you're losing them because you replied Tuesday to a Monday DM. Every inquiry gets answered within minutes and routed to book a discovery call or nurture, automatically.",
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    `,
  },
  {
    number: '02',
    title: 'Never-Go-Cold Nurture',
    body: "Most leads don't say no — they ask about your program, go quiet, and nobody follows up. This re-touches every lead who didn't book at 30, 60, and 90 days, and reaches back to past clients for renewals and referrals.",
    color: '#22d3ee',
    bg: 'rgba(34, 211, 238, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-3-6.7"/>
        <polyline points="21 3 21 9 15 9"/>
      </svg>
    `,
  },
  {
    number: '03',
    title: 'Payment Automation',
    body: "A booked discovery call means nothing if the client no-shows. The moment someone books a session, a deposit or payment link goes out automatically — recovering revenue you'd otherwise lose to no-shows.",
    color: '#86efac',
    bg: 'rgba(134, 239, 172, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
      </svg>
    `,
  },
];

const FULL = [
  {
    number: '04',
    title: 'AI-Qualified Intake',
    body: "The first call shouldn't be where you find out this person isn't ready to invest in coaching. An AI intake gathers context on their goals before you ever speak, filters out mismatches, and hands you a briefing — so the conversation starts warm.",
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="12" cy="12" r="0.5" fill="currentColor"/>
      </svg>
    `,
  },
  {
    number: '05',
    title: 'Testimonial Engine',
    body: "Good testimonials don't happen because you remembered to ask after a client hits their goal. This triggers the request at the right moment, formats the response, and publishes it to your site — no manual follow-up required.",
    color: '#22d3ee',
    bg: 'rgba(34, 211, 238, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9 12 2"/>
      </svg>
    `,
  },
  {
    number: '06',
    title: 'Content Repurposing',
    body: "One podcast appearance or client transformation shouldn't die after one post. It gets sliced into weeks of LinkedIn posts, newsletter content, and quote graphics — content you'd otherwise pay someone to write from scratch.",
    color: '#86efac',
    bg: 'rgba(134, 239, 172, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polygon points="12 2 22 8.5 12 15 2 8.5 12 2"/>
        <polyline points="2 15.5 12 22 22 15.5"/>
      </svg>
    `,
  },
];

/* The two tiers now live on each card as a label rather than as separate
   sub-headed grids, so the bento reads as one composition without losing the
   Core / Full distinction the pricing depends on. */
const BENTO_CARDS = [
  ...CORE.map(c => ({ ...c, label: 'Evergreen Core' })),
  ...FULL.map(c => ({ ...c, label: 'Evergreen Full' })),
];

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
            Your website gets your practice found. These systems make sure you never lose who finds you.
          </h2>
          <p class="text-ink-secondary leading-relaxed">
            As a health, wellness or nutrition coach, you don't lose revenue to bad traffic.
            You lose it to slow replies, follow-up that never happens, and clients who
            no-show without a deposit. Each system below plugs one specific leak.
          </p>
        </div>

        ${MagicBento(BENTO_CARDS, { id: 'systems-bento' })}

      </div>
    </section>
  `;
}
