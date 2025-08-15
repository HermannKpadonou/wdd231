document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburger");
    const mainNav = document.getElementById("main-nav");

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener("click", () => {
            mainNav.classList.toggle("open");
            hamburgerBtn.textContent = mainNav.classList.contains("open") ? "✕" : "☰";
        });
    }

    const currentYearSpan = document.getElementById("currentYear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const lastModifiedSpan = document.getElementById("lastModified");
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = new Date(document.lastModified).toLocaleString();
    }
});