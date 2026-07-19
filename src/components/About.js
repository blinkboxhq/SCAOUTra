const PRINCIPLES = [
  {
    number: '01',
    title: 'Infrastructure, not decoration',
    body: "A site that looks good but doesn't capture leads is a brochure. I build systems that answer, qualify, and follow up — so the work continues after someone lands on your page.",
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    `,
  },
  {
    number: '02',
    title: 'You own everything',
    body: "Code, domain, automations — all yours. No lock-in, no hostage retainers, no platform you can't leave. If we ever stop working together, you walk away with a machine that still runs.",
    color: '#22d3ee',
    bg: 'rgba(34, 211, 238, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2"/>
        <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
      </svg>
    `,
  },
  {
    number: '03',
    title: 'Proof before payment',
    body: "You see a live preview before you pay a euro beyond the deposit. If the first preview doesn't land, I refund it in full. I take that risk so you don't have to.",
    color: '#86efac',
    bg: 'rgba(134, 239, 172, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    `,
  },
  {
    number: '04',
    title: 'One person, fully accountable',
    body: "You talk to the person building it — not an account manager relaying messages. Fewer hand-offs, faster decisions, and a single name on the line when it matters.",
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.08)',
    icon: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>
      </svg>
    `,
  },
];

export default function About() {
  const principlesHtml = PRINCIPLES.map(
    (p, i) => `
      <article
        class="card p-8 relative overflow-hidden"
        data-reveal
        data-reveal-delay="${(i % 2) + 1}"
        aria-labelledby="principle-${p.number}"
      >
        <span
          class="absolute top-4 right-6 font-display font-black text-7xl leading-none select-none pointer-events-none"
          style="color: ${p.color}; opacity: 0.06;"
          aria-hidden="true"
        >${p.number}</span>
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
          style="background: ${p.bg}; color: ${p.color};"
        >
          ${p.icon}
        </div>
        <h3 id="principle-${p.number}" class="text-lg font-display font-bold text-ink-primary mb-3">${p.title}</h3>
        <p class="text-sm text-ink-secondary leading-relaxed">${p.body}</p>
      </article>
    `
  ).join('');

  return `
    <!-- ── Hero ─────────────────────────────────────────────── -->
    <section
      id="about-hero"
      class="relative pt-36 pb-20 md:pt-52 md:pb-24 flex flex-col items-center text-center px-6 overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div class="hero-aurora" aria-hidden="true"></div>
      <div class="hero-orb hero-orb-1" aria-hidden="true"></div>
      <div class="hero-orb hero-orb-2" aria-hidden="true"></div>

      <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        <div class="badge mb-8" data-reveal>
          <span class="badge__dot" aria-hidden="true"></span>
          Who's Behind Scoutra
        </div>

        <h1
          id="about-heading"
          class="text-[2.5rem] sm:text-5xl md:text-[3.75rem] font-display font-extrabold text-ink-primary mb-6 leading-[1.08]"
          data-reveal
          data-reveal-delay="1"
        >
          I build the systems that make small businesses
          <span class="block" style="color: var(--accent);">impossible to compete with.</span>
        </h1>

        <p
          class="text-lg md:text-xl text-ink-secondary mb-4 max-w-xl leading-relaxed"
          data-reveal
          data-reveal-delay="2"
        >
          Scoutra is a one-person automation and web studio. No account managers,
          no hand-offs, no bloat — just the infrastructure that turns your website
          into a machine that captures, qualifies, and follows up while you sleep.
        </p>
      </div>
    </section>

    <!-- ── Founder note ─────────────────────────────────────── -->
    <section
      class="py-20"
      style="background: var(--bg-card); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);"
      aria-labelledby="founder-heading"
    >
      <div class="max-w-4xl mx-auto px-6 grid md:grid-cols-[auto_1fr] gap-10 items-start">

        <div class="flex flex-col items-center gap-3" data-reveal>
          <div
            class="w-28 h-28 rounded-2xl flex items-center justify-center font-display font-black text-4xl select-none"
            style="background: rgba(74,222,128,0.10); color: var(--accent); border: 1px solid var(--border);"
            aria-hidden="true"
          >S</div>
          <span class="text-xs text-ink-muted uppercase tracking-widest">Founder, Scoutra</span>
        </div>

        <div data-reveal data-reveal-delay="1">
          <h2 id="founder-heading" class="text-2xl md:text-3xl font-display font-bold text-ink-primary mb-5">
            Most agencies sell you a website and disappear.
          </h2>
          <div class="space-y-4 text-ink-secondary leading-relaxed">
            <p>
              I got into this because I kept watching good businesses lose clients they'd
              already won — to a reply that came a day too late, a follow-up nobody sent,
              a no-show nobody chased.
            </p>
            <p>
              That's not a talent problem. It's an infrastructure problem. You don't need
              to be a better closer. You need systems that never forget, never sleep, and
              never let a lead go cold.
            </p>
            <p>
              So that's what I build. A site that looks like the market leader, wired to
              the automation that makes it actually sell — delivered in days, owned entirely
              by you, and backed by a preview you approve before you pay.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Principles ───────────────────────────────────────── -->
    <section class="py-24" aria-labelledby="principles-heading">
      <div class="max-w-7xl mx-auto px-6">
        <div class="max-w-xl mb-14" data-reveal>
          <div class="badge mb-5">How I Work</div>
          <h2 id="principles-heading" class="text-3xl md:text-4xl font-display font-bold text-ink-primary mb-4">
            Four rules I don't break
          </h2>
          <p class="text-ink-secondary leading-relaxed">
            No jargon, no lock-in, no disappearing act. Here's what working with
            Scoutra actually means.
          </p>
        </div>
        <div class="grid md:grid-cols-2 gap-6" role="list">
          ${principlesHtml}
        </div>
      </div>
    </section>

    <!-- ── CTA ──────────────────────────────────────────────── -->
    <section
      id="about-cta"
      class="py-24"
      style="background: var(--bg-card); border-top: 1px solid var(--border-subtle);"
      aria-labelledby="about-cta-heading"
    >
      <div class="max-w-2xl mx-auto px-6 text-center" data-reveal>
        <h2 id="about-cta-heading" class="text-3xl md:text-4xl font-display font-bold text-ink-primary mb-4">
          See which leak is costing you the most.
        </h2>
        <p class="text-ink-secondary mb-8 leading-relaxed">
          A free audit of your current follow-up, intake, and payment flow — and
          exactly where leads or revenue are slipping out.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/#apply" class="btn btn-primary" data-magnet>
            Apply for a Free Audit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="/web" class="btn btn-secondary" data-magnet>
            See Web Design Services
          </a>
        </div>
      </div>
    </section>
  `;
}
