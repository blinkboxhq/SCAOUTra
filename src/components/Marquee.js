/**
 * Infinite scrolling marquee ticker.
 * Two copies of the item list side-by-side — CSS animates translateX(-50%)
 * so it loops seamlessly. Pauses on hover. Reverses on [data-marquee="reverse"].
 */

const ITEMS = [
  'CRM Automation',
  'Lead Capture Systems',
  'AI Chatbots',
  'Email Sequences',
  'WhatsApp Workflows',
  'Reporting Dashboards',
  'Booking Automation',
  'Web Design',
  'n8n Pipelines',
  'Cinematic Sites',
  'AI Lead Qualification',
  'CMS Integration',
];

function buildTrack() {
  const items = [...ITEMS, ...ITEMS]; // duplicate for seamless loop
  return items.map(item => `
    <span class="marquee-item">
      <span class="marquee-dot" aria-hidden="true"></span>
      ${item}
    </span>
  `).join('');
}

export default function Marquee() {
  return `
    <div class="marquee-section" aria-hidden="true">
      <div class="marquee-track">
        ${buildTrack()}
      </div>
    </div>
  `;
}
