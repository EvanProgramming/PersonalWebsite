(function () {
    'use strict';

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

    if (typeof gsap === 'undefined') return;

    var PROJECT_PREVIEW_SELECTOR = '#project-preview';
    var PROJECT_PREVIEW_IMG = '#project-preview-img';
    var ROW_SELECTOR = '.project-row';
    var CURSOR_SELECTOR = '.cursor-follower';

    var previewEl = document.querySelector(PROJECT_PREVIEW_SELECTOR);
    var previewImg = document.querySelector(PROJECT_PREVIEW_IMG);
    var cursorEl = document.querySelector(CURSOR_SELECTOR);
    var rows = document.querySelectorAll(ROW_SELECTOR);

    var mouse = { x: 0, y: 0 };
    var cursorPos = { x: 0, y: 0 };
    var previewPos = { x: 0, y: 0 };
    var activeRow = null;
    var previewVisible = false;

    var LERP = 0.12;
    var CURSOR_LERP = 0.2;
    var PREVIEW_LERP = 0.08;

    // ----- Scroll progress -----
    var progressEl = document.getElementById('scroll-progress');
    if (progressEl) {
        function updateProgress() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressEl.style.width = pct + '%';
        }
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }

    // ----- Custom cursor (lerp follow + scale on project hover) -----
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

        rows.forEach(function (row) {
            row.addEventListener('mouseenter', function () {
                cursorEl.classList.add('cursor-follower--hover');
            });
            row.addEventListener('mouseleave', function () {
                cursorEl.classList.remove('cursor-follower--hover');
            });
        });
    }

    // ----- Floating preview (lerp position, GSAP scale/fade) -----
    if (!previewEl || !previewImg) return;

    previewEl.style.visibility = 'hidden';
    gsap.set(previewEl, { xPercent: -50, yPercent: -50, scale: 0 });

    function tickPreview() {
        previewPos.x += (mouse.x - previewPos.x) * PREVIEW_LERP;
        previewPos.y += (mouse.y - previewPos.y) * PREVIEW_LERP;
        if (previewVisible) {
            previewEl.style.left = previewPos.x + 'px';
            previewEl.style.top = previewPos.y + 'px';
        }
        requestAnimationFrame(tickPreview);
    }
    tickPreview();

    rows.forEach(function (row) {
        var imgUrl = row.getAttribute('data-image');
        var titleEl = row.querySelector('.project-title');
        var finalText = titleEl ? (titleEl.getAttribute('data-text') || titleEl.textContent) : '';

        row.addEventListener('mouseenter', function () {
            activeRow = row;
            previewVisible = true;
            previewPos.x = mouse.x;
            previewPos.y = mouse.y;
            previewEl.style.left = mouse.x + 'px';
            previewEl.style.top = mouse.y + 'px';

            if (imgUrl) {
                previewImg.src = imgUrl;
                previewImg.alt = finalText;
            }
            previewEl.style.visibility = 'visible';
            gsap.killTweensOf(previewEl);
            gsap.to(previewEl, {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: 'power2.out',
                overwrite: true
            });
        });

        row.addEventListener('mouseleave', function () {
            if (activeRow !== row) return;
            activeRow = null;
            gsap.killTweensOf(previewEl);
            gsap.to(previewEl, {
                opacity: 0,
                scale: 0.95,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: function () {
                    previewVisible = false;
                    previewEl.style.visibility = 'hidden';
                }
            });
        });
    });

    // ----- Glitch / decode text -----
    var GLITCH_CHARS = '_/-#[]\\|<>';
    var DECODE_DURATION = 400;
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
