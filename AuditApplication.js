import { submitAudit } from "api.js";

export default function AuditApplication() {
  return `
    <section id="audit-application" class="py-24 bg-brand-dark border-t border-white/5">
        <div class="max-w-2xl mx-auto px-6">
            
            <div class="mb-10 text-center">
                <div class="inline-block px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent text-xs font-bold tracking-widest uppercase mb-4">
                    Limited Availability
                </div>
                <h2 class="text-4xl font-display font-bold text-white mb-4">Apply for an Audit</h2>
                <p class="text-gray-400">
                    We only work with 5 new businesses per month to ensure quality.
                </p>
            </div>

            <form id="auditForm" class="space-y-6 bg-brand-gray/10 p-8 rounded-xl border border-white/5">
                
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-300">Full Name</label>
                        <input type="text" name="name" required class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all placeholder-gray-700" placeholder="Founder Name">
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-300">Business Email</label>
                        <input type="email" name="email" required class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all placeholder-gray-700" placeholder="you@company.com">
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-300">Company Website</label>
                    <input type="url" name="website" required class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all placeholder-gray-700" placeholder="https://">
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-300">Current Monthly Revenue</label>
                    <select name="revenue" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all">
                        <option value="" disabled selected>Select Range</option>
                        <option value="<10k">Less than €10k</option>
                        <option value="10k-50k">€10k - €50k (Sweet Spot)</option>
                        <option value="50k-100k">€50k - €100k</option>
                        <option value="100k+">€100k+</option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-300">What is the #1 manual task you hate doing?</label>
                    <textarea name="bottleneck" rows="3" required class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all placeholder-gray-700" placeholder="e.g. Manually matching Shopify orders to invoices..."></textarea>
                </div>

                <button type="submit" id="submitBtn" class="w-full py-4 bg-brand-accent text-brand-dark font-bold text-lg rounded-lg hover:bg-white transition-all transform hover:scale-[1.01] shadow-[0_0_20px_rgba(102,252,241,0.2)]">
                    Analyze My Opportunities
                </button>

                <div id="formFeedback" class="hidden text-center text-sm p-4 rounded bg-green-500/10 text-green-400 border border-green-500/20"></div>

            </form>
        </div>
    </section>
    `;
}

// Logic to handle submission
export function initAuditForm() {
  const form = document.getElementById("auditForm");
  const btn = document.getElementById("submitBtn");
  const feedback = document.getElementById("formFeedback");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // UI Loading State
    const originalText = btn.innerText;
    btn.innerText = "Processing Data...";
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");

    // Gather Data
    const formData = Object.fromEntries(new FormData(form).entries());

    // Send to API
    const result = await submitAudit(formData);

    if (result.success) {
      form.reset();
      feedback.innerHTML =
        "✅ <strong>Application Received.</strong> We are reviewing your site and will email you within 24 hours.";
      feedback.classList.remove("hidden");
      btn.innerText = "Sent";
    } else {
      feedback.innerHTML =
        "⚠️ <strong>System Error.</strong> Please try again or email us directly.";
      feedback.classList.remove(
        "hidden",
        "bg-green-500/10",
        "text-green-400",
        "border-green-500/20",
      );
      feedback.classList.add(
        "bg-red-500/10",
        "text-red-400",
        "border-red-500/20",
      );
      btn.innerText = originalText;
      btn.disabled = false;
      btn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
}
