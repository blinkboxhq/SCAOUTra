/**
 * Audit — the Client-Getting Systems Audit.
 *
 * Not a quiz with a score: a forecast. It collects goal + economics + systems
 * health, then computes:
 *   1. A capacity gap  — whether the current model can mathematically reach the goal
 *   2. A revenue leak  — itemised per broken system, with every assumption shown
 *   3. A time horizon  — what the leak compounds to over 12 and 36 months
 *   4. A reflection    — whether their own self-diagnosis matches the math
 *   5. A priority fix  — the single highest-value next action
 *
 * Digital Presence + Content Systems stay "pending" — those need a human
 * actually looking at the site (see marketing/audit-framework.md).
 *
 * Design rule: every number shown must be traceable. No hidden formulas, no
 * invented industry benchmarks — we compare against a best-practice standard
 * and label every assumption inline.
 */
import { submitAuditQuiz } from '../api.js';

/* ── Leak model ───────────────────────────────────────────────────────────
 * Each failing system loses a conservative share of monthly inquiries.
 * `share` = fraction of inquiries lost when the system scores 0 (broken);
 * a partial score (1) loses half that. Kept deliberately low so the total
 * stays defensible under scrutiny — and every line is printed in the report.
 */
const CHOICE_QUESTIONS = [
  {
    id: 'speed',
    pillar: 'Speed-to-Lead',
    leakShare: 0.08,
    leakLabel: 'Inquiries lost to a slow first reply',
    fix: 'Instant reply + smart routing',
    fixTier: 'Signature',
    effort: 'about a week',
    text: 'When someone messages you interested in working together, how long does it usually take you to reply?',
    options: [
      { label: 'Within minutes — it is automated or I am fast', pts: 2 },
      { label: 'Same day, usually', pts: 1 },
      { label: 'Sometimes a day or more', pts: 0 },
    ],
  },
  {
    id: 'followup',
    pillar: 'Booking & Follow-Up',
    leakShare: 0.07,
    leakLabel: 'Inquiries that went quiet and were never re-contacted',
    fix: 'A 30/60/90-day follow-up sequence',
    fixTier: 'Signature',
    effort: 'a few days',
    text: "If someone inquires but doesn't book, what happens next?",
    options: [
      { label: 'They get followed up with on a set schedule', pts: 2 },
      { label: 'I follow up sometimes, when I remember', pts: 1 },
      { label: 'Honestly nothing — they just go quiet', pts: 0 },
    ],
  },
  {
    id: 'noshow',
    pillar: 'Booking & Follow-Up',
    leakShare: 0.05,
    leakLabel: 'Booked calls lost to no-shows with nothing to hold the slot',
    fix: 'Deposit or card-on-file at time of booking',
    fixTier: 'Essential',
    effort: 'a day or two',
    text: "What happens when someone books a call and then doesn't show up?",
    options: [
      { label: 'They have paid a deposit, so it rarely happens', pts: 2 },
      { label: 'I message them to reschedule', pts: 1 },
      { label: 'Nothing — it is a wasted slot', pts: 0 },
    ],
  },
  {
    id: 'booking',
    pillar: 'Booking & Follow-Up',
    leakShare: 0.04,
    leakLabel: 'Inquiries lost to friction in the booking process',
    fix: 'Self-serve booking page',
    fixTier: 'Essential',
    effort: 'a day',
    text: 'How does someone actually book a call or session with you right now?',
    options: [
      { label: 'A booking link — they pick a time themselves', pts: 2 },
      { label: 'We go back and forth over DM or email', pts: 1 },
      { label: 'There is not really a set process', pts: 0 },
    ],
  },
  {
    id: 'onboarding',
    pillar: 'Client Onboarding & Retention',
    leakShare: 0.03,
    leakLabel: 'Early drop-off and refunds from an inconsistent start',
    fix: 'Automated onboarding sequence',
    fixTier: 'Signature',
    effort: 'a few days',
    text: 'When someone becomes a client, what does their first week look like?',
    options: [
      { label: 'A consistent onboarding sequence — same every time', pts: 2 },
      { label: 'I put something together manually each time', pts: 1 },
      { label: 'It is pretty ad hoc', pts: 0 },
    ],
  },
  {
    id: 'retention',
    pillar: 'Client Onboarding & Retention',
    leakShare: 0.04,
    leakLabel: 'Renewals missed because nothing prompts the conversation',
    fix: 'Check-in + renewal automation',
    fixTier: 'Authority',
    effort: 'about a week',
    text: 'When a client finishes their program, how often do they continue or renew?',
    options: [
      { label: 'Most do — there is a conversation built into the end', pts: 2 },
      { label: 'Some do, if they bring it up', pts: 1 },
      { label: 'Rarely — they finish and that is usually it', pts: 0 },
    ],
  },
  {
    id: 'techstack',
    pillar: 'Tech Stack',
    leakShare: 0.02,
    leakLabel: 'Revenue lost to manual payment and scheduling errors',
    fix: 'Connect booking and payments properly',
    fixTier: 'Essential',
    effort: 'a day or two',
    text: 'Which best describes your current booking and payment setup?',
    options: [
      { label: 'Dedicated tools doing most of the work', pts: 2 },
      { label: 'A mix of tools with some manual steps', pts: 1 },
      { label: 'Mostly manual — transfers, texting to schedule', pts: 0 },
    ],
  },
  {
    id: 'concentration',
    pillar: 'Tech Stack',
    leakShare: 0,
    leakLabel: null,
    fix: 'Add a second reliable lead channel',
    fixTier: 'Authority',
    effort: 'ongoing',
    text: 'Where do most of your clients currently come from?',
    options: [
      { label: 'A few different reliable channels', pts: 2 },
      { label: 'Mostly one channel, plus some referrals', pts: 1 },
      { label: 'Almost entirely one single channel', pts: 0 },
    ],
  },
];

const DIAGNOSIS_OPTIONS = [
  { id: 'leads', label: "I don't get enough inquiries" },
  { id: 'conversion', label: "I get inquiries but they don't become clients" },
  { id: 'retention', label: "Clients don't stay long enough" },
  { id: 'admin', label: "I'm drowning in admin work" },
  { id: 'pricing', label: "I'm undercharging for what I deliver" },
];

const TOTAL_FORM_STEPS = 13;
const BEST_PRACTICE_CONVERSION = 0.25; // the standard we measure against, not a peer average
const HOURS_PER_FULL_WEEK = 40;

function euro(n) {
  return '€' + Math.round(n).toLocaleString('en-US');
}

function choiceStepHTML(q, index) {
  return `
    <div class="audit-step" data-step="${5 + index}" role="group" aria-labelledby="q-${q.id}">
      <p class="audit-eyebrow">${q.pillar}</p>
      <h2 id="q-${q.id}" class="audit-question">${q.text}</h2>
      <div class="audit-choices" data-question="${q.id}">
        ${q.options
          .map(
            (opt) => `
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
          <div class="badge mb-6"><span class="badge__dot"></span>3-Minute Audit</div>
          <h1 id="audit-heading" class="audit-hero-title">
            Can your business actually
            <span class="audit-gradient-text">reach your goal?</span>
          </h1>
          <p class="audit-hero-sub">
            Most owners assume they need more leads. Usually the maths says otherwise.
            Answer a few honest questions and you will see exactly what your current
            model can and cannot deliver &mdash; and what it is quietly costing you
            every month it stays the same.
          </p>
          <ul class="audit-intro-list">
            <li>Whether your current pricing and conversion rate can mathematically hit your target</li>
            <li>Your revenue leak, itemised, with every assumption shown</li>
            <li>What it compounds to over the next 12 and 36 months</li>
            <li>The one fix worth doing first</li>
          </ul>
          <button type="button" class="btn btn-primary audit-start" data-next>
            Start My Audit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <p class="audit-hero-note">No email needed until the end. Takes about 3 minutes.</p>
        </div>

        <!-- Step 1: The goal -->
        <div class="audit-step" data-step="1">
          <p class="audit-eyebrow">Where you are headed</p>
          <h2 class="audit-question">First &mdash; what are you actually aiming for?</h2>
          <p class="audit-step-help">
            Rough numbers are fine. Everything after this is measured against this target.
          </p>
          <div class="audit-form-grid">
            <div class="form-field" id="field-audit-current-rev">
              <label for="audit-input-current-rev" class="form-label">Roughly what are you earning per month right now? (&euro;)</label>
              <input type="number" min="0" inputmode="numeric" id="audit-input-current-rev" class="form-input" placeholder="e.g. 3000" required />
              <span class="form-error" role="alert">Please enter a number (0 is fine).</span>
            </div>
            <div class="form-field" id="field-audit-goal-rev">
              <label for="audit-input-goal-rev" class="form-label">What would you like to be earning per month, 12 months from now? (&euro;)</label>
              <input type="number" min="0" inputmode="numeric" id="audit-input-goal-rev" class="form-input" placeholder="e.g. 10000" required />
              <span class="form-error" role="alert">Please enter your target.</span>
            </div>
          </div>
          <div class="audit-nav">
            <button type="button" class="audit-back" data-back>&larr; Back</button>
            <button type="button" class="btn btn-primary" data-next data-validate="goal">Continue</button>
          </div>
        </div>

        <!-- Step 2: The economics -->
        <div class="audit-step" data-step="2">
          <p class="audit-eyebrow">Your numbers</p>
          <h2 class="audit-question">Now the three numbers that decide everything</h2>
          <p class="audit-step-help">
            These give us your real conversion rate &mdash; the number most owners have never calculated.
          </p>
          <div class="audit-form-grid">
            <div class="form-field" id="field-audit-price">
              <label for="audit-input-price" class="form-label">Average value of one client to you (&euro; per program or package)</label>
              <input type="number" min="0" inputmode="numeric" id="audit-input-price" class="form-input" placeholder="e.g. 900" required />
              <span class="form-error" role="alert">Please enter an amount above 0.</span>
            </div>
            <div class="form-field" id="field-audit-inquiries">
              <label for="audit-input-inquiries" class="form-label">Roughly how many inquiries do you get per month?</label>
              <input type="number" min="0" inputmode="numeric" id="audit-input-inquiries" class="form-input" placeholder="e.g. 15" required />
              <span class="form-error" role="alert">Please enter a number above 0.</span>
            </div>
            <div class="form-field" id="field-audit-clients">
              <label for="audit-input-clients" class="form-label">Of those, how many become paying clients in a typical month?</label>
              <input type="number" min="0" inputmode="numeric" id="audit-input-clients" class="form-input" placeholder="e.g. 2" required />
              <span class="form-error" role="alert">Please enter a number (cannot exceed your inquiries).</span>
            </div>
          </div>
          <div class="audit-nav">
            <button type="button" class="audit-back" data-back>&larr; Back</button>
            <button type="button" class="btn btn-primary" data-next data-validate="economics">Continue</button>
          </div>
        </div>

        <!-- Step 3: Time -->
        <div class="audit-step" data-step="3">
          <p class="audit-eyebrow">Your time</p>
          <h2 class="audit-question">How many hours a week disappear into admin?</h2>
          <p class="audit-step-help">
            Replying to inquiries, chasing bookings, invoicing, onboarding, reminders &mdash;
            everything that is not actually coaching or delivering.
          </p>
          <div class="audit-form-grid">
            <div class="form-field" id="field-audit-admin">
              <label for="audit-input-admin" class="form-label">Hours per week on admin</label>
              <input type="number" min="0" max="120" inputmode="numeric" id="audit-input-admin" class="form-input" placeholder="e.g. 10" required />
              <span class="form-error" role="alert">Please enter a number between 0 and 120.</span>
            </div>
          </div>
          <div class="audit-nav">
            <button type="button" class="audit-back" data-back>&larr; Back</button>
            <button type="button" class="btn btn-primary" data-next data-validate="admin">Continue</button>
          </div>
        </div>

        <!-- Step 4: Self-diagnosis (the reflection hook) -->
        <div class="audit-step" data-step="4">
          <p class="audit-eyebrow">Your own read</p>
          <h2 class="audit-question">Before we show you anything &mdash; what do <em>you</em> think is holding the business back most?</h2>
          <p class="audit-step-help">
            Commit to an answer. At the end we will show you whether the maths agrees.
          </p>
          <div class="audit-choices" data-question="diagnosis">
            ${DIAGNOSIS_OPTIONS.map(
              (o) => `
              <button type="button" class="audit-choice" data-diagnosis="${o.id}" data-label="${o.label.replace(/"/g, '&quot;')}">
                ${o.label}
              </button>`
            ).join('')}
          </div>
          <button type="button" class="audit-back" data-back>&larr; Back</button>
        </div>

        ${CHOICE_QUESTIONS.map((q, i) => choiceStepHTML(q, i)).join('')}

        <!-- Step 13: Email gate -->
        <div class="audit-step" data-step="13">
          <p class="audit-eyebrow">Last step</p>
          <h2 class="audit-question">Your results are ready</h2>
          <p class="audit-step-help">
            You will see everything on the next screen. We also send a written version,
            plus a personal review of your website and content &mdash; the two things
            a form cannot assess &mdash; within 24 hours.
          </p>
          <div class="audit-form-grid">
            <div class="form-field" id="field-audit-name">
              <label for="audit-input-name" class="form-label">Your name</label>
              <input type="text" id="audit-input-name" class="form-input" placeholder="Jane Doe" autocomplete="name" required />
              <span class="form-error" role="alert">Please enter your name.</span>
            </div>
            <div class="form-field" id="field-audit-email">
              <label for="audit-input-email" class="form-label">Email</label>
              <input type="email" id="audit-input-email" class="form-input" placeholder="you@yourbusiness.com" autocomplete="email" required />
              <span class="form-error" role="alert">Please enter a valid email.</span>
            </div>
            <div class="form-field" id="field-audit-website">
              <label for="audit-input-website" class="form-label">Website URL</label>
              <input type="text" id="audit-input-website" class="form-input" placeholder="yourbusiness.com" autocomplete="url" required />
              <span class="form-error" role="alert">Please enter your website URL.</span>
            </div>
            <div class="form-field" id="field-audit-instagram">
              <label for="audit-input-instagram" class="form-label">Instagram handle (optional)</label>
              <input type="text" id="audit-input-instagram" class="form-input" placeholder="@yourbusiness" />
            </div>
          </div>
          <div class="audit-nav">
            <button type="button" class="audit-back" data-back>&larr; Back</button>
            <button type="button" class="btn btn-primary" id="audit-submit-btn" data-next data-validate="contact">
              <span id="audit-submit-label">Show My Results</span>
            </button>
          </div>
          <p class="audit-hero-note">No spam, no list-selling. Unsubscribe any time.</p>
        </div>

        <!-- Step 14: Results -->
        <div class="audit-step" data-step="14">
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
  const answers = {};
  let diagnosis = null;
  let current = 0;

  const val = (id) => Number(document.getElementById(id).value);

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

  // --- Self-diagnosis + choice questions ---
  root.querySelectorAll('.audit-choices').forEach((group) => {
    const qid = group.dataset.question;
    group.querySelectorAll('.audit-choice').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.audit-choice').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        if (qid === 'diagnosis') {
          diagnosis = { id: btn.dataset.diagnosis, label: btn.dataset.label };
        } else {
          answers[qid] = { pts: Number(btn.dataset.pts), label: btn.dataset.label };
        }
        setTimeout(() => goTo(current + 1), 220);
      });
    });
  });

  // --- Validation ---
  function setError(fieldId, show) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.classList.toggle('has-error', show);
    const input = el.querySelector('input');
    if (input) input.classList.toggle('is-error', show);
  }

  function filled(id) {
    return document.getElementById(id).value !== '';
  }

  const VALIDATORS = {
    goal() {
      const curOk = filled('audit-input-current-rev') && val('audit-input-current-rev') >= 0;
      const goalOk = filled('audit-input-goal-rev') && val('audit-input-goal-rev') > 0;
      setError('field-audit-current-rev', !curOk);
      setError('field-audit-goal-rev', !goalOk);
      return curOk && goalOk;
    },
    economics() {
      const priceOk = filled('audit-input-price') && val('audit-input-price') > 0;
      const inqOk = filled('audit-input-inquiries') && val('audit-input-inquiries') > 0;
      const clientsOk =
        filled('audit-input-clients') &&
        val('audit-input-clients') >= 0 &&
        (!inqOk || val('audit-input-clients') <= val('audit-input-inquiries'));
      setError('field-audit-price', !priceOk);
      setError('field-audit-inquiries', !inqOk);
      setError('field-audit-clients', !clientsOk);
      return priceOk && inqOk && clientsOk;
    },
    admin() {
      const ok = filled('audit-input-admin') && val('audit-input-admin') >= 0 && val('audit-input-admin') <= 120;
      setError('field-audit-admin', !ok);
      return ok;
    },
    contact() {
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
    },
  };

  root.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const key = btn.dataset.validate;
      if (key && !VALIDATORS[key]()) return;
      if (key === 'contact') {
        await handleSubmit();
        return;
      }
      goTo(current + 1);
    });
  });

  /* ── The analysis engine ───────────────────────────────────────────── */
  function analyse() {
    const currentRev = val('audit-input-current-rev');
    const goalRev = val('audit-input-goal-rev');
    const price = val('audit-input-price');
    const inquiries = val('audit-input-inquiries');
    const clientsWon = val('audit-input-clients');
    const adminHours = val('audit-input-admin');

    // Systems score
    let totalPts = 0;
    const maxPts = CHOICE_QUESTIONS.length * 2;
    CHOICE_QUESTIONS.forEach((q) => {
      totalPts += answers[q.id] ? answers[q.id].pts : 0;
    });
    const score = Math.round((totalPts / maxPts) * 100);

    // Itemised leak — only from systems that are actually weak or broken.
    // A fully healthy set of systems produces a leak of exactly zero.
    const leakLines = [];
    let lostShare = 0;
    CHOICE_QUESTIONS.forEach((q) => {
      if (!q.leakShare) return;
      const pts = answers[q.id] ? answers[q.id].pts : 0;
      if (pts === 2) return;
      const share = pts === 1 ? q.leakShare / 2 : q.leakShare;
      lostShare += share;
      leakLines.push({
        label: q.leakLabel,
        share,
        clients: inquiries * share,
        value: inquiries * share * price,
        status: pts === 0 ? 'broken' : 'partial',
      });
    });
    const monthlyLeak = inquiries * lostShare * price;

    // Conversion reality
    const conversion = inquiries > 0 ? clientsWon / inquiries : 0;
    const impliedRev = clientsWon * price;

    // Capacity gap: can the current model reach the goal at all?
    const clientsNeeded = price > 0 ? goalRev / price : 0;
    const inquiriesNeededNow = conversion > 0 ? clientsNeeded / conversion : Infinity;
    const improvedConversion = Math.min(
      BEST_PRACTICE_CONVERSION,
      Math.max(conversion + lostShare, conversion)
    );
    const inquiriesNeededFixed = improvedConversion > 0 ? clientsNeeded / improvedConversion : Infinity;
    const reachableNow = Number.isFinite(inquiriesNeededNow) && inquiriesNeededNow <= inquiries;

    // Time cost
    const annualAdminHours = adminHours * 52;
    const adminWeeks = annualAdminHours / HOURS_PER_FULL_WEEK;

    // Reflection: score every candidate constraint and let the biggest one win,
    // rather than a priority cascade that always lands on the same answer.
    const clamp = (n) => Math.max(0, Math.min(1, n));
    const retentionPts = answers.retention ? answers.retention.pts : 0;
    const severities = {
      // Even at best-practice conversion, how far short is lead volume?
      leads: Number.isFinite(inquiriesNeededFixed) && inquiriesNeededFixed > inquiries
        ? clamp((inquiriesNeededFixed - inquiries) / inquiriesNeededFixed)
        : 0,
      // How much is leaking between inquiry and sale?
      conversion: clamp(lostShare / 0.20),
      // Renewals specifically
      retention: retentionPts === 0 ? 0.8 : retentionPts === 1 ? 0.4 : 0,
      // Admin load as a capacity ceiling
      admin: clamp(adminHours / 20),
      // Needing a very high client count implies the price is too low for the target
      pricing: clamp(clientsNeeded / 30),
    };
    const mathsSays = Object.entries(severities).sort((a, b) => b[1] - a[1])[0][0];
    const diagnosisMatches = diagnosis && diagnosis.id === mathsSays;

    // Verdict reasons on two independent axes so we never claim "your conversion is
    // fine" while also reporting a leak — that contradiction destroys credibility.
    const hasRealLeak = lostShare >= 0.05;
    const conversionHealthy = conversion >= BEST_PRACTICE_CONVERSION;
    let gapVerdictType;
    if (reachableNow) gapVerdictType = 'reachable';
    else if (conversionHealthy && !hasRealLeak) gapVerdictType = 'volume';
    else if (conversionHealthy && hasRealLeak) gapVerdictType = 'mixed';
    else gapVerdictType = 'blocked';
    const extraInquiriesNeeded = Number.isFinite(inquiriesNeededNow)
      ? Math.max(0, Math.ceil(inquiriesNeededNow) - inquiries)
      : null;

    // Priority fix = biggest single recoverable line
    const priority = leakLines.length
      ? CHOICE_QUESTIONS.find(
          (q) => q.leakLabel === leakLines.slice().sort((a, b) => b.value - a.value)[0].label
        )
      : null;

    // Pillar rollup
    const pillarGroups = {};
    CHOICE_QUESTIONS.forEach((q) => {
      if (!pillarGroups[q.pillar]) pillarGroups[q.pillar] = [];
      pillarGroups[q.pillar].push(answers[q.id] ? answers[q.id].pts : 0);
    });
    const pillarResults = Object.entries(pillarGroups).map(([pillar, pts]) => {
      const avg = pts.reduce((a, b) => a + b, 0) / pts.length;
      const status = avg < 0.8 ? 'red' : avg < 1.6 ? 'yellow' : 'green';
      return {
        pillar,
        status,
        statusLabel: status === 'red' ? 'Needs work' : status === 'yellow' ? 'Partial' : 'Solid',
      };
    });

    return {
      currentRev, goalRev, price, inquiries, clientsWon, adminHours,
      score, monthlyLeak, leakLines, lostShare,
      conversion, impliedRev,
      clientsNeeded, inquiriesNeededNow, inquiriesNeededFixed, improvedConversion, reachableNow,
      annualAdminHours, adminWeeks,
      mathsSays, diagnosisMatches, priority, pillarResults,
      gapVerdictType, extraInquiriesNeeded, severities,
    };
  }

  function renderResults(r) {
    const pct = (x) => (x * 100).toFixed(x < 0.1 ? 1 : 0) + '%';
    const container = document.getElementById('audit-results');

    /* Gap verdict — the centrepiece. Three genuinely different diagnoses. */
    const VERDICTS = {
      reachable: `
        <p class="audit-verdict-line audit-verdict-line--ok">
          Your current model <strong>can</strong> reach ${euro(r.goalRev)}/month with the inquiries
          you already get. You do not have a lead problem &mdash; the constraint is purely how many
          of them you convert and keep.
        </p>`,
      volume: `
        <p class="audit-verdict-line audit-verdict-line--info">
          Your conversion rate is already at best practice and nothing significant is leaking,
          so this is <strong>a lead-volume gap, not a systems gap</strong>.
          ${r.extraInquiriesNeeded !== null
            ? `You need roughly <strong>${r.extraInquiriesNeeded} more inquiries a month</strong> to hit ${euro(r.goalRev)}.`
            : ''}
          Fixing systems will not close this one &mdash; more traffic will.
        </p>`,
      mixed: `
        <p class="audit-verdict-line audit-verdict-line--info">
          Two things are true at once. Your headline conversion rate is respectable
          &mdash; but the systems below are still leaking
          <strong>${euro(r.monthlyLeak)}/month</strong>, so that rate is lower than it should be.
          ${r.extraInquiriesNeeded !== null
            ? `You are also short about <strong>${r.extraInquiriesNeeded} inquiries a month</strong> for ${euro(r.goalRev)}.`
            : ''}
          Plug the leak first &mdash; it is cheaper than buying the extra traffic.
        </p>`,
      blocked: `
        <p class="audit-verdict-line audit-verdict-line--warn">
          At your current conversion rate, your model <strong>cannot</strong> reach
          ${euro(r.goalRev)}/month &mdash; not by working harder.
          ${Number.isFinite(r.inquiriesNeededNow)
            ? `It would take <strong>${Math.ceil(r.inquiriesNeededNow)} inquiries a month</strong>. You get ${r.inquiries}.`
            : 'With no conversions recorded yet, there is no rate to scale from.'}
        </p>`,
    };
    const gapVerdict = VERDICTS[r.gapVerdictType];

    const gapTable = `
      <div class="audit-math">
        <div class="audit-math-row">
          <span>Your target</span><span>${euro(r.goalRev)} / month</span>
        </div>
        <div class="audit-math-row">
          <span>Divided by your average client value</span><span>${euro(r.price)}</span>
        </div>
        <div class="audit-math-row audit-math-row--result">
          <span>Clients you need per month</span><span>${Math.ceil(r.clientsNeeded)}</span>
        </div>
        <div class="audit-math-row">
          <span>Your actual conversion rate today</span>
          <span>${r.clientsWon} of ${r.inquiries} = <strong>${pct(r.conversion)}</strong></span>
        </div>
        <div class="audit-math-row audit-math-row--result">
          <span>So inquiries needed at today's rate</span>
          <span>${Number.isFinite(r.inquiriesNeededNow) ? Math.ceil(r.inquiriesNeededNow) : '—'} / month</span>
        </div>
        <div class="audit-math-row">
          <span>But at a ${pct(r.improvedConversion)} conversion rate</span>
          <span>only ${Number.isFinite(r.inquiriesNeededFixed) ? Math.ceil(r.inquiriesNeededFixed) : '—'} / month</span>
        </div>
      </div>
      ${
        Number.isFinite(r.inquiriesNeededNow) && Number.isFinite(r.inquiriesNeededFixed)
          ? `<p class="audit-note">
               That is the whole point: fixing conversion removes
               <strong>${Math.max(0, Math.ceil(r.inquiriesNeededNow) - Math.ceil(r.inquiriesNeededFixed))} inquiries a month</strong>
               of pressure from your marketing. Cheaper than finding them.
             </p>`
          : ''
      }
    `;

    /* Leak breakdown */
    const leakSection = r.leakLines.length
      ? `
        <div class="audit-math">
          ${r.leakLines
            .map(
              (l) => `
            <div class="audit-math-row">
              <span>${l.label}
                <em class="audit-assumption">assumes ${pct(l.share)} of inquiries</em>
              </span>
              <span>${euro(l.value)}</span>
            </div>`
            )
            .join('')}
          <div class="audit-math-row audit-math-row--result">
            <span>Estimated monthly leak</span><span>${euro(r.monthlyLeak)}</span>
          </div>
        </div>
        <p class="audit-note">
          Every line above is only counted where you told us the system is missing or partial.
          The percentages are deliberately conservative &mdash; the real figure is usually higher.
        </p>`
      : `<p class="audit-note audit-note--good">
           Nothing to report here. Based on your answers, none of the six systems we measure
           are leaking revenue &mdash; which is genuinely rare.
         </p>`;

    /* Forward projection */
    const projection = r.monthlyLeak > 0
      ? `
        <p class="audit-section-title">If nothing changes</p>
        <div class="audit-projection">
          <div class="audit-projection-card">
            <div class="audit-projection-num">${euro(r.monthlyLeak * 12)}</div>
            <div class="audit-projection-label">over the next 12 months</div>
          </div>
          <div class="audit-projection-card audit-projection-card--severe">
            <div class="audit-projection-num">${euro(r.monthlyLeak * 36)}</div>
            <div class="audit-projection-label">over the next 3 years</div>
          </div>
        </div>`
      : '';

    /* Time cost */
    const timeSection = r.adminHours > 0
      ? `
        <p class="audit-section-title">What admin is costing you</p>
        <div class="audit-math">
          <div class="audit-math-row">
            <span>${r.adminHours} hours a week on admin</span><span>${Math.round(r.annualAdminHours)} hours a year</span>
          </div>
          <div class="audit-math-row audit-math-row--result">
            <span>That is</span><span>${r.adminWeeks.toFixed(1)} full working weeks a year</span>
          </div>
        </div>
        <p class="audit-note">
          Not lost money &mdash; lost capacity. That is time you could have spent on the
          ${Math.ceil(r.clientsNeeded)} clients your target needs.
        </p>`
      : '';

    /* Reflection */
    const reflection = diagnosis
      ? `
        <p class="audit-section-title">Your read vs. the numbers</p>
        <div class="audit-reflection ${r.diagnosisMatches ? 'is-match' : 'is-mismatch'}">
          <p><span>You said:</span> ${diagnosis.label}</p>
          <p><span>The maths points at:</span> ${
            { leads: 'Not enough inquiries reaching you',
              conversion: 'Inquiries arriving but leaking out before they convert',
              retention: 'Clients not staying long enough',
              admin: 'Admin load capping how much you can take on',
              pricing: 'Your price being too low for the target you set' }[r.mathsSays]
          }</p>
          <p class="audit-reflection-verdict">${
            r.diagnosisMatches
              ? 'Your instinct matches the data. That is a good sign &mdash; you know your business.'
              : 'These do not match. That gap is usually the most valuable thing an audit surfaces.'
          }</p>
        </div>`
      : '';

    /* Priority fix */
    const priorityFix = r.priority
      ? `
        <p class="audit-section-title">Start here</p>
        <div class="audit-priority">
          <div class="audit-priority-head">
            <h3>${r.priority.fix}</h3>
            <span class="audit-pill audit-pill--green">${r.priority.effort}</span>
          </div>
          <p>This is the single biggest recoverable line in your breakdown above. It addresses
             <strong>${r.priority.pillar}</strong> and is typically the fastest to put in place.</p>
        </div>`
      : '';

    const pillarHTML = r.pillarResults
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
          <span class="audit-pill audit-pill--pending">Reviewed within 24h</span>
        </div>`
      )
      .join('');

    const ownerName = document.getElementById('audit-input-name').value.trim();
    const site = document.getElementById('audit-input-website').value.trim();
    const today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    container.innerHTML = `
      <div class="audit-print-header">
        <div class="audit-print-brand">SCOUTRA</div>
        <div>
          <strong>Client-Getting Systems Audit</strong><br />
          ${ownerName ? ownerName + ' &middot; ' : ''}${site}<br />
          ${today}
        </div>
      </div>

      <div class="audit-score-ring" style="background: conic-gradient(#4ade80 0% ${r.score}%, var(--border) ${r.score}% 100%);">
        <div class="audit-score-inner">
          <div class="audit-score-num">${r.score}</div>
          <div class="audit-score-label">systems score</div>
        </div>
      </div>
      <p class="audit-score-context">
        Measured against best practice across six systems &mdash; not an industry average.
        ${r.score >= 80 ? 'Strong foundation.' : r.score >= 50 ? 'Workable, with real gaps.' : 'Most of the machinery is missing.'}
      </p>

      <p class="audit-section-title">Can you get there from here?</p>
      ${gapVerdict}
      ${gapTable}

      <p class="audit-section-title">Where the money is going</p>
      ${leakSection}
      ${projection}
      ${timeSection}
      ${reflection}
      ${priorityFix}

      <p class="audit-section-title">Systems breakdown</p>
      <div class="audit-results-list">${pillarHTML}</div>

      <p class="audit-section-title">Still to review, personally</p>
      <div class="audit-results-list">${pendingHTML}</div>

      <p class="audit-section-title">What happens next</p>
      <ol class="audit-next-steps">
        <li>
          <strong>Right now &mdash; keep this.</strong>
          Download a copy so you can come back to it or send it to a business partner.
          <span class="audit-save-actions">
            <button type="button" class="btn btn-secondary audit-save-btn" id="audit-download-btn">
              <span id="audit-download-label">Download PDF</span>
            </button>
            <button type="button" class="audit-print-link" id="audit-print-btn">or print this page</button>
          </span>
        </li>
        <li>
          <strong>Within 24 hours &mdash; the human half.</strong>
          A written review of your website and content, which is the part a form
          genuinely cannot assess. That is a person looking at your actual site,
          not an automated scan.
        </li>
        <li>
          <strong>Then, only if you want it.</strong>
          A 15-minute walkthrough of the priority fix. No pitch and no obligation
          &mdash; if the report is all you needed, that is a fine outcome.
        </li>
      </ol>

      <div class="audit-cta">
        <p>
          If you would rather just talk it through, book a slot directly.
        </p>
        <a class="btn btn-primary" href="/#apply">Book a 15-min walkthrough</a>
      </div>
    `;

    const printBtn = document.getElementById('audit-print-btn');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    // jsPDF is ~100kB gzipped, so it is only fetched if someone actually downloads.
    const downloadBtn = document.getElementById('audit-download-btn');
    const downloadLabel = document.getElementById('audit-download-label');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        downloadBtn.disabled = true;
        if (downloadLabel) downloadLabel.textContent = 'Preparing...';
        try {
          const { downloadAuditPdf } = await import('../utils/auditPdf.js');
          await downloadAuditPdf(r, {
            owner: ownerName,
            site,
            date: today,
            diagnosisLabel: diagnosis ? diagnosis.label : null,
          });
          if (downloadLabel) downloadLabel.textContent = 'Downloaded';
        } catch (err) {
          console.error('PDF generation failed:', err);
          // Fall back to the print stylesheet rather than leaving them stuck.
          if (downloadLabel) downloadLabel.textContent = 'Use print instead';
          window.print();
        } finally {
          downloadBtn.disabled = false;
          setTimeout(() => {
            if (downloadLabel) downloadLabel.textContent = 'Download PDF';
          }, 2500);
        }
      });
    }
  }

  async function handleSubmit() {
    const submitBtn = document.getElementById('audit-submit-btn');
    const submitLabel = document.getElementById('audit-submit-label');
    submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Calculating...';

    const r = analyse();

    const answerSummary = CHOICE_QUESTIONS.reduce((acc, q) => {
      acc[`${q.pillar} — ${q.text}`] = answers[q.id] ? answers[q.id].label : '(skipped)';
      return acc;
    }, {});

    try {
      await submitAuditQuiz({
        name: document.getElementById('audit-input-name').value,
        email: document.getElementById('audit-input-email').value,
        website: document.getElementById('audit-input-website').value,
        instagram: document.getElementById('audit-input-instagram').value,
        score: r.score,
        leakEstimate: Math.round(r.monthlyLeak),
        monthlyInquiries: r.inquiries,
        avgClientValue: r.price,
        answers: {
          'Current monthly revenue': euro(r.currentRev),
          'Goal monthly revenue': euro(r.goalRev),
          'Clients won per month': r.clientsWon,
          'Actual conversion rate': (r.conversion * 100).toFixed(1) + '%',
          'Clients needed for goal': Math.ceil(r.clientsNeeded),
          'Inquiries needed at current rate': Number.isFinite(r.inquiriesNeededNow)
            ? Math.ceil(r.inquiriesNeededNow)
            : 'n/a',
          'Goal reachable on current model': r.reachableNow ? 'Yes' : 'No',
          'Admin hours per week': r.adminHours,
          'Admin weeks per year': r.adminWeeks.toFixed(1),
          'Annual leak projection': euro(r.monthlyLeak * 12),
          'Self-diagnosis': diagnosis ? diagnosis.label : '(skipped)',
          'Maths points at': r.mathsSays,
          'Self-diagnosis matches maths': r.diagnosisMatches ? 'Yes' : 'No',
          'Priority fix': r.priority ? r.priority.fix : 'None — systems healthy',
          ...answerSummary,
        },
      });
    } catch (err) {
      console.warn('Audit submission failed:', err);
      // Never block the prospect on our email plumbing.
    }

    submitBtn.disabled = false;
    if (submitLabel) submitLabel.textContent = 'Show My Results';

    renderResults(r);
    goTo(14);
  }

  goTo(0);
}
