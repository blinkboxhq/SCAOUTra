export default function Hero() {
  return `
    <section class="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center text-center px-6">
        
        <div class="absolute inset-0 bg-grid-pattern z-0 pointer-events-none"></div>
        
        <div class="relative z-10 max-w-4xl mx-auto">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent text-xs font-bold uppercase tracking-widest mb-8">
                <span class="w-2 h-2 rounded-full bg-brand-accent"></span>
                Accepting New Clients for Q1
            </div>
            
            <h1 class="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
                Your Competitors Are Moving <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-500">10x Faster.</span>
            </h1>
            
            <p class="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                While you manage operations manually, they are deploying AI agents. 
                We identify and build the automation infrastructure that closes the gap.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#audit-application" class="px-8 py-4 bg-brand-accent text-black font-bold text-lg rounded-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,148,0.3)]">
                    Start The Audit
                </a>
                <a href="#calculator" class="px-8 py-4 border border-white/10 text-white font-medium rounded-lg hover:bg-white/5 transition-all">
                    Calculate Your Loss
                </a>
            </div>
        </div>
    </section>
    `;
}
