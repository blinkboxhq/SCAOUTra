export default function Footer() {
  const year = new Date().getFullYear();

  return `
    <footer
      class="py-12 px-6"
      style="border-top: 1px solid var(--border-subtle); background: var(--bg-base);"
      role="contentinfo"
    >
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

        <!-- Brand -->
        <div class="text-center md:text-left">
          <a
            href="/"
            class="font-display font-bold text-lg tracking-tight text-ink-primary"
            aria-label="Scoutra home"
          >
            SCOUT<span class="text-ink-muted">RA</span>
          </a>
          <p class="text-xs text-ink-muted mt-1.5">
            AI Automation for Modern Businesses
          </p>
        </div>

        <!-- Links + copyright -->
        <nav
          aria-label="Footer navigation"
          class="flex flex-wrap justify-center gap-6 text-xs text-ink-muted"
        >
          <a href="mailto:hello@scoutra.co" class="hover:text-ink-primary transition-colors">
            hello@scoutra.co
          </a>
          <button
            type="button"
            data-modal-open="privacy"
            class="hover:text-ink-primary transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs text-ink-muted"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            data-modal-open="terms"
            class="hover:text-ink-primary transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs text-ink-muted"
          >
            Terms of Service
          </button>
          <span>© ${year} Scoutra</span>
        </nav>
      </div>
    </footer>
  `;
}
