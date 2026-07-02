import { store } from '../js/state.js';
import { toggleWishlist } from '../js/wishlist.js';
import { addToCart } from '../js/cart.js';
import { formatPrice, getImageUrl } from '../js/utils.js';
import { showToast } from './Toast.js';

export function renderWishlistDrawer() {
    var state = store.getState();
    var container = document.getElementById('wishlist-items');
    if (!container) return;

    if (!state.wishlist.length) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">❤️</div><p>Your wishlist is empty</p><button class="btn btn-primary" onclick="location.hash=\'#/products\'">Discover Books</button></div>';
        return;
    }

    container.innerHTML = state.wishlist.map(function(item) {
        var price = formatPrice(item.price, item.discountPercentage);
        return '<div class="wishlist-item" data-id="' + item.id + '">' +
            '<div class="wishlist-item-image"><img src="' + getImageUrl(item.thumbnail) + '" alt="' + item.title + '" loading="lazy"></div>' +
            '<div style="flex:1;min-width:0;">' +
            '<h4 style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.title + '</h4>' +
            '<p style="color:var(--color-primary);font-weight:600;">' + price.display + '</p></div>' +
            '<div style="display:flex;gap:0.5rem;">' +
            '<button class="btn btn-primary btn-sm move-to-cart" data-id="' + item.id + '" title="Move to cart">🛒</button>' +
            '<button class="btn btn-secondary btn-sm remove-wl" data-id="' + item.id + '" title="Remove">✕</button>' +
            '</div></div>';
    }).join('');

    attachEvents();
}

function attachEvents() {
    document.querySelectorAll('.move-to-cart').forEach(function(btn) {
        btn.onclick = function() {
            var state = store.getState();
            var product = state.products.find(function(p) { return p.id == btn.dataset.id; });
            if (product) {
                addToCart(product);
                toggleWishlist(product);
                showToast('Moved to cart!', 'success');
                renderWishlistDrawer();
            }
        };
    });

    document.querySelectorAll('.remove-wl').forEach(function(btn) {
        btn.onclick = function() {
            var state = store.getState();
            var product = state.products.find(function(p) { return p.id == btn.dataset.id; });
            if (product) {
                toggleWishlist(product);
                showToast('Removed from wishlist', 'info');
                renderWishlistDrawer();
            }
        };
    });
}

export function attachWishlistDrawerEvents() {
    var closeBtn = document.querySelector('#wishlist-drawer .drawer-close');
    if (closeBtn) {
        closeBtn.onclick = function() { store.setState({ wishlistOpen: false }); };
    }
}