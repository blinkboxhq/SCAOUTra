export default function Navbar() {
  return `
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header role="banner">
      <nav
        class="navbar"
        id="navbar"
        aria-label="Main navigation"
      >
        <div class="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between gap-8">

          <!-- Logo -->
          <a
            href="/"
            class="flex items-center gap-2.5 shrink-0"
            aria-label="Scoutra home"
          >
            <span
              class="w-2 h-2 rounded-full bg-accent flex-shrink-0"
              style="animation: pulse-dot 2.4s ease-in-out infinite;"
              aria-hidden="true"
            ></span>
            <span class="font-display font-bold text-lg tracking-tight text-ink-primary">
              SCOUT<span class="text-ink-muted">RA</span>
            </span>
          </a>

          <!-- Desktop nav links -->
          <ul
            class="hidden md:flex items-center gap-7 text-sm font-medium text-ink-secondary list-none m-0 p-0"
            role="list"
          >
            <li><a href="#results" class="hover:text-ink-primary transition-colors duration-150">Results</a></li>
            <li><a href="#protocol" class="hover:text-ink-primary transition-colors duration-150">Our Process</a></li>
            <li><a href="#value-prop" class="hover:text-ink-primary transition-colors duration-150">Approach</a></li>
          </ul>

          <!-- CTA + mobile toggle -->
          <div class="flex items-center gap-3">
            <a href="#apply" class="btn btn-ghost hidden md:inline-flex">
              Apply for Audit
            </a>

            <button
              id="nav-toggle"
              class="md:hidden flex flex-col gap-1.5 p-2 rounded-md focus-visible:ring-2 ring-accent"
              aria-expanded="false"
              aria-controls="mobile-nav"
              aria-label="Open navigation menu"
            >
              <span class="block w-5 h-0.5 bg-ink-primary transition-all duration-200" id="bar1"></span>
              <span class="block w-5 h-0.5 bg-ink-primary transition-all duration-200" id="bar2"></span>
              <span class="block w-4 h-0.5 bg-ink-primary transition-all duration-200" id="bar3"></span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile nav overlay -->
      <nav
        id="mobile-nav"
        class="mobile-nav"
        aria-label="Mobile navigation"
        aria-hidden="true"
      >
        <ul class="flex flex-col gap-1 list-none m-0 p-0" role="list">
          <li>
            <a href="#results" class="block py-3 px-4 text-xl font-display font-semibold text-ink-primary rounded-lg hover:bg-surface-elevated transition-colors mobile-nav-link">
              Results
            </a>
          </li>
          <li>
            <a href="#protocol" class="block py-3 px-4 text-xl font-display font-semibold text-ink-primary rounded-lg hover:bg-surface-elevated transition-colors mobile-nav-link">
              Our Process
            </a>
          </li>
          <li>
            <a href="#value-prop" class="block py-3 px-4 text-xl font-display font-semibold text-ink-primary rounded-lg hover:bg-surface-elevated transition-colors mobile-nav-link">
              Approach
            </a>
          </li>
        </ul>
        <div class="mt-auto pt-6 border-t border-ink-border">
          <a href="#apply" class="btn btn-primary w-full mobile-nav-link">
            Apply for a Free Audit
          </a>
        </div>
      </nav>
    </header>
  `;
}

export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');

  // Scroll: add .scrolled class after 20px
  const scrollObserver = new IntersectionObserver(
    ([entry]) => {
      navbar.classList.toggle('scrolled', !entry.isIntersecting);
    },
    { threshold: 1, rootMargin: '-20px 0px 0px 0px' }
  );

  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;';
  document.body.prepend(sentinel);
  scrollObserver.observe(sentinel);

  // Mobile nav toggle
  let isOpen = false;

  function openNav() {
    isOpen = true;
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
    // Animate to X
    bar1.style.transform = 'translateY(8px) rotate(45deg)';
    bar2.style.opacity = '0';
    bar3.style.transform = 'translateY(-8px) rotate(-45deg)';
    bar3.style.width = '20px';
  }

  function closeNav() {
    isOpen = false;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
    // Reset bars
    bar1.style.transform = '';
    bar2.style.opacity = '';
    bar3.style.transform = '';
    bar3.style.width = '';
  }

  toggle.addEventListener('click', () => {
    isOpen ? closeNav() : openNav();
  });

  // Close mobile nav when a link is clicked
  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeNav();
  });
}
