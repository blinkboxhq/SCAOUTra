/**
 * Audit — interactive "Client-Getting Systems Audit" quiz.
 * Scores 4 self-report pillars instantly client-side (Speed-to-Lead, Booking &
 * Follow-Up, Onboarding & Retention, Tech Stack). Digital Presence + Content
 * Systems are flagged "pending" — those need a human/Claude looking at the
 * actual site, so they're completed manually after submission (see
 * marketing/audit-framework.md in the agency repo).
 */
import { submitAuditQuiz } from '../api.js';

const QUESTIONS = [
  {
    id: 'speed',
    pillar: 'Speed-to-Lead',
    text: 'When someone messages you interested in working together, how long does it usually take you to reply?',
    options: [
      { label: 'Within minutes to an hour', pts: 2 },
      { label: 'Same day', pts: 1 },
      { label: 'Sometimes a day or more', pts: 0 },
    ],
  },
  {
    id: 'booking',
    pillar: 'Booking & Follow-Up',
    text: 'How does someone actually book a call or session with you right now?',
    options: [
      { label: 'A booking link — they pick a time themselves', pts: 2 },
      { label: 'We go back and forth over DM or email', pts: 1 },
      { label: "There isn't really a set process", pts: 0 },
    ],
  },
  {
    id: 'followup',
    pillar: 'Booking & Follow-Up',
    text: "If someone inquires but doesn't book, what happens next?",
    options: [
      { label: 'They get followed up with on a schedule', pts: 2 },
      { label: 'I follow up sometimes, when I remember', pts: 1 },
      { label: 'Honestly, nothing — they just go quiet', pts: 0 },
    ],
  },
  {
    id: 'noshow',
    pillar: 'Booking & Follow-Up',
    text: "What happens when someone books a call and then doesn't show up?",
    options: [
      { label: "They've already paid a deposit, so it rarely happens", pts: 2 },
      { label: 'I usually message them to reschedule', pts: 1 },
      { label: "Nothing — it's a wasted slot", pts: 0 },
    ],
  },
  {
    id: 'onboarding',
    pillar: 'Client Onboarding & Retention',
    text: 'When someone becomes a client, what does the first week look like?',
    options: [
      { label: 'A consistent onboarding sequence — same every time', pts: 2 },
      { label: 'I put something together manually each time', pts: 1 },
      { label: "It's pretty ad hoc", pts: 0 },
    ],
  },
  {
    id: 'techstack',
    pillar: 'Tech Stack',
    text: 'Which best describes your current booking & payment setup?',
    options: [
      { label: 'Dedicated tools (Calendly, Stripe, etc.) doing most of the work', pts: 2 },
      { label: 'A mix of tools, some manual steps', pts: 1 },
      { label: 'Mostly manual (bank transfer, texting to schedule, etc.)', pts: 0 },
    ],
  },
];

// step order: 0 intro, 1 info, 2-7 questions, 8 numbers, 9 results
const TOTAL_FORM_STEPS = 8; // steps 1..8 count toward the progress bar

function choiceStepHTML(q, index) {
  return `
    <div class="audit-step" data-step="${2 + index}" role="group" aria-labelledby="q-${q.id}">
      <p class="audit-eyebrow">${q.pillar}</p>
      <h2 id="q-${q.id}" class="audit-question">${q.text}</h2>
      <div class="audit-choices" data-question="${q.id}">
        ${q.options
          .map(
            (opt, i) => `
          <button type="button" class="audit-choice" data-pts="${opt.pts}" data-label="${opt.label.replace(/"/g, '&quot;')}">
            ${opt.label}
          </button>`
          )
          .join('')}
      </div>
      <button type="button" class="audit-back" data-back>&larr; Back</button>
    </div>
  `;
}

export default function Audit() {
  return `
    <section id="audit-app" class="audit-section" aria-labelledby="audit-heading">
      <div class="audit-wrap">

        <div class="audit-progress" aria-hidden="true">
          <div class="audit-progress-bar" id="audit-progress-bar"></div>
        </div>

        <!-- Step 0: Intro -->
        <div class="audit-step is-active" data-step="0">
          <div class="badge mb-6"><span class="badge__dot"></span>2-Minute Audit</div>
          <h1 id="audit-heading" class="audit-hero-title">
            The Client-Getting
            <span class="audit-gradient-text">Systems Audit</span>
          </h1>
          <p class="audit-hero-sub">
            Answer a few honest questions about how your practice currently handles
            inquiries, bookings, and follow-up. Get an instant score — plus a fully
            personal review of your website, in your inbox within 24 hours.
          </p>
          <button type="button" class="btn btn-primary audit-start" data-next>
            Start My Audit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <p class="audit-hero-note">No spam. No commitment. Takes about 2 minutes.</p>
        </div>

        <!-- Step 1: Business info -->
        <div class="audit-step" data-step="1">
          <p class="audit-eyebrow">About your practice</p>
          <h2 class="audit-question">Let's start with the basics</h2>

          <div class="audit-form-grid">
            <div class="form-field" id="field-audit-name">
              <label for="audit-input-name" class="form-label">Your name <span class="text-red-400" aria-hidden="true">*</span></label>
              <input type="text" id="audit-input-name" class="form-input" placeholder="Jane Doe" autocomplete="name" required />
              <span class="form-error" role="alert">Please enter your name.</span>
            </div>
            <div class="form-field" id="field-audit-email">
              <label for="audit-input-email" class="form-label">Email <span class="text-red-400" aria-hidden="true">*</span></label>
              <input type="email" id="audit-input-email" class="form-input" placeholder="you@yourpractice.com" autocomplete="email" required />
              <span class="form-error" role="alert">Please enter a valid email.</span>
            </div>
            <div class="form-field" id="field-audit-website">
              <label for="audit-input-website" class="form-label">Website URL <span class="text-red-400" aria-hidden="true">*</span></label>
              <input type="text" id="audit-input-website" class="form-input" placeholder="yourpractice.com" autocomplete="url" required />
              <span class="form-error" role="alert">Please enter your website URL.</span>
            </div>
            <div class="form-field" id="field-audit-instagram">
              <label for="audit-input-instagram" class="form-label">Instagram handle (optional)</label>
              <input type="text" id="audit-input-instagram" class="form-input" placeholder="@yourpractice" />
            </div>
          </div>

          <div class="audit-nav">
            <button type="button" class="audit-back" data-back>&larr; Back</button>
            <button type="button" class="btn btn-primary" data-next data-validate="info">Continue</button>
          </div>
        </div>

        ${QUESTIONS.map((q, i) => choiceStepHTML(q, i)).join('')}

        <!-- Step 8: Numbers -->
        <div class="audit-step" data-step="8">
          <p class="audit-eyebrow">Last thing</p>
          <h2 class="audit-question">Two quick numbers so we can estimate what this is costing you</h2>

          <div class="audit-form-grid">
            <div class="form-field" id="field-audit-inquiries">
              <label for="audit-input-inquiries" class="form-label">Roughly how many inquiries do you get per month? <span class="text-red-400" aria-hidden="true">*</span></label>
              <input type="number" min="0" id="audit-input-inquiries" class="form-input" placeholder="e.g. 15" required />
              <span class="form-error" role="alert">Please enter a number (0 is fine).</span>
            </div>
            <div class="form-field" id="field-audit-value">
              <label for="audit-input-value" class="form-label">Average value of a client to you, in &euro; (per program/package) <span class="text-red-400" aria-hidden="true">*</span></label>
              <input type="number" min="0" id="audit-input-value" class="form-input" placeholder="e.g. 900" required />
              <span class="form-error" role="alert">Please enter a number.</span>
            </div>
          </div>

          <div class="audit-nav">
            <button type="button" class="audit-back" data-back>&larr; Back</button>
            <button type="button" class="btn btn-primary" id="audit-submit-btn" data-next data-validate="numbers">
              <span id="audit-submit-label">See My Score</span>
            </button>
          </div>
        </div>

        <!-- Step 9: Results -->
        <div class="audit-step" data-step="9">
          <div class="audit-results" id="audit-results"><!-- populated by JS --></div>
        </div>

      </div>
    </section>
  `;
}

export function initAudit() {
  const root = document.getElementById('audit-app');
  if (!root) return;

  const steps = Array.from(root.querySelectorAll('.audit-step'));
  const progressBar = document.getElementById('audit-progress-bar');
  const answers = {}; // question id -> { pts, label }
  let current = 0;

  function goTo(stepIndex) {
    steps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === stepIndex));
    current = stepIndex;
    const pct = stepIndex <= 0 ? 0 : Math.min(100, Math.round((stepIndex / TOTAL_FORM_STEPS) * 100));
    if (progressBar) progressBar.style.width = `${pct}%`;
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  root.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', () => goTo(Math.max(0, current - 1)));
  });

  // --- Choice questions: click to answer + auto-advance ---
  root.querySelectorAll('.audit-choices').forEach((group) => {
    const qid = group.dataset.question;
    group.querySelectorAll('.audit-choice').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.audit-choice').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        answers[qid] = { pts: Number(btn.dataset.pts), label: btn.dataset.label };
        setTimeout(() => goTo(current + 1), 220);
      });
    });
  });

  // --- Validators ---
  function setError(fieldId, show) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.classList.toggle('has-error', show);
    const input = el.querySelector('input');
    if (input) input.classList.toggle('is-error', show);
  }

  function validateInfo() {
    const name = document.getElementById('audit-input-name');
    const email = document.getElementById('audit-input-email');
    const website = document.getElementById('audit-input-website');
    const nameOk = name.value.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    const websiteOk = website.value.trim().length >= 4;
    setError('field-audit-name', !nameOk);
    setError('field-audit-email', !emailOk);
    setError('field-audit-website', !websiteOk);
    return nameOk && emailOk && websiteOk;
  }

  function validateNumbers() {
    const inquiries = document.getElementById('audit-input-inquiries');
    const value = document.getElementById('audit-input-value');
    const inquiriesOk = inquiries.value !== '' && Number(inquiries.value) >= 0;
    const valueOk = value.value !== '' && Number(value.value) >= 0;
    setError('field-audit-inquiries', !inquiriesOk);
    setError('field-audit-value', !valueOk);
    return inquiriesOk && valueOk;
  }

  // --- Next / validated-next buttons ---
  root.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const validate = btn.dataset.validate;

      if (validate === 'info') {
        if (!validateInfo()) return;
        goTo(current + 1);
        return;
      }

      if (validate === 'numbers') {
        if (!validateNumbers()) return;
        await handleSubmit();
        return;
      }

      goTo(current + 1);
    });
  });

  // --- Scoring + results rendering ---
  function computeResults() {
    const pillarGroups = {
      'Speed-to-Lead': ['speed'],
      'Booking & Follow-Up': ['booking', 'followup', 'noshow'],
      'Client Onboarding & Retention': ['onboarding'],
      'Tech Stack': ['techstack'],
    };

    let totalPts = 0;
    let maxPts = 0;
    QUESTIONS.forEach((q) => {
      totalPts += answers[q.id] ? answers[q.id].pts : 0;
      maxPts += 2;
    });

    const score = Math.round((totalPts / maxPts) * 100);

    const pillarResults = Object.entries(pillarGroups).map(([pillar, ids]) => {
      const pts = ids.map((id) => (answers[id] ? answers[id].pts : 0));
      const avg = pts.reduce((a, b) => a + b, 0) / pts.length;
      const status = avg < 0.8 ? 'red' : avg < 1.6 ? 'yellow' : 'green';
      const statusLabel = status === 'red' ? 'Needs work' : status === 'yellow' ? 'Partial' : 'Solid';
      return { pillar, status, statusLabel };
    });

    const inquiries = Number(document.getElementById('audit-input-inquiries').value || 0);
    const avgValue = Number(document.getElementById('audit-input-value').value || 0);
    const lostRate = Math.max(0.08, 0.35 * (1 - totalPts / maxPts));
    const rawLeak = inquiries * lostRate * avgValue;
    const leak = Math.floor(rawLeak / 50) * 50;

    return { score, totalPts, maxPts, pillarResults, leak, inquiries, avgValue };
  }

  function renderResults(results) {
    const { score, pillarResults, leak } = results;
    const container = document.getElementById('audit-results');

    const pillarHTML = pillarResults
      .map(
        (p) => `
        <div class="audit-result-card">
          <span>${p.pillar}</span>
          <span class="audit-pill audit-pill--${p.status}">${p.statusLabel}</span>
        </div>`
      )
      .join('');

    const pendingHTML = ['Digital Presence', 'Content & Marketing Systems']
      .map(
        (p) => `
        <div class="audit-result-card audit-result-card--pending">
          <span>${p}</span>
          <span class="audit-pill audit-pill--pending">Pending review</span>
        </div>`
      )
      .join('');

    container.innerHTML = `
      <div class="audit-score-ring" style="background: conic-gradient(#4ade80 0% ${score}%, var(--border) ${score}% 100%);">
        <div class="audit-score-inner">
          <div class="audit-score-num">${score}</div>
          <div class="audit-score-label">out of 100</div>
        </div>
      </div>
      <p class="audit-verdict">
        Based on your answers, you could be leaving an estimated
        <strong class="audit-gradient-text">&euro;${leak.toLocaleString()}/month</strong>
        on the table from slow replies, weak follow-up, or no-shows.
      </p>

      <p class="audit-section-title">Your instant score</p>
      <div class="audit-results-list">${pillarHTML}</div>

      <p class="audit-section-title">Reviewed personally within 24 hours</p>
      <div class="audit-results-list">${pendingHTML}</div>

      <div class="audit-cta">
        <p>Your full report — including a real review of your website and content — lands in your inbox within 24 hours.</p>
        <a class="btn btn-primary" href="/#apply">Book a 15-min walkthrough instead</a>
      </div>
    `;
  }

  async function handleSubmit() {
    const results = computeResults();
    const submitBtn = document.getElementById('audit-submit-btn');
    const submitLabel = document.getElementById('audit-submit-label');
    submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Calculating...';

    const answerSummary = QUESTIONS.reduce((acc, q) => {
      acc[`${q.pillar}: ${q.text}`] = answers[q.id] ? answers[q.id].label : '(skipped)';
      return acc;
    }, {});

    try {
      await submitAuditQuiz({
        name: document.getElementById('audit-input-name').value,
        email: document.getElementById('audit-input-email').value,
        website: document.getElementById('audit-input-website').value,
        instagram: document.getElementById('audit-input-instagram').value,
        score: results.score,
        leakEstimate: results.leak,
        monthlyInquiries: results.inquiries,
        avgClientValue: results.avgValue,
        answers: answerSummary,
      });
    } catch (err) {
      console.warn('Audit quiz submission failed:', err);
      // Still show results — the prospect shouldn't be blocked by our email plumbing.
    }

    submitBtn.disabled = false;
    if (submitLabel) submitLabel.textContent = 'See My Score';

    renderResults(results);
    goTo(9);
  }

  goTo(0);
}
