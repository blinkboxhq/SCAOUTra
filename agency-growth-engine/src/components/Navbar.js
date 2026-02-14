export default function Navbar() {
  return `
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-brand-accent rounded-full animate-pulse"></div>
                <span class="font-display font-bold text-xl tracking-tight text-white">
                    SCOUT<span class="text-gray-500">RA</span>
                </span>
            </div>

            <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                <a href="#protocol" class="hover:text-white transition-colors">The Protocol</a>
                <a href="#results" class="hover:text-white transition-colors">Results</a>
                <a href="#calculator" class="hover:text-white transition-colors">ROI Calculator</a>
            </div>

            <a href="#audit-application" class="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all">
                Book Audit
            </a>
        </div>
    </nav>
    `;
}
