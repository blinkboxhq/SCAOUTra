export default function Protocol() {
  return `
    <section id="protocol" class="py-24 bg-[#0A0A0A] border-y border-white/5">
        <div class="max-w-7xl mx-auto px-6">
            <div class="mb-16 md:flex md:justify-between md:items-end">
                <div class="max-w-xl">
                    <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-4">The Deployment Protocol</h2>
                    <p class="text-gray-400">We don't do "consulting." We install infrastructure. Our 3-step process ensures rapid ROI without disrupting your daily operations.</p>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <div class="glass-panel p-8 rounded-xl relative overflow-hidden group hover:border-brand-accent/50 transition-colors">
                    <div class="absolute top-0 right-0 p-4 opacity-10 font-display text-6xl font-bold">01</div>
                    <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 text-2xl mb-6">🔍</div>
                    <h3 class="text-xl font-bold text-white mb-3">Diagnostic Audit</h3>
                    <p class="text-sm text-gray-400 leading-relaxed">We map your entire workflow to find the "bleeding neck"—the one manual task costing you the most money. We deliver a ranked roadmap of opportunities.</p>
                </div>

                <div class="glass-panel p-8 rounded-xl relative overflow-hidden group hover:border-brand-accent/50 transition-colors">
                    <div class="absolute top-0 right-0 p-4 opacity-10 font-display text-6xl font-bold">02</div>
                    <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 text-2xl mb-6">⚡</div>
                    <h3 class="text-xl font-bold text-white mb-3">Architecture & Build</h3>
                    <p class="text-sm text-gray-400 leading-relaxed">We build the solution using enterprise-grade tools (n8n, OpenAI, Zapier). We test it in a sandbox environment so your live business is never at risk.</p>
                </div>

                <div class="glass-panel p-8 rounded-xl relative overflow-hidden group hover:border-brand-accent/50 transition-colors">
                    <div class="absolute top-0 right-0 p-4 opacity-10 font-display text-6xl font-bold">03</div>
                    <div class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 text-2xl mb-6">🚀</div>
                    <h3 class="text-xl font-bold text-white mb-3">Deployment & Handoff</h3>
                    <p class="text-sm text-gray-400 leading-relaxed">We flip the switch. Then, we train your team on how to use the new system. You get 30 days of monitoring to ensure 100% uptime.</p>
                </div>
            </div>
        </div>
    </section>
    `;
}
