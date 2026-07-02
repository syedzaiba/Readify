export function renderFooter() {
    document.getElementById('footer').innerHTML = '<footer class="footer"><div class="footer-content">' +
        '<div class="footer-section"><h3>📚 Readify</h3><p>Your premier online bookstore. Discover thousands of titles across all genres.</p></div>' +
        '<div class="footer-section"><h3>Genres</h3><a href="#/products">Fiction</a><a href="#/products">Non-Fiction</a><a href="#/products">Fantasy</a></div>' +
        '<div class="footer-section"><h3>Support</h3><a href="#/">Help Center</a><a href="#/">Contact Us</a></div></div>' +
        '<div class="footer-bottom"><p>&copy; 2024 Readify. Built with ❤️ for book lovers.</p></div></footer>';
}