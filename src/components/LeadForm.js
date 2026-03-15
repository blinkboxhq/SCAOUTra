/**
 * LeadForm — split-screen lead capture form.
 * Layout inspired by RideBookingForm: dashed vertical lines, testimonial panel on left.
 * Connects to the existing submitAudit() function.
 */
import { submitAudit } from '../api.js';

export default function LeadForm() {
  return `
    <section
      id="apply"
      class="lead-form-section"
      aria-labelledby="form-heading"
    >
      <div class="lead-form-wrapper">

        <!-- ========== Left: Visual panel ========== -->
        <div class="lead-form-visual" aria-hidden="true">

          <!-- Decorative dashed vertical lines -->
          <div class="lead-dashed-lines">
            <span class="lead-dashed-line"></span>
            <span class="lead-dashed-line"></span>
            <span class="lead-dashed-line"></span>
            <span class="lead-dashed-line"></span>
          </div>

          <!-- Content -->
          <div class="lead-visual-content">
            <div class="badge mb-8">
              <span class="badge__dot"></span>
              5 Spots Left This Month
            </div>

            <blockquote class="lead-visual-quote">
              "Scoutra saved us over 20 hours a week. The automation is rock-solid
              and the handoff was seamless — we were up and running in less than 30 days."
            </blockquote>

            <div class="lead-visual-author">
              <div class="lead-author-avatar">JM</div>
              <div>
                <div class="lead-author-name">Jamie M.</div>
                <div class="lead-author-role">Operations Director</div>
              </div>
            </div>

            <div class="lead-visual-stats">
              <div class="lead-visual-stat">
                <div class="lead-stat-value">20h</div>
                <div class="lead-stat-label">saved per week</div>
              </div>
              <div class="lead-visual-stat">
                <div class="lead-stat-value">30d</div>
                <div class="lead-stat-label">to deployment</div>
              </div>
              <div class="lead-visual-stat">
                <div class="lead-stat-value">10x</div>
                <div class="lead-stat-label">avg. Year 1 ROI</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== Right: Form panel ========== -->
        <div class="lead-form-panel">

          <div class="mb-8" data-reveal>
            <div class="badge mb-5">Free Audit</div>
            <h2
              id="form-heading"
              class="text-3xl md:text-4xl font-display font-bold text-ink-primary mb-3"
            >
              Apply for a Free Audit
            </h2>
            <p class="text-ink-secondary leading-relaxed text-sm">
              We personally review every application and respond within 24 hours.
              We only work with 5 new businesses per month to ensure delivery quality.
            </p>
          </div>

          <div data-reveal data-reveal-delay="1">
            <form
              id="audit-form"
              novalidate
              aria-label="Audit application form"
              class="flex flex-col gap-5"
            >

              <!-- Full Name -->
              <div class="form-field" id="field-name">
                <label for="input-name" class="form-label">
                  Full Name <span class="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="input-name"
                  name="name"
                  class="form-input"
                  placeholder="Aaina Smith"
                  autocomplete="name"
                  required
                  aria-required="true"
                  aria-describedby="error-name"
                />
                <span
                  id="error-name"
                  class="form-error"
                  role="alert"
                  aria-live="polite"
                >Please enter your full name.</span>
              </div>

              <!-- Work Email -->
              <div class="form-field" id="field-email">
                <label for="input-email" class="form-label">
                  Work Email <span class="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="input-email"
                  name="email"
                  class="form-input"
                  placeholder="you@company.com"
                  autocomplete="email"
                  required
                  aria-required="true"
                  aria-describedby="error-email"
                />
                <span
                  id="error-email"
                  class="form-error"
                  role="alert"
                  aria-live="polite"
                >Please enter a valid work email.</span>
              </div>

              <!-- Company Website / Project Details -->
              <div class="form-field" id="field-website">
                <label for="input-website" class="form-label">
                  Company Website / Project Details
                  <span class="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="input-website"
                  name="website"
                  class="form-input"
                  placeholder="yourcompany.com or describe your project"
                  autocomplete="url"
                  required
                  aria-required="true"
                  aria-describedby="error-website"
                />
                <span
                  id="error-website"
                  class="form-error"
                  role="alert"
                  aria-live="polite"
                >Please enter your website URL or describe your project (min. 10 chars).</span>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                id="submit-btn"
                class="btn btn-primary w-full mt-2"
                aria-describedby="form-status"
              >
                <span id="btn-label">Submit Application</span>
                <svg
                  id="btn-spinner"
                  class="hidden animate-spin"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"/>
                  <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                </svg>
              </button>

            </form>

            <!-- Status message -->
            <div
              id="form-status"
              class="hidden mt-5 rounded-xl p-5 text-sm font-medium leading-relaxed"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            ></div>

            <!-- Trust signals -->
            <p class="mt-5 text-xs text-ink-muted flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1l1.5 3 3.5.5-2.5 2.5.5 3.5L7 9l-3 1.5.5-3.5L2 4.5 5.5 4z" fill="#52525b"/>
              </svg>
              No spam. No commitment. We'll only reach out if we can genuinely help.
            </p>
          </div>

        </div><!-- /.lead-form-panel -->
      </div><!-- /.lead-form-wrapper -->
    </section>
  `;
}

export function initLeadForm() {
  const form      = document.getElementById('audit-form');
  const btn       = document.getElementById('submit-btn');
  const btnLabel  = document.getElementById('btn-label');
  const spinner   = document.getElementById('btn-spinner');
  const statusBox = document.getElementById('form-status');

  if (!form) return;

  // --- Field helpers ---

  function getField(name) {
    return {
      wrapper: document.getElementById(`field-${name}`),
      input:   document.getElementById(`input-${name}`),
    };
  }

  function setFieldError(name, show) {
    const { wrapper, input } = getField(name);
    if (show) {
      wrapper.classList.add('has-error');
      input.classList.add('is-error');
      input.classList.remove('is-success');
      input.setAttribute('aria-invalid', 'true');
    } else {
      wrapper.classList.remove('has-error');
      input.classList.remove('is-error');
      input.setAttribute('aria-invalid', 'false');
    }
  }

  function setFieldSuccess(name) {
    const { input } = getField(name);
    input.classList.add('is-success');
    input.classList.remove('is-error');
    input.setAttribute('aria-invalid', 'false');
  }

  // --- Validators ---

  function validateName(val) {
    return val.trim().length >= 2;
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
  }

  // Accepts a valid URL *or* a text description of at least 10 characters.
  function validateWebsite(val) {
    const v = val.trim();
    if (v.length >= 10) return true;
    try {
      const url = new URL(v.startsWith('http') ? v : `https://${v}`);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  // --- Live blur validation ---

  const nameInput    = document.getElementById('input-name');
  const emailInput   = document.getElementById('input-email');
  const websiteInput = document.getElementById('input-website');

  nameInput.addEventListener('blur', () => {
    if (!nameInput.value) return;
    const ok = validateName(nameInput.value);
    setFieldError('name', !ok);
    if (ok) setFieldSuccess('name');
  });

  emailInput.addEventListener('blur', () => {
    if (!emailInput.value) return;
    const ok = validateEmail(emailInput.value);
    setFieldError('email', !ok);
    if (ok) setFieldSuccess('email');
  });

  websiteInput.addEventListener('blur', () => {
    if (!websiteInput.value) return;
    const ok = validateWebsite(websiteInput.value);
    setFieldError('website', !ok);
    if (ok) setFieldSuccess('website');
  });

  // --- Submit ---

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = nameInput.value;
    const email   = emailInput.value;
    const website = websiteInput.value;

    const nameOk    = validateName(name);
    const emailOk   = validateEmail(email);
    const websiteOk = validateWebsite(website);

    setFieldError('name',    !nameOk);
    setFieldError('email',   !emailOk);
    setFieldError('website', !websiteOk);

    if (nameOk)    setFieldSuccess('name');
    if (emailOk)   setFieldSuccess('email');
    if (websiteOk) setFieldSuccess('website');

    if (!nameOk || !emailOk || !websiteOk) {
      if (!nameOk)        nameInput.focus();
      else if (!emailOk)  emailInput.focus();
      else                websiteInput.focus();
      return;
    }

    // Loading state
    btnLabel.textContent = 'Submitting…';
    spinner.classList.remove('hidden');
    btn.disabled = true;
    statusBox.classList.add('hidden');

    const result = await submitAudit({ name, email, website });

    spinner.classList.add('hidden');
    btn.disabled = false;

    if (result.success) {
      btnLabel.textContent = 'Application Sent ✓';
      statusBox.className  = 'mt-5 rounded-xl p-5 text-sm font-medium leading-relaxed';
      statusBox.style.cssText =
        'background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.22); color: #6ee7b7;';
      statusBox.innerHTML = `
        <strong>Application received.</strong> We've logged your details and will personally review your
        business. Expect to hear from us within 24 hours.
      `;
      statusBox.classList.remove('hidden');
      form.reset();
      ['name', 'email', 'website'].forEach(n => {
        const { input } = getField(n);
        input.classList.remove('is-success', 'is-error');
      });
      statusBox.focus();
    } else {
      btnLabel.textContent = 'Submit Application';
      statusBox.className  = 'mt-5 rounded-xl p-5 text-sm font-medium leading-relaxed';
      statusBox.style.cssText =
        'background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.22); color: #fca5a5;';
      statusBox.innerHTML = `
        <strong>Something went wrong.</strong> Please try again, or email us directly
        at <a href="mailto:hello@scoutra.co" class="underline">hello@scoutra.co</a>.
      `;
      statusBox.classList.remove('hidden');
      statusBox.focus();
    }
  });
}
