// ═══════════════════════════════════════════════
//  COLLEGE LOVER — Main JavaScript
//  Modern Edition · Loading · Particles · Scroll Reveal
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
    const scrollProgress = $('#scrollProgress');
    const loaderScreen = $('#loaderScreen');

    // ═══════════════════════════════════════
    //  0. LOADING SCREEN
    // ═══════════════════════════════════════
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loaderScreen) loaderScreen.classList.add('hidden');
        }, 1500);
    });

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
            icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
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
            mobileMenu.classList.toggle('open', !isOpen);
            const icon = menuBtn.querySelector('i');
            icon.className = isOpen ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
        });

        $$('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuBtn.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // ═══════════════════════════════════════
    //  3. STICKY NAVBAR, SCROLL PROGRESS & BACK TO TOP
    // ═══════════════════════════════════════
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const scrolled = (window.scrollY / docHeight) * 100;
                scrollProgress.style.width = scrolled + '%';
            }
        }
        updateActiveNavLink();
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ═══════════════════════════════════════
    //  4. ACTIVE NAV LINK HIGHLIGHTING
    // ═══════════════════════════════════════
    function updateActiveNavLink() {
        const sections = $$('section[id]');
        const navLinks = $$('.nav-link:not(.premium-link)');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ═══════════════════════════════════════
    //  5. SCROLL REVEAL (Intersection Observer)
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
    //  6. ANIMATED COUNTERS
    // ═══════════════════════════════════════
    function animateCounters() {
        $$('.counter').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (!target) return;
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
    //  7. RENDER MATERIAL CARDS
    // ═══════════════════════════════════════

    // Track current active department & search state
    let currentDept = 'all';

    function getSubjectString(item) {
        return Array.isArray(item.subject) ? item.subject.join(', ') : (item.subject || '');
    }

    function getCardIcon(subjectStr) {
        const check = subjectStr.toLowerCase();
        // Check in priority order for best icon match
        if (check.includes('ai') || check.includes('ml')) return { icon: 'fa-brain', gradient: 'linear-gradient(135deg,#f43f5e,#ec4899)' };
        if (check.includes('data')) return { icon: 'fa-chart-pie', gradient: 'linear-gradient(135deg,#10b981,#22c55e)' };
        if (check.includes('iot')) return { icon: 'fa-microchip', gradient: 'linear-gradient(135deg,#f59e0b,#f97316)' };
        if (check.includes('csit')) return { icon: 'fa-network-wired', gradient: 'linear-gradient(135deg,#06b6d4,#14b8a6)' };
        if (check.includes('computer')) return { icon: 'fa-laptop-code', gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' };
        return { icon: 'fa-book', gradient: 'linear-gradient(135deg,#64748b,#475569)' };
    }

    function getTypeColor(type) {
        switch (type) {
            case 'PPT': return 'background:rgba(245,158,11,0.1);color:#f59e0b';
            case 'DOCX': return 'background:rgba(59,130,246,0.1);color:#3b82f6';
            case 'Textbook': return 'background:rgba(139,92,246,0.1);color:#8b5cf6';
            case 'Lab Manual': return 'background:rgba(16,185,129,0.1);color:#10b981';
            default: return 'background:rgba(239,68,68,0.1);color:#ef4444'; // PDF default
        }
    }

    window.renderMaterials = function (data) {
        if (!container) return;
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fa-solid fa-folder-open"></i></div>
                    <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem">No materials found</h3>
                    <p style="color:var(--text-muted);margin-bottom:1.5rem">Try adjusting your keywords or clearing the filters.</p>
                    <button onclick="resetFilters()" class="btn-primary" style="display:inline-flex">Clear All Filters</button>
                </div>`;
            return;
        }

        data.forEach((item, index) => {
            const subjectStr = getSubjectString(item);
            const { icon, gradient } = getCardIcon(subjectStr);
            const typeColor = getTypeColor(item.type);

            let buttonsHTML = '';
            if (item.links) {
                item.links.forEach(link => {
                    buttonsHTML += `<a href="${link.url}" target="_blank" rel="noopener" class="card-dl-btn sm"><i class="fa-solid fa-link"></i>${link.name}</a>`;
                });
            } else {
                buttonsHTML = `<a href="${item.link}" target="_blank" rel="noopener" class="card-dl-btn"><i class="fa-solid fa-download"></i> Download</a>`;
            }

            const card = document.createElement('div');
            card.className = 'card-animate';
            card.style.animationDelay = `${index * 0.06}s`;
            card.innerHTML = `
                <div class="material-card">
                    <div class="card-top">
                        <div class="card-icon" style="background:${gradient}">
                            <i class="fa-solid ${icon}"></i>
                        </div>
                        <span class="card-sem">${item.semester}</span>
                    </div>
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-tags">
                        <span class="card-tag" style="${typeColor}">${item.type}</span>
                        <span class="card-tag" style="background:var(--bg-card);color:var(--text-muted)">${item.size || 'N/A'}</span>
                    </div>
                    <p class="card-subject"><i class="fa-solid fa-tag"></i>${subjectStr}</p>
                    <div class="card-actions">${buttonsHTML}</div>
                </div>`;
            container.appendChild(card);
        });
    };

    // ═══════════════════════════════════════
    //  8. FILTERING HELPERS
    // ═══════════════════════════════════════

    function getFilteredResources() {
        if (typeof resources === 'undefined') return [];

        let filtered = resources;

        // Apply department filter
        if (currentDept !== 'all') {
            filtered = filtered.filter(item => {
                if (Array.isArray(item.subject)) return item.subject.includes(currentDept);
                return item.subject === currentDept;
            });
        }

        // Apply search filter
        if (searchInput && searchInput.value.trim()) {
            const term = searchInput.value.toLowerCase().trim();
            filtered = filtered.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(term);
                const semMatch = item.semester.toLowerCase().includes(term);
                const typeMatch = item.type.toLowerCase().includes(term);
                let subjectMatch = false;
                if (Array.isArray(item.subject)) {
                    subjectMatch = item.subject.some(sub => sub.toLowerCase().includes(term));
                } else {
                    subjectMatch = (item.subject || '').toLowerCase().includes(term);
                }
                return titleMatch || subjectMatch || semMatch || typeMatch;
            });
        }

        return filtered;
    }

    // ═══════════════════════════════════════
    //  9. SEARCH
    // ═══════════════════════════════════════
    if (searchInput) {
        let searchDebounce = null;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                renderMaterials(getFilteredResources());
            }, 200);
        });
    }

    // ═══════════════════════════════════════
    //  10. DEPARTMENT FILTER
    // ═══════════════════════════════════════
    window.filterByDept = function (deptName, clickedBtn) {
        currentDept = deptName;

        // Update active state on all dept chips
        $$('.dept-chip').forEach(chip => chip.classList.remove('active'));
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }

        // Re-render with combined dept + search filters
        renderMaterials(getFilteredResources());

        // Smooth scroll to notes section
        const notesSection = $('#notes');
        if (notesSection) {
            const offset = navbar ? navbar.offsetHeight + 16 : 80;
            const top = notesSection.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    // Reset all filters
    window.resetFilters = function () {
        currentDept = 'all';
        if (searchInput) searchInput.value = '';
        $$('.dept-chip').forEach(chip => chip.classList.remove('active'));
        const allChip = $('.dept-chip');
        if (allChip) allChip.classList.add('active');
        if (typeof resources !== 'undefined') renderMaterials(resources);
    };

    // ═══════════════════════════════════════
    //  11. SMOOTH SCROLL FOR NAV LINKS
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
    //  12. PARTICLE CANVAS ANIMATION
    // ═══════════════════════════════════════
    const canvas = $('#particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animFrame;

        function resizeCanvas() {
            const section = canvas.closest('section');
            if (section) {
                canvas.width = section.offsetWidth;
                canvas.height = section.offsetHeight;
            }
        }

        function createParticles() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 2.5 + 0.5,
                    dx: (Math.random() - 0.5) * 0.4,
                    dy: (Math.random() - 0.5) * 0.4,
                    opacity: Math.random() * 0.5 + 0.2,
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = document.documentElement.classList.contains('dark');
            const color = isDark ? '129, 140, 248' : '99, 102, 241';

            particles.forEach((p, i) => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${color}, ${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });

            animFrame = requestAnimationFrame(drawParticles);
        }

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animFrame) drawParticles();
                } else {
                    cancelAnimationFrame(animFrame);
                    animFrame = null;
                }
            });
        }, { threshold: 0 });

        heroObserver.observe(canvas.closest('section'));
    }

    // ═══════════════════════════════════════
    //  13. INITIAL RENDER
    // ═══════════════════════════════════════
    if (typeof resources !== 'undefined') {
        renderMaterials(resources);
    }

    updateActiveNavLink();

})();