/* =============================================
   ADEEB TECHNOLOGY LAB - MAIN JAVASCRIPT
   Home Page: Theme Toggle, Animations, Interactivity
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ========== THEME TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('adeeb-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('adeeb-theme', next);
        updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // ========== NAVBAR SCROLL ==========
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateActiveNavLink();
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== MOBILE MENU ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========== ACTIVE NAV LINK ==========
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    // ========== CONTACT FORM ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = contactForm.querySelector('#name')?.value.trim() || '';
            const phone = contactForm.querySelector('#phone')?.value.trim() || '';
            const email = contactForm.querySelector('#email')?.value.trim() || '';
            const message = contactForm.querySelector('#message')?.value.trim() || '';

            const whatsappText = [
                '*New Message from Website*',
                '',
                `*Name:* ${fullName}`,
                `*Phone:* ${phone}`,
                `*Email:* ${email}`,
                `*Message:* ${message || 'N/A'}`
            ].join('\n');


            // 03092333121 in international format for wa.me
            const whatsappNumber = '923092333121';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // ========== TESTIMONIALS ARROWS ==========
    const testimonialsMarquee = document.querySelector('.testimonials-marquee');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');

    if (testimonialsMarquee && testimonialPrev && testimonialNext) {
        let autoScrollTimer = null;

        const scrollStep = () => {
            const card = testimonialsMarquee.querySelector('.testimonial-card');
            if (!card) return 360;
            const cardWidth = card.getBoundingClientRect().width;
            const styles = window.getComputedStyle(testimonialsMarquee.querySelector('.testimonials-track'));
            const gap = parseFloat(styles.columnGap || styles.gap || '24');
            return cardWidth + gap;
        };

        const moveBy = (distance) => {
            const maxScroll = testimonialsMarquee.scrollWidth - testimonialsMarquee.clientWidth;
            const nextPos = testimonialsMarquee.scrollLeft + distance;

            if (distance > 0 && nextPos >= maxScroll - 2) {
                testimonialsMarquee.scrollTo({ left: 0, behavior: 'smooth' });
                return;
            }

            if (distance < 0 && testimonialsMarquee.scrollLeft <= 2) {
                testimonialsMarquee.scrollTo({ left: maxScroll, behavior: 'smooth' });
                return;
            }

            testimonialsMarquee.scrollBy({ left: distance, behavior: 'smooth' });
        };

        const startAutoScroll = () => {
            if (autoScrollTimer) return;
            autoScrollTimer = setInterval(() => {
                moveBy(scrollStep());
            }, 2800);
        };

        const stopAutoScroll = () => {
            if (!autoScrollTimer) return;
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        };

        testimonialPrev.addEventListener('click', () => {
            moveBy(-scrollStep());
        });

        testimonialNext.addEventListener('click', () => {
            moveBy(scrollStep());
        });

        testimonialsMarquee.addEventListener('mouseenter', stopAutoScroll);
        testimonialsMarquee.addEventListener('mouseleave', startAutoScroll);
        startAutoScroll();
    }

    // ========== MOBILE APPS SCROLL (CSS ANIMATED) ==========
    // Auto-scrolling is now handled via CSS animation in style.css
    // This section disabled to prevent conflicts with CSS animation

    // ========== COURSE VIDEO PLAYER ==========
    const videoCards = document.querySelectorAll('.course-video-card');
    const videoModal = document.getElementById('courseVideoModal');
    const videoFrame = document.getElementById('courseVideoFrame');
    const videoTitle = document.getElementById('courseVideoTitle');
    const videoClose = document.getElementById('courseVideoClose');
    const videoBackdrop = document.getElementById('courseVideoBackdrop');

    if (videoCards.length && videoModal && videoFrame && videoClose && videoBackdrop) {
        const buildSearchEmbedUrl = (query) =>
            `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}&autoplay=1&rel=0`;

        const openVideo = (card) => {
            const heading = card.querySelector('h3')?.textContent?.trim() || 'Course Video Player';
            const query = card.dataset.videoQuery || heading;
            videoTitle.textContent = heading;
            videoFrame.src = buildSearchEmbedUrl(query);
            videoModal.classList.add('active');
            videoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeVideo = () => {
            videoModal.classList.remove('active');
            videoModal.setAttribute('aria-hidden', 'true');
            videoFrame.src = '';
            document.body.style.overflow = '';
        };

        videoCards.forEach(card => {
            card.addEventListener('click', () => openVideo(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openVideo(card);
                }
            });
        });

        videoClose.addEventListener('click', closeVideo);
        videoBackdrop.addEventListener('click', closeVideo);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideo();
            }
        });
    }

    // ========== COUNTER ANIMATION ==========
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                counter.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ========== INTERSECTION OBSERVER ==========
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');

                if (entry.target.closest('.hero')) {
                    animateCounters();
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========== TEAM FROM GOOGLE SHEETS ==========
    const teamGrid = document.getElementById('teamGrid');
    if (teamGrid) {
        const SHEET_ID = '167Upu6HpZkKukOzuN_jrb8IATrTxwqNSOKLFrl-p8tQ';
        const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        fetch(SHEET_URL)
            .then(res => {
                if (!res.ok) throw new Error('Sheet fetch failed');
                return res.text();
            })
            .then(csv => {
                const lines = csv.trim().split('\n');
                if (lines.length < 2) {
                    teamGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);">No team members found.</p>';
                    return;
                }

                const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
                const nameIdx = headers.indexOf('Name');
                const deptIdx = headers.indexOf('Department');
                const imgIdx = headers.indexOf('Image');
                const emailIdx = headers.indexOf('Email');
                const githubIdx = headers.indexOf('Github');

                let html = '';
                for (let i = 1; i < lines.length; i++) {
                    const row = parseCSVRow(lines[i]);
                    const name = row[nameIdx] || '';
                    const dept = row[deptIdx] || '';
                    const img = row[imgIdx] || '';
                    const email = row[emailIdx] || '';
                    const github = row[githubIdx] || '';

                    if (!name) continue;

                    html += `
                        <article class="team-card">
                            <div class="team-image">
                                <img src="${img}" alt="${name}" onerror="this.onerror=null;this.src='assets/adeeb.png';">
                            </div>
                            <div class="team-info">
                                <h3>${name}</h3>
                                <p class="team-role">${dept}</p>
                                <div class="team-links">
                                    ${github ? `<a href="${github}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>` : ''}
                                    ${email ? `<a href="mailto:${email}" aria-label="Email"><i class="fas fa-envelope"></i></a>` : ''}
                                </div>
                            </div>
                        </article>`;
                }

                teamGrid.innerHTML = html || '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);">No team members found.</p>';
            })
            .catch(err => {
                console.error('Team load error:', err);
                teamGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);"><i class="fas fa-exclamation-triangle"></i> Could not load team data. Make sure the Google Sheet is published to the web.</p>';
            });

        function parseCSVRow(row) {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let c = 0; c < row.length; c++) {
                const ch = row[c];
                if (ch === '"') {
                    if (inQuotes && row[c + 1] === '"') {
                        current += '"';
                        c++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (ch === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += ch;
                }
            }
            result.push(current.trim());
            return result;
        }
    }

    // ========== LOGO FROM GOOGLE SHEETS ==========
    const logoGrid = document.getElementById('logoGrid');
    if (logoGrid) {
        const SHEET_ID = '167Upu6HpZkKukOzuN_jrb8IATrTxwqNSOKLFrl-p8tQ';
        const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=1067595971`;

        fetch(SHEET_URL)
            .then(res => {
                if (!res.ok) throw new Error('Sheet fetch failed');
                return res.text();
            })
            .then(csv => {
                const lines = csv.trim().split('\n');
                if (lines.length < 2) {
                    logoGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);">No logos found.</p>';
                    return;
                }

                const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
                const nameIdx = headers.findIndex(h => /company|name/i.test(h));
                const dateIdx = headers.findIndex(h => /date/i.test(h));
                const imgIdx = headers.findIndex(h => /logo|image|img/i.test(h));

                const ni = nameIdx >= 0 ? nameIdx : 1;
                const di = dateIdx >= 0 ? dateIdx : 2;
                const ii = imgIdx >= 0 ? imgIdx : 3;

                let html = '';
                for (let i = 1; i < lines.length; i++) {
                    const row = parseCSVRow(lines[i]);
                    const name = row[ni] || '';
                    const date = row[di] || '';
                    const img = row[ii] || '';

                    if (!name && !img) continue;

                    html += `
                        <article class="logo-card">
                            <div class="logo-image">
                                <img src="${img}" alt="${name}" onerror="this.onerror=null;this.src='assets/adeeb.png';">
                            </div>
                            <div class="logo-info">
                                <h3>${name}</h3>
                                ${date ? `<p class="logo-date">${date}</p>` : ''}
                            </div>
                        </article>`;
                }

                logoGrid.innerHTML = html || '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);">No logos found.</p>';
            })
            .catch(err => {
                console.error('Logo load error:', err);
                logoGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);"><i class="fas fa-exclamation-triangle"></i> Could not load logo data. Make sure the Google Sheet is published to the web.</p>';
            });

        function parseCSVRow(row) {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let c = 0; c < row.length; c++) {
                const ch = row[c];
                if (ch === '"') {
                    if (inQuotes && row[c + 1] === '"') {
                        current += '"';
                        c++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (ch === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += ch;
                }
            }
            result.push(current.trim());
            return result;
        }
    }

    // ========== PRELOADER REMOVE ==========
    document.body.classList.add('loaded');
});
