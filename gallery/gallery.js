(function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);

    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxBackdrop = lightbox?.querySelector('.lightbox__backdrop');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.getElementById('lightbox-close');
    const metaIso = document.getElementById('meta-iso');
    const metaAperture = document.getElementById('meta-aperture');
    const metaShutter = document.getElementById('meta-shutter');
    const metaDate = document.getElementById('meta-date');
    const progressEl = document.getElementById('scroll-progress');

    // ---------------------------------------------------------------------------
    // PER-ITEM JELLY EFFECT (each picture skews independently with random feel)
    // ---------------------------------------------------------------------------

    const SKEW_DELTA_FACTOR = 0.12;
    const SKEW_MAX = 8;

    var lastScroll = window.scrollY || document.documentElement.scrollTop;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function randomIn(min, max) {
        return min + Math.random() * (max - min);
    }

    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    const DECAY_LERP = 0.035;

    var itemJelly = [];
    galleryItems.forEach(function (item, i) {
        itemJelly.push({
            dirY: randomChoice([-1, 1]),
            dirX: randomChoice([-1, 0, 0, 1]),
            intensity: randomIn(0.6, 1.4),
            lerp: randomIn(0.08, 0.22),
            currentSkewY: 0,
            currentSkewX: 0,
        });
    });

    function updateProgress() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressEl) progressEl.style.width = pct + "%";
    }

    function raf() {
        var scroll = window.scrollY || document.documentElement.scrollTop;
        var delta = scroll - lastScroll;
        lastScroll = scroll;

        var baseTargetY = clamp(delta * SKEW_DELTA_FACTOR, -SKEW_MAX, SKEW_MAX);

        galleryItems.forEach(function (item, i) {
            var j = itemJelly[i];
            if (!j) return;
            var targetY = baseTargetY * j.dirY * j.intensity;
            var targetX = baseTargetY * 0.4 * j.dirX * j.intensity;

            var activeLerp = Math.abs(targetY) > 0.01 || Math.abs(targetX) > 0.01 ? j.lerp : DECAY_LERP;
            j.currentSkewY += (targetY - j.currentSkewY) * activeLerp;
            j.currentSkewX += (targetX - j.currentSkewX) * activeLerp;
            if (Math.abs(j.currentSkewY) < 0.008) j.currentSkewY = 0;
            if (Math.abs(j.currentSkewX) < 0.008) j.currentSkewX = 0;

            var tx = "skew(".concat(j.currentSkewX.toFixed(2), "deg, ").concat(j.currentSkewY.toFixed(2), "deg)");
            item.style.transform = tx;
        });

        updateProgress();
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.addEventListener("resize", updateProgress);
    updateProgress();

    // ---------------------------------------------------------------------------
    // VIDEO HOVER (play on hover, REC indicator via CSS)
    // ---------------------------------------------------------------------------

    galleryItems.forEach(function (item) {
        if (item.dataset.type !== "video") return;
        var video = item.querySelector("video");
        if (!video) return;

        item.addEventListener("mouseenter", function () {
            video.play().catch(function () {});
        });
        item.addEventListener("mouseleave", function () {
            video.pause();
        });

        video.addEventListener("canplay", function () {
            video.play().catch(function () {});
        });
    });

    // ---------------------------------------------------------------------------
    // HUD LIGHTBOX
    // ---------------------------------------------------------------------------

    function typewriterEffect(el, text, speed, callback) {
        if (!el) {
            if (callback) callback();
            return;
        }
        el.textContent = "";
        var i = 0;
        var chars = text.split("");

        function type() {
            if (i < chars.length) {
                el.textContent += chars[i];
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        }
        type();
    }

    function openLightbox(item) {
        if (!lightbox || !item) return;

        var isVideo = item.dataset.type === "video";
        var iso = item.dataset.iso || "---";
        var aperture = item.dataset.aperture || "---";
        var shutter = item.dataset.shutter || "---";
        var date = item.dataset.date || "----.--.--";

        lightbox.classList.toggle("is-video", isVideo);

        if (isVideo) {
            var videoSrc = item.querySelector("video");
            var src = videoSrc ? videoSrc.src : "";
            if (lightboxVideo && src) {
                lightboxVideo.src = src;
                lightboxVideo.play().catch(function () {});
            }
            if (lightboxImg) lightboxImg.src = "";
        } else {
            var imgEl = item.querySelector("img");
            var imgSrc = imgEl ? imgEl.src : "";
            if (lightboxImg && imgSrc) {
                lightboxImg.src = imgSrc;
                lightboxImg.alt = imgEl ? imgEl.alt || "" : "";
            }
            if (lightboxVideo) {
                lightboxVideo.pause();
                lightboxVideo.src = "";
            }
        }

        var rect = item.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        lightbox.setAttribute("aria-hidden", "false");
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";

        gsap.fromTo(
            lightbox.querySelector(".lightbox__frame"),
            {
                scale: 0.3,
                x: centerX - window.innerWidth / 2,
                y: centerY - window.innerHeight / 2,
                opacity: 0,
            },
            {
                scale: 1,
                x: 0,
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.2)",
            }
        );

        if (metaIso) metaIso.textContent = "";
        if (metaAperture) metaAperture.textContent = "";
        if (metaShutter) metaShutter.textContent = "";
        if (metaDate) metaDate.textContent = "";

        var delay = 80;
        typewriterEffect(metaIso, iso, delay, function () {
            typewriterEffect(metaAperture, aperture, delay, function () {
                typewriterEffect(metaShutter, shutter, delay, function () {
                    typewriterEffect(metaDate, date, delay);
                });
            });
        });
    }

    function closeLightbox() {
        if (!lightbox) return;
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = "";
        }
        var frame = lightbox.querySelector(".lightbox__frame");
        if (frame) {
            gsap.to(frame, {
                scale: 0.8,
                opacity: 0,
                duration: 0.25,
                ease: "power2.in",
                onComplete: function () {
                    lightbox.classList.remove("is-open");
                    lightbox.setAttribute("aria-hidden", "true");
                    document.body.style.overflow = "";
                },
            });
        } else {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }
    }

    galleryItems.forEach(function (item) {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            openLightbox(item);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener("click", closeLightbox);
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });

    // ---------------------------------------------------------------------------
    // DYNAMIC NAV (expand/shrink)
    // ---------------------------------------------------------------------------

    var dynamicNav = document.querySelector(".dynamic-nav");
    if (dynamicNav) {
        dynamicNav.addEventListener("mouseenter", function () {
            dynamicNav.classList.remove("shrink-anim");
        });
        dynamicNav.addEventListener("mouseleave", function () {
            dynamicNav.classList.add("shrink-anim");
            var handler = function () {
                dynamicNav.classList.remove("shrink-anim");
                dynamicNav.removeEventListener("animationend", handler);
            };
            dynamicNav.addEventListener("animationend", handler);
        });
    }

    document.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("mouseenter", function () {
            document.querySelectorAll(".nav-link").forEach(function (other) {
                if (other !== link) other.classList.add("blurred");
            });
        });
        link.addEventListener("mouseleave", function () {
            document.querySelectorAll(".nav-link").forEach(function (other) {
                other.classList.remove("blurred");
            });
        });
    });
})();
