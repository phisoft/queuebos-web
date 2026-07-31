/**
 * QueueBos - Main JavaScript
 */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // Initialize AOS
    if (typeof AOS !== "undefined") {
        AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 100 });
    }

    // Header scroll + scroll-top toggle
    var scrollTopBtn = document.querySelector(".scroll-top");
    window.addEventListener("scroll", function () {
        var h = document.getElementById("header");
        if (h) { h.classList.toggle("scrolled", window.scrollY > 50); }
        if (scrollTopBtn) { scrollTopBtn.classList.toggle("active", window.scrollY > 400); }
    });

    // Scroll-to-top button click handler
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Mobile nav
    var mobileToggle = document.querySelector(".mobile-nav-toggle");
    var navMain = document.querySelector(".nav-main");
    if (mobileToggle && navMain) {
        mobileToggle.addEventListener("click", function () {
            var expanded = this.getAttribute("aria-expanded") === "true";
            this.setAttribute("aria-expanded", !expanded);
            navMain.classList.toggle("active");
            this.classList.toggle("active");
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            var t = document.querySelector(this.getAttribute("href"));
            if (t) {
                t.scrollIntoView({ behavior: "smooth", block: "start" });
                if (navMain && navMain.classList.contains("active")) {
                    navMain.classList.remove("active");
                    if (mobileToggle) { mobileToggle.classList.remove("active"); mobileToggle.setAttribute("aria-expanded", "false"); }
                }
            }
        });
    });

    // How It Works interactive steps
    var howSteps = document.querySelectorAll(".how-step");
    var howImgs = document.querySelectorAll(".how-illustration__img");
    howSteps.forEach(function (step) {
        step.addEventListener("click", function () {
            var idx = parseInt(this.getAttribute("data-step"));
            howSteps.forEach(function (s, i) {
                s.classList.toggle("is-active", i <= idx);
            });
            howImgs.forEach(function (img) {
                img.classList.toggle("active", parseInt(img.getAttribute("data-illustration")) === idx);
            });
        });
    });
    // Activate first step by default
    if (howSteps.length > 0) { howSteps[0].classList.add("is-active"); }
    if (howImgs.length > 0) { howImgs[0].classList.add("active"); }

    // FAQ Accordion
    document.querySelectorAll(".faq-question").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var item = this.parentElement;
            var isOpen = item.classList.contains("active");
            document.querySelectorAll(".faq-item").forEach(function (i) {
                i.classList.remove("active");
                var q = i.querySelector(".faq-question");
                if (q) q.setAttribute("aria-expanded", "false");
            });
            if (!isOpen) {
                item.classList.add("active");
                this.setAttribute("aria-expanded", "true");
            }
        });
    });

    // Contact form
    var contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var valid = true;
            this.querySelectorAll(".demo-input[required]").forEach(function (inp) {
                if (!inp.value.trim()) { valid = false; inp.classList.add("is-invalid"); }
                else { inp.classList.remove("is-invalid"); }
            });
            if (!valid) return;
            var fd = new FormData(this);
            fetch(this.action, { method: this.method, body: fd })
                .then(function () { alert("Thank you! Your message has been sent. We will contact you soon."); contactForm.reset(); })
                .catch(function () { alert("Something went wrong. Please try again or contact us directly."); });
        });
    }
});