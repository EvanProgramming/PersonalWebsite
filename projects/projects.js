(function () {
    'use strict';

    // ----- Lenis smooth scrolling -----
    var lenis = null;
    var progressEl = document.getElementById('scroll-progress');

    function updateProgress() {
        if (!progressEl) return;
        var scrollTop = lenis ? lenis.scroll : (window.scrollY || document.documentElement.scrollTop);
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressEl.style.width = Math.min(100, pct) + '%';
    }

    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            smoothWheel: true
        });
        function raf(time) {
            lenis.raf(time);
            updateProgress();
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } else if (progressEl) {
        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    if (progressEl) {
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }

    // ----- Nav: shrink-anim and link blur (match script.js) -----
    var dynamicNav = document.querySelector('.dynamic-nav');
    if (dynamicNav) {
        dynamicNav.addEventListener('mouseenter', function () {
            dynamicNav.classList.remove('shrink-anim');
        });
        dynamicNav.addEventListener('mouseleave', function () {
            dynamicNav.classList.add('shrink-anim');
            dynamicNav.addEventListener('animationend', function handler() {
                dynamicNav.classList.remove('shrink-anim');
                dynamicNav.removeEventListener('animationend', handler);
            });
        });
    }

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('mouseenter', function () {
            document.querySelectorAll('.nav-link').forEach(function (other) {
                if (other !== link) other.classList.add('blurred');
            });
        });
        link.addEventListener('mouseleave', function () {
            document.querySelectorAll('.nav-link').forEach(function (other) {
                other.classList.remove('blurred');
            });
        });
    });

    // ----- Description: slide-open panel (accordion) -----
    document.querySelectorAll('.project-btn--desc').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var row = btn.closest('.project-row');
            if (!row) return;
            var isOpen = row.classList.contains('project-row--desc-open');
            document.querySelectorAll('.project-row--desc-open').forEach(function (openRow) {
                openRow.classList.remove('project-row--desc-open');
                var openBtn = openRow.querySelector('.project-btn--desc');
                if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                row.classList.add('project-row--desc-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    if (typeof gsap === 'undefined') return;

    var CURSOR_SELECTOR = '.cursor-follower';
    var CURSOR_IMG_ID = 'cursor-preview-img';
    var ROW_SELECTOR = '.project-row';

    var cursorEl = document.querySelector(CURSOR_SELECTOR);
    var cursorImg = document.getElementById(CURSOR_IMG_ID);
    var cursorInner = cursorEl && cursorEl.querySelector('.cursor-follower__inner');
    var rows = document.querySelectorAll(ROW_SELECTOR);

    var mouse = { x: 0, y: 0 };
    var cursorPos = { x: 0, y: 0 };
    var activeRow = null;

    var CURSOR_LERP = 0.18;
    var CURSOR_SIZE = 32;
    var CURSOR_HOVER_SIZE = 40;
    var IMAGE_WIDTH = 280;
    var IMAGE_HEIGHT = Math.round(280 * (2 / 3));

    // ----- Custom cursor: solid circle, lerp follow -----
    if (cursorEl) {
        document.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function tickCursor() {
            cursorPos.x += (mouse.x - cursorPos.x) * CURSOR_LERP;
            cursorPos.y += (mouse.y - cursorPos.y) * CURSOR_LERP;
            cursorEl.style.left = cursorPos.x + 'px';
            cursorEl.style.top = cursorPos.y + 'px';
            requestAnimationFrame(tickCursor);
        }
        tickCursor();

        // ----- Cursor scale-up on row hover (whole row) -----
        rows.forEach(function (row) {
            row.addEventListener('mouseenter', function () {
                cursorEl.classList.add('cursor-follower--hover');
            });
            row.addEventListener('mouseleave', function () {
                cursorEl.classList.remove('cursor-follower--hover');
            });
        });

        // ----- Cursor transforms to image only when hovering the title -----
        rows.forEach(function (row) {
            var imgUrl = row.getAttribute('data-image');
            var titleEl = row.querySelector('.project-title');
            if (!titleEl) return;
            var finalText = titleEl.getAttribute('data-text') || titleEl.textContent;

            titleEl.addEventListener('mouseenter', function () {
                activeRow = row;
                cursorEl.classList.add('cursor-follower--image');

                if (cursorImg && imgUrl) {
                    cursorImg.src = imgUrl;
                    cursorImg.alt = finalText;
                }

                gsap.killTweensOf(cursorEl);
                gsap.fromTo(cursorEl, {
                    width: CURSOR_SIZE,
                    height: CURSOR_SIZE,
                    marginLeft: -CURSOR_SIZE / 2,
                    marginTop: -CURSOR_SIZE / 2,
                    borderRadius: '50%'
                }, {
                    width: IMAGE_WIDTH,
                    height: IMAGE_HEIGHT,
                    marginLeft: -IMAGE_WIDTH / 2,
                    marginTop: -IMAGE_HEIGHT / 2,
                    borderRadius: 8,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: true
                });

                gsap.killTweensOf(cursorInner);
                gsap.fromTo(cursorInner, { opacity: 0 }, {
                    opacity: 1,
                    duration: 0.35,
                    delay: 0.05,
                    ease: 'power2.out'
                });
            });

            titleEl.addEventListener('mouseleave', function () {
                if (activeRow !== row) return;
                activeRow = null;

                gsap.killTweensOf(cursorInner);
                gsap.to(cursorInner, {
                    opacity: 0,
                    duration: 0.2,
                    ease: 'power2.in'
                });

                gsap.killTweensOf(cursorEl);
                gsap.to(cursorEl, {
                    width: CURSOR_SIZE,
                    height: CURSOR_SIZE,
                    marginLeft: -CURSOR_SIZE / 2,
                    marginTop: -CURSOR_SIZE / 2,
                    borderRadius: '50%',
                    duration: 0.35,
                    ease: 'power2.in',
                    overwrite: true,
                    onComplete: function () {
                        cursorEl.classList.remove('cursor-follower--image');
                    }
                });
            });
        });
    }

    // ----- Glitch / decode text -----
    var GLITCH_CHARS = '_/-#[]\\|<>';
    var DECODE_STEP = 35;

    function decodeText(el) {
        if (!el || !el.getAttribute('data-text')) return;
        var target = el.getAttribute('data-text');
        var len = target.length;
        var step = 0;
        var maxSteps = Math.max(len * 2, 8);

        function run() {
            var next = '';
            for (var i = 0; i < len; i++) {
                if (step < maxSteps) {
                    next += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                } else {
                    next += target[i];
                }
            }
            el.textContent = next;
            step++;
            if (step <= maxSteps) {
                setTimeout(run, DECODE_STEP);
            } else {
                el.textContent = target;
            }
        }
        run();
    }

    rows.forEach(function (row) {
        var titleEl = row.querySelector('.project-title');
        if (!titleEl) return;
        var finalText = titleEl.getAttribute('data-text') || titleEl.textContent;

        row.addEventListener('mouseenter', function () {
            titleEl.textContent = finalText;
            decodeText(titleEl);
        });
    });
})();
