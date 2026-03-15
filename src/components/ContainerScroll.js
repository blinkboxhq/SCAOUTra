/**
 * ContainerScroll — scroll-driven 3D perspective reveal.
 * A "dashboard" card starts tilted (rotateX 20°) and flattens as the user scrolls.
 * Translated from the Framer Motion ContainerScroll component.
 */

const METRICS = [
  { label: 'Tasks Automated', value: '2,847', color: '#4ade80' },
  { label: 'Hours Saved',     value: '438h',  color: '#22d3ee' },
  { label: 'Error Rate',      value: '0.0%',  color: '#86efac' },
  { label: 'Active Flows',    value: '12',    color: '#4ade80' },
];

export default function ContainerScroll() {
  const metricCards = METRICS.map(m => `
    <div class="cscroll-metric">
      <div class="cscroll-metric-label">${m.label}</div>
      <div class="cscroll-metric-value" style="color:${m.color};">${m.value}</div>
    </div>
  `).join('');

  return `
    <section
      id="scroll-reveal"
      class="cscroll-section"
      aria-labelledby="cscroll-heading"
    >
      <div class="cscroll-sticky">

        <!-- Title (translates up as card appears) -->
        <div class="cscroll-title text-center" data-reveal>
          <div class="badge mx-auto mb-4">Live Dashboard</div>
          <h2
            id="cscroll-heading"
            class="text-3xl md:text-5xl font-display font-bold text-ink-primary leading-tight"
          >
            Your Automation Hub,
            <span
              class="text-transparent bg-clip-text block"
              style="background-image: linear-gradient(135deg, #4ade80 0%, #22d3ee 60%, #38bdf8 100%);"
            >
              Always On
            </span>
          </h2>
        </div>

        <!-- Scroll-driven card -->
        <div
          id="scroll-card"
          class="cscroll-card-wrap"
          style="transform-origin: 50% 0%; will-change: transform;"
        >
          <div class="cscroll-card">

            <!-- Browser chrome bar -->
            <div class="cscroll-chrome">
              <span class="cscroll-dot" style="background:#ff5f57;"></span>
              <span class="cscroll-dot" style="background:#febc2e;"></span>
              <span class="cscroll-dot" style="background:#28c840;"></span>
              <div class="cscroll-url-bar">
                scoutra.dashboard / flows
              </div>
            </div>

            <!-- Metrics grid -->
            <div class="cscroll-body">
              <div class="cscroll-metrics">
                ${metricCards}
              </div>

              <!-- Sparkline graph -->
              <div class="cscroll-graph">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 160"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="cscrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stop-color="#4ade80" stop-opacity="0.35"/>
                      <stop offset="100%" stop-color="#4ade80" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,130 C60,110 100,60 180,70 C260,80 300,40 380,50 C460,60 500,90 580,55 C660,20 720,75 800,35 L800,160 L0,160 Z"
                    fill="url(#cscrollGrad)"
                  />
                  <path
                    d="M0,130 C60,110 100,60 180,70 C260,80 300,40 380,50 C460,60 500,90 580,55 C660,20 720,75 800,35"
                    fill="none"
                    stroke="#4ade80"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <circle cx="180" cy="70"  r="4" fill="#4ade80"/>
                  <circle cx="380" cy="50"  r="4" fill="#22d3ee"/>
                  <circle cx="580" cy="55"  r="4" fill="#4ade80"/>
                  <circle cx="800" cy="35"  r="4" fill="#86efac"/>
                </svg>
              </div>
            </div>

          </div><!-- /.cscroll-card -->
        </div><!-- /.cscroll-card-wrap -->

      </div><!-- /.cscroll-sticky -->
    </section>
  `;
}

export function initContainerScroll() {
  const section = document.getElementById('scroll-reveal');
  const card    = document.getElementById('scroll-card');
  if (!section || !card) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function update() {
    const rect      = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const progress  = Math.max(0, Math.min(1, -rect.top / scrollable));

    const isMobile = window.innerWidth <= 768;
    const rotate   = 18 * (1 - progress);
    const scale    = isMobile ? 0.88 + 0.12 * progress : 1;

    card.style.transform = `rotateX(${rotate}deg) scale(${scale})`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}
