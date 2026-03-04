// ═══════════════════════════════════════════════
//  COLLEGE LOVER — Main JavaScript
// ═══════════════════════════════════════════════

(function () {
    'use strict';

    // ── DOM References ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);
    const container = $('#materialsContainer');
    const searchInput = $('#searchInput');
    const themeToggle = $('#themeToggle');
    const menuBtn = $('#menuBtn');
    const mobileMenu = $('#mobileMenu');
    const navbar = $('#navbar');
    const backToTop = $('#backToTop');

    // ═══════════════════════════════════════
    //  1. DARK / LIGHT THEME
    // ═══════════════════════════════════════
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    function applyTheme(theme) {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fa-solid fa-sun text-lg' : 'fa-solid fa-moon text-lg';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    // ═══════════════════════════════════════
    //  2. MOBILE MENU
    // ═══════════════════════════════════════
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            mobileMenu.classList.toggle('hidden', isOpen);
            mobileMenu.classList.toggle('open', !isOpen);
            const icon = menuBtn.querySelector('i');
            icon.className = isOpen ? 'fa-solid fa-bars text-lg' : 'fa-solid fa-xmark text-lg';
        });

        // Close menu on link click
        $$('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
                menuBtn.querySelector('i').className = 'fa-solid fa-bars text-lg';
            });
        });
    }

    // ═══════════════════════════════════════
    //  3. STICKY NAVBAR SHADOW
    // ═══════════════════════════════════════
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
        }
        // Back to top visibility
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ═══════════════════════════════════════
    //  4. SCROLL REVEAL (Intersection Observer)
    // ═══════════════════════════════════════
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════
    //  5. ANIMATED COUNTERS
    // ═══════════════════════════════════════
    function animateCounters() {
        $$('.counter').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;
            const update = () => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString() + '+';
                    return;
                }
                counter.textContent = current.toLocaleString() + '+';
                requestAnimationFrame(update);
            };
            update();
        });
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const firstCounter = $('.counter');
    if (firstCounter) counterObserver.observe(firstCounter.closest('.reveal') || firstCounter);

    // ═══════════════════════════════════════
    //  6. RENDER MATERIAL CARDS
    // ═══════════════════════════════════════
    window.renderMaterials = function (data) {
        if (!container) return;
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 mb-6">
                        <i class="fa-solid fa-folder-open text-3xl text-slate-400"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">No materials found</h3>
                    <p class="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your keywords or clearing the filters.</p>
                    <button onclick="renderMaterials(resources)" class="px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:bg-brand-700 shadow-lg shadow-brand-500/25 transition-all">Clear Search</button>
                </div>`;
            return;
        }

        data.forEach((item, index) => {
            const subjectStr = Array.isArray(item.subject) ? item.subject.join(', ') : (item.subject || '');
            const subjectCheck = subjectStr.toLowerCase();

            // Icon based on subject
            let icon = 'fa-book', iconGradient = 'from-slate-500 to-slate-600';
            if (subjectCheck.includes('computer')) { icon = 'fa-laptop-code'; iconGradient = 'from-blue-500 to-blue-600'; }
            else if (subjectCheck.includes('ai') || subjectCheck.includes('ml')) { icon = 'fa-brain'; iconGradient = 'from-rose-500 to-pink-500'; }
            else if (subjectCheck.includes('data')) { icon = 'fa-chart-pie'; iconGradient = 'from-emerald-500 to-green-500'; }
            else if (subjectCheck.includes('iot')) { icon = 'fa-microchip'; iconGradient = 'from-amber-500 to-orange-500'; }
            else if (subjectCheck.includes('csit')) { icon = 'fa-network-wired'; iconGradient = 'from-cyan-500 to-teal-500'; }

            // File type badge color
            let typeColor = 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
            if (item.type === 'PPT') typeColor = 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
            else if (item.type === 'DOCX') typeColor = 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
            else if (item.type === 'Textbook') typeColor = 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400';
            else if (item.type === 'Lab Manual') typeColor = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400';

            // Build buttons
            let buttonsHTML = '';
            if (item.links) {
                item.links.forEach(link => {
                    buttonsHTML += `<a href="${link.url}" target="_blank" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 shadow-md shadow-brand-500/20 hover:-translate-y-0.5 transition-all"><i class="fa-solid fa-link"></i>${link.name}</a>`;
                });
            } else {
                buttonsHTML = `<a href="${item.link}" target="_blank" class="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-md shadow-brand-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"><i class="fa-solid fa-download"></i>Download</a>`;
            }

            const card = document.createElement('div');
            card.className = 'card-animate';
            card.style.animationDelay = `${index * 0.08}s`;
            card.innerHTML = `
                <div class="h-full p-6 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-400/50 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg">
                            <i class="fa-solid ${icon} text-white"></i>
                        </div>
                        <span class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold">${item.semester}</span>
                    </div>
                    <h3 class="font-bold text-base mb-3 leading-snug flex-grow-0">${item.title}</h3>
                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="px-2.5 py-1 rounded-lg ${typeColor} text-xs font-semibold">${item.type}</span>
                        <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold">${item.size || 'N/A'}</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5"><i class="fa-solid fa-tag"></i>${subjectStr}</p>
                    <div class="mt-auto">${buttonsHTML}</div>
                </div>`;
            container.appendChild(card);
        });
    };

    // ═══════════════════════════════════════
    //  7. SEARCH
    // ═══════════════════════════════════════
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            if (!term) { renderMaterials(resources); return; }

            const filtered = resources.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(term);
                const semMatch = item.semester.toLowerCase().includes(term);
                let subjectMatch = false;
                if (Array.isArray(item.subject)) {
                    subjectMatch = item.subject.some(sub => sub.toLowerCase().includes(term));
                } else {
                    subjectMatch = (item.subject || '').toLowerCase().includes(term);
                }
                return titleMatch || subjectMatch || semMatch;
            });
            renderMaterials(filtered);
        });
    }

    // ═══════════════════════════════════════
    //  8. DEPARTMENT FILTER
    // ═══════════════════════════════════════
    window.filterByDept = function (deptName) {
        // Update active chip
        $$('.dept-chip').forEach(chip => {
            chip.classList.remove('active');
            if (!chip.classList.contains('active')) {
                chip.classList.remove('bg-brand-600', 'text-white', 'shadow-lg', 'shadow-brand-500/25');
            }
        });
        event.currentTarget.classList.add('active');

        let filtered;
        if (deptName === 'all') {
            filtered = resources;
        } else {
            filtered = resources.filter(item => {
                if (Array.isArray(item.subject)) {
                    return item.subject.includes(deptName);
                }
                return item.subject === deptName;
            });
        }

        renderMaterials(filtered);

        // Scroll to notes
        const notesSection = $('#notes');
        if (notesSection) {
            notesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // ═══════════════════════════════════════
    //  9. SMOOTH SCROLL FOR NAV LINKS
    // ═══════════════════════════════════════
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = $(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════════
    //  10. INITIAL RENDER
    // ═══════════════════════════════════════
    if (typeof resources !== 'undefined') {
        renderMaterials(resources);
    }

})();