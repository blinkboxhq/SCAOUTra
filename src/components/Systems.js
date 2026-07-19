const CORE = [
  {
    number: '01',
    title: 'Speed-to-Lead',
    body: "You're not losing clients because you're not good enough — you're losing them because you replied Tuesday to a Monday inquiry. Every inbound gets answered within minutes and routed to book or nurture, automatically.",
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
    body: "Most leads don't say no — they just go quiet, and nobody follows up. This re-touches every lead who didn't convert at 30, 60, and 90 days, and reaches back to past clients for renewals and referrals.",
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
    body: "A booked call means nothing if the client doesn't show. The moment someone books, a deposit or payment link goes out automatically — recovering revenue you'd otherwise lose to no-shows.",
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
    body: "The first call shouldn't be where you find out the lead isn't a fit. An AI intake gathers context before you ever speak, filters out mismatches, and hands you a briefing — so the conversation starts warm.",
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
    body: "Good testimonials don't happen because you remembered to ask. This triggers the request at the right moment, formats the response, and publishes it to your site — no manual follow-up required.",
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
    body: "One podcast or talk shouldn't die after one listen. It gets sliced into weeks of LinkedIn posts, newsletter content, and quote graphics — content you'd otherwise pay someone to write from scratch.",
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

function renderCards(items, { accentBorder = false } = {}) {
  return items
    .map(
      (item, i) => `
      <article
        class="card p-8 relative overflow-hidden"
        data-reveal
        data-reveal-delay="${(i % 3) + 1}"
        aria-labelledby="system-title-${item.number}"
        ${accentBorder ? 'style="border-color: rgba(74, 222, 128, 0.24);"' : ''}
      >
        <span
          class="absolute top-4 right-6 font-display font-black text-7xl leading-none select-none pointer-events-none"
          style="color: ${item.color}; opacity: 0.06;"
          aria-hidden="true"
        >${item.number}</span>

        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
          style="background: ${item.bg}; color: ${item.color};"
        >
          ${item.icon}
        </div>

        <h3
          id="system-title-${item.number}"
          class="text-lg font-display font-bold text-ink-primary mb-3"
        >
          ${item.title}
        </h3>
        <p class="text-sm text-ink-secondary leading-relaxed">
          ${item.body}
        </p>
      </article>
    `
    )
    .join('');
}

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
            Your website gets you found. These systems make sure you never lose who finds you.
          </h2>
          <p class="text-ink-secondary leading-relaxed">
            You don't lose revenue to bad traffic. You lose it to slow replies,
            follow-up that never happens, and clients who no-show without a deposit.
            Each system below plugs one specific leak.
          </p>
        </div>

        <div class="mb-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-sm font-display font-bold text-ink-primary uppercase tracking-[0.14em]">Evergreen Core</span>
            <span class="h-px flex-1 bg-ink-border"></span>
          </div>
          <div class="grid md:grid-cols-3 gap-6" role="list">
            ${renderCards(CORE)}
          </div>
        </div>

        <div>
          <div class="flex items-center gap-3 mb-6">
            <span class="text-sm font-display font-bold text-ink-primary uppercase tracking-[0.14em]">Evergreen Full</span>
            <span class="text-xs font-medium text-accent uppercase tracking-widest">Core + Growth</span>
            <span class="h-px flex-1 bg-ink-border"></span>
          </div>
          <div class="grid md:grid-cols-3 gap-6" role="list">
            ${renderCards(FULL, { accentBorder: true })}
          </div>
        </div>

      </div>
    </section>
  `;
}
