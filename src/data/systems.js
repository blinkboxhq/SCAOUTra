/**
 * Single source of truth for the systems and the deployment protocol.
 *
 * `short` is the one-line version used on the landing page (card fronts).
 * `body` is the full explanation, shown on the card backs and on /systems.
 * Both pages read from here so the two can never drift apart.
 */

export const SYSTEMS = [
  {
    number: '01',
    slug: 'speed-to-lead',
    tier: 'Evergreen Core',
    title: 'Speed-to-Lead',
    short: 'Every inquiry answered in minutes, not days.',
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
    slug: 'never-go-cold-nurture',
    tier: 'Evergreen Core',
    title: 'Never-Go-Cold Nurture',
    short: 'Automatic follow-up at 30, 60 and 90 days.',
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
    slug: 'payment-automation',
    tier: 'Evergreen Core',
    title: 'Payment Automation',
    short: 'Deposit links go out the moment a call is booked.',
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
  {
    number: '04',
    slug: 'ai-qualified-intake',
    tier: 'Evergreen Full',
    title: 'AI-Qualified Intake',
    short: 'Clients arrive pre-screened, with a briefing for you.',
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
    slug: 'testimonial-engine',
    tier: 'Evergreen Full',
    title: 'Testimonial Engine',
    short: 'Reviews requested, formatted and published for you.',
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
    slug: 'content-repurposing',
    tier: 'Evergreen Full',
    title: 'Content Repurposing',
    short: 'One appearance becomes weeks of content.',
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

export const PROTOCOL = [
  {
    number: '01',
    slug: 'diagnostic-audit',
    title: 'Diagnostic Audit',
    short: 'We map your workflow and find the costliest leak.',
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
    slug: 'architecture-build',
    title: 'Architecture & Build',
    short: 'We build it and test it in a sandbox, not on you.',
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
    slug: 'deployment-handoff',
    title: 'Deployment & Handoff',
    short: 'We go live, train you, and monitor for 30 days.',
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
