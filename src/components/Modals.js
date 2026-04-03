/**
 * Modals — Privacy Policy & Terms of Service overlays.
 * Opened via data-modal-open="privacy" / data-modal-open="terms".
 * Closed via backdrop click, close button, or Escape key.
 */

export default function Modals() {
  return `
    <!-- Privacy Policy Modal -->
    <div
      id="modal-privacy"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-privacy-title"
      hidden
    >
      <div class="modal-box">
        <div class="modal-header">
          <h2 id="modal-privacy-title" class="modal-title">Privacy Policy</h2>
          <button class="modal-close" data-modal-close aria-label="Close Privacy Policy">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">

          <p class="modal-updated">Last updated: April 2025</p>

          <h3>1. Who We Are</h3>
          <p>
            Scoutra ("we", "us", "our") is an AI automation consultancy. For the purposes of
            EU data protection law, Scoutra is the <strong>data controller</strong> of the
            personal data you submit through this website.
            Contact us at <a href="mailto:hello@scoutra.co">hello@scoutra.co</a>.
          </p>

          <h3>2. What Data We Collect</h3>
          <p>When you submit the free audit form, we collect:</p>
          <ul>
            <li><strong>Full name</strong></li>
            <li><strong>Work email address</strong></li>
            <li><strong>Company website or project description</strong></li>
          </ul>
          <p>We do not collect any special categories of personal data (Article 9 GDPR).</p>

          <h3>3. Why We Collect It &amp; Legal Basis</h3>
          <p>
            We collect your data to evaluate your audit request and follow up with a personalised
            response within 24 hours. The legal basis for this processing is your
            <strong>explicit consent</strong> (Article 6(1)(a) GDPR), given when you tick the
            consent checkbox on the form. You may withdraw this consent at any time by emailing
            <a href="mailto:hello@scoutra.co">hello@scoutra.co</a>.
          </p>

          <h3>4. AI Processing Disclosure</h3>
          <p>
            In preparing our audit responses we may use AI tools (including large-language model
            services provided by Anthropic, Inc.) to assist in analysing the business information
            you submit. This processing is used solely to improve the quality and speed of our
            response and does not produce any automated decision with legal or similarly significant
            effects on you (Article 22 GDPR). A human at Scoutra reviews every audit before we
            respond.
          </p>

          <h3>5. How Long We Keep Your Data</h3>
          <p>
            We retain your contact details for up to <strong>24 months</strong> after your last
            interaction with us, or until you ask us to delete them, whichever comes first.
          </p>

          <h3>6. Who We Share Your Data With</h3>
          <p>We use the following processors who act under our instruction:</p>
          <ul>
            <li><strong>Google LLC</strong> — form submission and email infrastructure (Google Workspace). Google's servers are covered by Standard Contractual Clauses for EU transfers.</li>
            <li><strong>Anthropic, Inc.</strong> — AI analysis assistance. Data shared is limited to business context you provide; it is not used to train Anthropic's models under our usage terms.</li>
          </ul>
          <p>We do not sell your data or share it with any third party for marketing purposes.</p>

          <h3>7. Your Rights Under GDPR</h3>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> the personal data we hold about you (Article 15)</li>
            <li><strong>Rectify</strong> inaccurate data (Article 16)</li>
            <li><strong>Erase</strong> your data ("right to be forgotten") (Article 17)</li>
            <li><strong>Restrict</strong> processing in certain circumstances (Article 18)</li>
            <li><strong>Data portability</strong> — receive your data in a machine-readable format (Article 20)</li>
            <li><strong>Object</strong> to processing based on legitimate interests (Article 21)</li>
            <li><strong>Withdraw consent</strong> at any time without affecting the lawfulness of prior processing</li>
            <li><strong>Lodge a complaint</strong> with your national supervisory authority (e.g., the Dutch AP at <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">autoriteitpersoonsgegevens.nl</a>)</li>
          </ul>
          <p>To exercise any of these rights, email us at <a href="mailto:hello@scoutra.co">hello@scoutra.co</a>. We will respond within 30 days.</p>

          <h3>8. Cookies</h3>
          <p>
            This website does not currently use tracking cookies or third-party analytics scripts.
          </p>

          <h3>9. Changes to This Policy</h3>
          <p>
            We may update this policy from time to time. Material changes will be indicated by
            updating the "Last updated" date above. Continued use of our services after such
            changes constitutes acceptance of the new policy.
          </p>

        </div>
      </div>
    </div>

    <!-- Terms of Service Modal -->
    <div
      id="modal-terms"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-terms-title"
      hidden
    >
      <div class="modal-box">
        <div class="modal-header">
          <h2 id="modal-terms-title" class="modal-title">Terms of Service</h2>
          <button class="modal-close" data-modal-close aria-label="Close Terms of Service">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">

          <p class="modal-updated">Last updated: April 2025</p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By submitting the free audit application form on scoutra.co you agree to these Terms
            of Service. If you do not agree, do not submit the form.
          </p>

          <h3>2. The Free Audit Service</h3>
          <p>
            Scoutra offers a complimentary, no-obligation business automation audit. Submitting
            this form is an <strong>expression of interest only</strong> — it does not constitute
            a binding contract or guarantee that Scoutra will provide any services to you.
            We review all applications individually and reserve the right to decline any request.
          </p>

          <h3>3. Accuracy of Information</h3>
          <p>
            You confirm that all information you provide in the audit form is accurate and
            relates to a business or project you are authorised to represent.
          </p>

          <h3>4. AI-Assisted Analysis</h3>
          <p>
            Scoutra uses AI tools to assist in preparing audit analyses. In accordance with the
            <strong>EU AI Act</strong> (Regulation (EU) 2024/1689), we disclose that our internal
            tooling uses general-purpose AI models as a support layer. All AI-generated outputs
            are reviewed and validated by a human consultant before delivery.
            AI analysis does not replace professional legal, financial, or operational advice.
          </p>

          <h3>5. Intellectual Property</h3>
          <p>
            Any audit report, analysis document, or recommendation Scoutra delivers to you
            is the intellectual property of Scoutra unless otherwise agreed in a separate written
            engagement agreement. You may use delivered materials for internal business purposes only.
          </p>

          <h3>6. Limitation of Liability</h3>
          <p>
            The free audit is provided "as is" and for informational purposes only.
            Scoutra makes no warranties, express or implied, regarding the completeness or
            accuracy of the analysis. To the maximum extent permitted by applicable law, Scoutra
            shall not be liable for any direct, indirect, incidental, or consequential damages
            arising from your reliance on audit findings.
          </p>

          <h3>7. Governing Law</h3>
          <p>
            These Terms are governed by and construed in accordance with the laws of
            the <strong>European Union</strong> and, where applicable, the laws of
            the Netherlands. Any disputes shall be subject to the exclusive jurisdiction
            of the competent courts in the Netherlands.
          </p>

          <h3>8. Contact</h3>
          <p>
            For any questions about these Terms, contact us at
            <a href="mailto:hello@scoutra.co">hello@scoutra.co</a>.
          </p>

        </div>
      </div>
    </div>
  `;
}

export function initModals() {
  // Open triggers
  document.querySelectorAll('[data-modal-open]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const id = trigger.getAttribute('data-modal-open');
      openModal(id);
    });
  });

  // Close triggers (buttons inside modals)
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Backdrop click to close
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function openModal(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (!modal) return;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  // Focus the close button for accessibility
  const closeBtn = modal.querySelector('[data-modal-close]');
  if (closeBtn) closeBtn.focus();
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => {
    m.setAttribute('hidden', '');
  });
  document.body.style.overflow = '';
}
