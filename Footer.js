export default function Footer() {
  const year = new Date().getFullYear();
  return `
    <footer class="py-12 border-t border-white/10 bg-[#020202]">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="text-center md:text-left">
                <span class="font-display font-bold text-xl text-white">SCOUT<span class="text-gray-600">RA</span></span>
                <p class="text-gray-500 text-sm mt-2">Automating the future of work.</p>
            </div>
            <div class="flex gap-8 text-sm text-gray-500">
                <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
                <p>© ${year}</p>
            </div>
        </div>
    </footer>
    `;
}
