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
            var submitBtn = contactForm.querySelector("button[type=\"submit\"]");
            var originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Sending...";

            fetch(contactForm.action, { method: contactForm.method, body: fd })
                .then(function (response) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;

                    if (!response.ok) {
                        // API returned an error (400, 500, etc.) — service is reachable but rejecting
                        showFallback();
                        return;
                    }

                    alert("Thank you! Your message has been sent. We will contact you soon.");
                    contactForm.reset();
                    removeFallback();
                })
                .catch(function () {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    showFallback();
                });
        });
    }

    // Fallback notice when third-party form service is unavailable
    var fallbackEl = document.getElementById("formFallback");

    window.showFallback = function () {
        if (!fallbackEl) return;

        // Read current form values to pre-fill the mailto link
        var name    = (document.getElementById("name")    || {}).value || "";
        var email   = (document.getElementById("email")   || {}).value || "";
        var phone   = (document.getElementById("phone")   || {}).value || "";
        var company = (document.getElementById("company") || {}).value || "";
        var message = (document.getElementById("message") || {}).value || "";

        var body =
            "Name: " + name + "%0D%0A" +
            "Email: " + email + "%0D%0A" +
            "Phone: " + phone + "%0D%0A" +
            "Company: " + company + "%0D%0A%0D%0A" +
            message;

        var mailtoHref = "mailto:hello@queuebos.com?subject=Request%20Demo%20-%20QueueBos&body=" + body;

        // Build the mailto link and trigger it to open the user's email client
        var mailtoLink = fallbackEl.querySelector(".form-fallback__mailto");
        if (mailtoLink) {
            mailtoLink.href = mailtoHref;
        }
        window.open(mailtoHref, "_self");

        fallbackEl.classList.add("active");
        fallbackEl.focus({ preventScroll: false });
    };

    window.removeFallback = function () {
        if (!fallbackEl) return;
        fallbackEl.classList.remove("active");
    };
});
