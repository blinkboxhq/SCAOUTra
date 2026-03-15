const STATS = [
  {
    value: '15h',
    suffix: '+',
    label: 'Weekly hours reclaimed',
    description: 'Average time saved per client per week',
  },
  {
    value: '0',
    suffix: '%',
    label: 'Error rate',
    description: 'Automated workflows run without human error',
  },
  {
    value: '24',
    suffix: '/7',
    label: 'Operational uptime',
    description: 'Your automation runs around the clock',
  },
  {
    value: '10',
    suffix: 'x',
    label: 'Average ROI, Year 1',
    description: 'Return on automation investment',
  },
];

export default function Results() {
  const items = STATS.map(
    (s, i) => `
      <div
        class="text-center px-4 py-2"
        data-reveal
        data-reveal-delay="${i + 1}"
      >
        <div
          class="stat-value mb-1"
          aria-label="${s.value}${s.suffix} — ${s.label}"
        >
          <span class="stat-accent" aria-hidden="true">${s.value}</span><span class="text-ink-muted text-2xl font-bold" aria-hidden="true">${s.suffix}</span>
        </div>
        <div class="text-sm font-semibold text-ink-primary mb-1">${s.label}</div>
        <div class="text-xs text-ink-muted leading-snug max-w-[180px] mx-auto">${s.description}</div>
      </div>
    `
  ).join('');

  return `
    <section
      id="results"
      class="py-20 border-y"
      style="border-color: var(--border-subtle);"
      aria-labelledby="results-heading"
    >
      <div class="max-w-6xl mx-auto px-6">
        <h2
          id="results-heading"
          class="text-center text-sm font-bold text-ink-muted uppercase tracking-[0.12em] mb-12"
          data-reveal
        >
          The Impact of Automation
        </h2>

        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x"
          style="--tw-divide-color: var(--border-subtle);"
          role="list"
          aria-label="Key performance metrics"
        >
          ${items}
        </div>
      </div>
    </section>
  `;
}
