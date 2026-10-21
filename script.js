/**
 * AYUSH JAKHMOLA — PERSONAL PORTFOLIO
 * Security Researcher | BCA'27 | Penetration Testing & Vulnerability Assessment
 * 
 * Cinematic Entrance Animation, Ambient Particles, Navigation,
 * Skills Filter, Certificate Lightbox, Resume Modal, Contact Form.
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. AMBIENT CYBER PARTICLE CANVAS
       ========================================================================== */
    function initAmbientParticles() {
        const canvas = document.getElementById('ambient-particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let particles = [];
        const particleCount = 42;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 1.8 + 0.7;
                this.alpha = Math.random() * 0.55 + 0.2;
                this.color = Math.random() > 0.4 ? 'rgba(0, 255, 157,' : 'rgba(0, 212, 255,';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
                if (this.y < -10) this.y = height + 10;
                if (this.y > height + 10) this.y = -10;
            }

            draw(c) {
                c.beginPath();
                c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                c.fillStyle = `${this.color}${this.alpha})`;
                c.shadowBlur = 6;
                c.shadowColor = this.color.includes('255, 157') ? '#00ff9d' : '#00d4ff';
                c.fill();
                c.shadowBlur = 0;
            }
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function render() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                p1.draw(ctx);

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 75) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        const lineAlpha = (1 - dist / 75) * 0.18;
                        ctx.strokeStyle = `rgba(0, 255, 157, ${lineAlpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(render);
        }

        init();
        render();
        window.addEventListener('resize', () => { resize(); }, { passive: true });
    }

    /* ==========================================================================
       2. NAVIGATION, HEADER SCROLL & ACTIVE SCROLL SPY
       ========================================================================== */
    function initNavigation() {
        const header = document.getElementById('header');
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileDrawer = document.getElementById('mobile-drawer');
        const navLinks = document.querySelectorAll('.nav-item');
        const mobileLinks = document.querySelectorAll('.mobile-item');
        const sections = document.querySelectorAll('section[id]');

        // Sticky Header Transition
        window.addEventListener('scroll', () => {
            if (header) {
                if (window.scrollY > 30) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }, { passive: true });

        // Mobile Menu Drawer Toggle
        function toggleMobile(forceClose = false) {
            if (!mobileToggle || !mobileDrawer) return;
            const isOpen = forceClose ? true : mobileToggle.classList.contains('open');
            if (isOpen) {
                mobileToggle.classList.remove('open');
                mobileDrawer.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileDrawer.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            } else {
                mobileToggle.classList.add('open');
                mobileDrawer.classList.add('open');
                mobileToggle.setAttribute('aria-expanded', 'true');
                mobileDrawer.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        }

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => toggleMobile());
        }

        mobileLinks.forEach(link => {
            if (link.id !== 'resume-trigger-mobile-btn') {
                link.addEventListener('click', () => toggleMobile(true));
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
                toggleMobile(true);
            }
        });

        // Active Link Spy
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -40% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${activeId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    /* ==========================================================================
       3. SKILLS CATEGORY FILTERING (FIXED SELECTORS)
       ========================================================================== */
    function initSkillsFilter() {
        const buttons = document.querySelectorAll('.tab-btn');
        const cards = document.querySelectorAll('.skill-card');

        if (!buttons.length || !cards.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all buttons
                buttons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                // Set clicked button as active
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const filter = btn.getAttribute('data-filter');

                // Filter skill cards with smooth animation
                cards.forEach(card => {
                    const category = card.getAttribute('data-category') || '';
                    if (filter === 'all' || category.includes(filter)) {
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    } else {
                        card.style.transition = 'opacity 0.2s ease';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    }

    /* ==========================================================================
       4. CERTIFICATE PREVIEW MODAL
       ========================================================================== */
    function initCertificates() {
        const certItems = document.querySelectorAll('.cert-item');
        const modal = document.getElementById('cert-modal');
        const modalImg = document.getElementById('cert-modal-img');
        const modalTitle = document.getElementById('cert-modal-heading');
        const modalIssuer = document.getElementById('cert-modal-issuer');
        const closeBtn = document.getElementById('cert-close-btn');
        const backdrop = document.getElementById('cert-backdrop');

        if (!modal || !modalImg) return;

        function openCert(item) {
            const src = item.getAttribute('data-src');
            const title = item.getAttribute('data-title');
            const issuer = item.getAttribute('data-issuer');

            modalImg.src = src;
            modalImg.alt = title;
            if (modalTitle) modalTitle.textContent = title;
            if (modalIssuer) modalIssuer.textContent = issuer;

            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeCert() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            modalImg.src = '';
        }

        certItems.forEach(item => {
            item.addEventListener('click', () => openCert(item));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openCert(item);
                }
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeCert);
        if (backdrop) backdrop.addEventListener('click', closeCert);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
                closeCert();
            }
        });
    }

    /* ==========================================================================
       5. RESUME VIEWER MODAL (VIEW ONLY / PROTECTED MODE)
       ========================================================================== */
    function initResumeModal() {
        const triggers = [
            document.getElementById('resume-trigger-nav-btn'),
            document.getElementById('hero-resume-trigger'),
            document.getElementById('resume-trigger-mobile-btn')
        ].filter(Boolean);

        const modal = document.getElementById('resume-modal');
        const closeBtn = document.getElementById('resume-close-btn');
        const backdrop = document.getElementById('resume-backdrop');
        const iframe = document.getElementById('resume-iframe');
        const placeholder = document.getElementById('resume-placeholder');
        const mobileDrawer = document.getElementById('mobile-drawer');
        const mobileToggle = document.getElementById('mobile-toggle');

        if (!modal) return;

        function openResume() {
            // Close mobile menu if open
            if (mobileDrawer && mobileDrawer.classList.contains('open')) {
                mobileDrawer.classList.remove('open');
                if (mobileToggle) mobileToggle.classList.remove('open');
            }

            if (iframe) {
                iframe.src = 'resume.pdf#toolbar=0&navpanes=0&scrollbar=0';
                iframe.style.display = 'block';
                if (placeholder) placeholder.classList.add('hidden');
            }

            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeResume() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        triggers.forEach(t => t.addEventListener('click', (e) => {
            e.preventDefault();
            openResume();
        }));

        if (closeBtn) closeBtn.addEventListener('click', closeResume);
        if (backdrop) backdrop.addEventListener('click', closeResume);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
                closeResume();
            }
        });
    }

    /* ==========================================================================
       6. SENTINELLM PROJECT DETAILS MODAL
       ========================================================================== */
    function initIntelModal() {
        const triggers = document.querySelectorAll('.proj-details-trigger');
        const modal = document.getElementById('sentinel-modal');
        const closeBtn = document.getElementById('intel-close-btn');
        const backdrop = document.getElementById('intel-backdrop');

        function openIntel() {
            if (modal) {
                modal.classList.add('open');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeIntel() {
            if (modal) {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        }

        triggers.forEach(t => t.addEventListener('click', openIntel));
        if (closeBtn) closeBtn.addEventListener('click', closeIntel);
        if (backdrop) backdrop.addEventListener('click', closeIntel);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
                closeIntel();
            }
        });
    }

    /* ==========================================================================
       7. CONTACT FORM (VALIDATION & DIRECT MAIL LINKAGE)
       ========================================================================== */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');
        const feedback = document.getElementById('form-feedback');

        if (!form) return;

        function clearErrors() {
            ['name-error', 'email-error', 'subject-error', 'message-error'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '';
            });
            [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
                if (inp) inp.classList.remove('input-error');
            });
            if (feedback) {
                feedback.className = 'form-status';
                feedback.style.display = 'none';
            }
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            let hasError = false;
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            if (!name) {
                document.getElementById('name-error').textContent = 'Please enter your name.';
                nameInput.classList.add('input-error');
                hasError = true;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                document.getElementById('email-error').textContent = 'Please enter your email address.';
                emailInput.classList.add('input-error');
                hasError = true;
            } else if (!emailRegex.test(email)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address.';
                emailInput.classList.add('input-error');
                hasError = true;
            }

            if (!subject) {
                document.getElementById('subject-error').textContent = 'Please enter a subject.';
                subjectInput.classList.add('input-error');
                hasError = true;
            }

            if (!message) {
                document.getElementById('message-error').textContent = 'Please enter your message.';
                messageInput.classList.add('input-error');
                hasError = true;
            }

            if (hasError) return;

            const recipient = 'jakhmolaayush51@gmail.com';
            const mailSubject = encodeURIComponent(`[Portfolio Message] ${subject}`);
            const mailBody = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

            feedback.className = 'form-status success';
            feedback.innerHTML = `Thank you, ${escapeHTML(name)}! Opening your email app to send your message to <strong>${recipient}</strong>...`;

            setTimeout(() => {
                window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;
            }, 600);
        });
    }

    // Helper: Escape HTML
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }

    /* ==========================================================================
       8. SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    function initScrollReveal() {
        const revealTargets = document.querySelectorAll(
            '.section-title-wrap, .about-image-card, .about-content, .pillar-card, .skill-card, .project-item, .cert-item, .contact-grid'
        );

        if (!revealTargets.length) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealTargets.forEach(el => {
            el.classList.add('scroll-reveal');
            revealObserver.observe(el);
        });
    }

    /* ==========================================================================
       INITIALIZE ON DOM READY
       ========================================================================== */
    document.addEventListener('DOMContentLoaded', () => {
        initAmbientParticles();
        initNavigation();
        initSkillsFilter();
        initCertificates();
        initResumeModal();
        initIntelModal();
        initContactForm();
        initScrollReveal();

        console.log('%c[Ayush Jakhmola] Portfolio Loaded.', 
            'color: #00ff9d; font-size: 13px; font-weight: bold; font-family: monospace;');
    });
})();
