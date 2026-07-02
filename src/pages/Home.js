import { renderSearchBar, attachSearchEvents } from '../components/SearchBar.js';
import { renderProductGrid } from '../components/ProductGrid.js';
import { fetchProducts } from '../js/api.js';
import { store } from '../js/state.js';

export async function renderHome() {
    var main = document.getElementById('main-content');

    main.innerHTML = '<section class="hero">' +
        '<div class="hero-content">' +
        '<h1>Discover Your Next Great Read</h1>' +
        '<p>Explore thousands of books across all genres. From bestsellers to hidden gems, find your perfect book at Readify.</p>' +
        renderSearchBar('Search books by title, author, or genre...') +
        '</div></section>' +
        '<div class="container">' +
        '<section>' +
        '<div class="section-header">' +
        '<h2 class="section-title">Featured Books</h2>' +
        '<a href="#/products" class="section-link">View All →</a></div>' +
        '<div id="featured-products"></div></section>' +
        '<section style="margin-top:var(--spacing-2xl);">' +
        '<div class="section-header">' +
        '<h2 class="section-title">Top Rated</h2>' +
        '<a href="#/products" class="section-link">View All →</a></div>' +
        '<div id="top-rated-products"></div></section></div>';

    await fetchProducts(30);
    var products = store.getState().products;

    var featured = document.getElementById('featured-products');
    if (featured) featured.innerHTML = renderProductGrid(products.slice(0, 4));

    var topRated = document.getElementById('top-rated-products');
    if (topRated) {
        var sorted = products.slice().sort(function(a, b) { return b.rating - a.rating; });
        topRated.innerHTML = renderProductGrid(sorted.slice(0, 4));
    }

    attachSearchEvents(function(query) {
        if (query) location.hash = '#/products?search=' + encodeURIComponent(query);
    });
}