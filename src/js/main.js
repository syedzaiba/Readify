import { initRouter, route, notFound } from './router.js';
import { initTheme } from './theme.js';
import { store } from './state.js';
import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderCartDrawer, attachCartDrawerEvents } from '../components/CartDrawer.js';
import { renderWishlistDrawer, attachWishlistDrawerEvents } from '../components/WishlistDrawer.js';
import { renderHome } from '../pages/Home.js';
import { renderProducts } from '../pages/Products.js';
import { renderProductDetail } from '../pages/ProductDetail.js';
import { renderCart } from '../pages/Cart.js';
import { renderWishlist } from '../pages/Wishlist.js';
import { renderNotFound } from '../pages/NotFound.js';

console.log('🚀 Readify initializing...');

function init() {
    console.log('✅ DOM ready');

    // Initialize theme
    initTheme();
    console.log('✅ Theme initialized');

    // Render static components
    renderHeader();
    console.log('✅ Header rendered');

    renderFooter();
    console.log('✅ Footer rendered');

    // Set up routes
    route('/', renderHome);
    route('/products', renderProducts);
    route('/product/:id', (params) => renderProductDetail(parseInt(params[0])));
    route('/cart', renderCart);
    route('/wishlist', renderWishlist);
    notFound(renderNotFound);
    console.log('✅ Routes registered');

    // Initialize router
    initRouter();
    console.log('✅ Router initialized');

    // Set up drawer events
    attachCartDrawerEvents();
    attachWishlistDrawerEvents();
    console.log('✅ Drawer events attached');

    // Subscribe to state changes
    store.subscribe(() => {
        const state = store.getState();
        const cartDrawer = document.getElementById('cart-drawer');
        const wishlistDrawer = document.getElementById('wishlist-drawer');
        const overlay = document.getElementById('overlay');

        if (cartDrawer) cartDrawer.classList.toggle('open', state.cartOpen);
        if (wishlistDrawer) wishlistDrawer.classList.toggle('open', state.wishlistOpen);
        if (overlay) {
            const anyOpen = state.cartOpen || state.wishlistOpen;
            overlay.classList.toggle('visible', anyOpen);
            overlay.classList.remove('hidden');
            if (!anyOpen) {
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }

        if (state.cartOpen) renderCartDrawer();
        if (state.wishlistOpen) renderWishlistDrawer();
        renderHeader();
    });

    // Initial drawer render
    renderCartDrawer();
    renderWishlistDrawer();

    console.log('📚 Readify is ready!');
}

// Make store globally accessible
window.appStore = store;

// Start the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}