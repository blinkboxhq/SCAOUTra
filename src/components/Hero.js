export default function Hero() {
  return `
    <section
      id="hero"
      class="relative pt-36 pb-28 md:pt-52 md:pb-36 flex flex-col items-center text-center px-6 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div class="hero-orb hero-orb-1" aria-hidden="true" data-parallax="-0.08"></div>
      <div class="hero-orb hero-orb-2" aria-hidden="true" data-parallax="-0.12"></div>

      <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center">

        <div
          class="badge mb-8"
          data-reveal
          data-parallax="-0.04"
          aria-label="Now accepting five new clients this quarter"
        >
          <span class="badge__dot" aria-hidden="true"></span>
          Accepting 5 New Clients This Quarter
        </div>

        <h1
          id="hero-heading"
          class="text-[2.75rem] sm:text-6xl md:text-7xl font-display font-extrabold text-ink-primary mb-6 leading-[1.08]"
          data-reveal
          data-reveal-delay="1"
          data-parallax="-0.06"
        >
          <span data-scramble="Automate the Work" data-scramble-duration="800">Automate the Work</span>
          <span
            class="block text-transparent bg-clip-text"
            style="background-image: linear-gradient(135deg, #4ade80 0%, #22d3ee 60%, #38bdf8 100%);"
          >
            <span data-scramble="That Limits Your Growth" data-scramble-duration="1000">That Limits Your Growth</span>
          </span>
        </h1>

        <p
          class="text-lg md:text-xl text-ink-secondary mb-10 max-w-xl leading-relaxed"
          data-reveal
          data-reveal-delay="2"
          data-parallax="-0.03"
        >
          We map your operations, identify the highest-value automation
          opportunities, and build the infrastructure to eliminate manual
          bottlenecks — without disrupting your business.
        </p>

        <div
          class="flex flex-col sm:flex-row gap-3 justify-center"
          data-reveal
          data-reveal-delay="3"
        >
          <a href="#apply" class="btn btn-primary" data-magnet>
            Apply for a Free Audit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="#protocol" class="btn btn-secondary" data-magnet>
            See How It Works
          </a>
        </div>

        <div
          class="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-ink-muted uppercase tracking-widest"
          data-reveal
          data-reveal-delay="4"
          aria-label="Key metrics"
        >
          <span class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1l1.56 3.16L12 4.78l-2.5 2.44.59 3.44L7 9.19 4.91 10.66l.59-3.44L3 4.78l3.44-.62L7 1z" fill="#4ade80"/>
            </svg>
            15+ Hours Saved Per Week
          </span>
          <span class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="#4ade80" stroke-width="1.4"/>
              <path d="M4.5 7l2 2 3-3" stroke="#4ade80" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Zero Error Rate
          </span>
          <span class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="12" height="9" rx="2" stroke="#4ade80" stroke-width="1.4"/>
              <path d="M1 6h12" stroke="#4ade80" stroke-width="1.4"/>
            </svg>
            30-Day Deployment Guarantee
          </span>
        </div>
      </div>
    </section>
  `;
}
