import { navigate, isActiveRoute } from '../js/router.js';
import { store } from '../js/state.js';
import { getCartCount } from '../js/cart.js';
import { getWishlistCount } from '../js/wishlist.js';
import { toggleTheme, getCurrentTheme } from '../js/theme.js';

export function renderHeader() {
    document.getElementById('header').innerHTML = `
        <div class="header"><div class="header-content">
            <a href="#/" class="header-logo">📚 Readify</a>
            <button class="hamburger" aria-label="Menu">☰</button>
            <nav class="header-nav">
                <a href="#/" class="${isActiveRoute('/')&&!isActiveRoute('/products')?'active':''}">Home</a>
                <a href="#/products" class="${isActiveRoute('/products')?'active':''}">Books</a>
            </nav>
            <div class="header-actions">
                <button class="icon-btn" id="wishlist-btn" aria-label="Wishlist">❤️<span class="badge">${getWishlistCount()}</span></button>
                <button class="icon-btn" id="cart-btn" aria-label="Cart">🛒<span class="badge">${getCartCount()}</span></button>
                <button class="theme-toggle" id="theme-toggle">${getCurrentTheme()==='dark'?'☀️':'🌙'}</button>
            </div>
        </div></div>`;

    document.getElementById('theme-toggle').onclick = () => { toggleTheme();
        renderHeader(); };
    document.getElementById('cart-btn').onclick = () => { store.setState({ cartOpen: true, wishlistOpen: false }); };
    document.getElementById('wishlist-btn').onclick = () => { store.setState({ wishlistOpen: true, cartOpen: false }); };

    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.header-nav');
    hamburger.onclick = () => nav.classList.toggle('open');
    nav.querySelectorAll('a').forEach(a => a.onclick = () => nav.classList.remove('open'));
}