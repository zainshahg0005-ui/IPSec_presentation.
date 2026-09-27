/**
 * Main Application Logic:
 * - Theme Switcher
 * - 3-Dot Slide-Out Navigation Menu
 * - Form Submission Handler
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initThreeDotMenu();
    initContactForm();
});

/**
 * Handles Dark/Light theme toggling & dispatches custom event for 3D canvas
 */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);

        // Notify three-scene.js of theme change
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
}

/**
 * Controls 3-Dot Navigation Menu Toggle, Topic Redirection, and Auto-Closing
 */
function initThreeDotMenu() {
    const menuBtn = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('drawer-close');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const topicLinks = drawer.querySelectorAll('a');

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('visible');
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('visible');
    }

    menuBtn.addEventListener('click', () => {
        drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Auto-close drawer when clicking any topic link
    topicLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });
}

/**
 * Handles contact form transmission simulation
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Transmission Secured & Sent.');
            form.reset();
        });
    }
}