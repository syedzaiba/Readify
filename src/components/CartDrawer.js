import { store } from '../js/state.js';
import { removeFromCart, updateQuantity, getCartTotal, getCartCount } from '../js/cart.js';
import { formatPrice, getImageUrl } from '../js/utils.js';
import { showToast } from './Toast.js';

export function renderCartDrawer() {
    const state = store.getState();
    const body = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    if (!body || !footer) return;

    if (!state.cart.length) {
        body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🛒</div><p>Your cart is empty</p><button class="btn btn-primary" onclick="location.hash=\'#/products\'">Start Shopping</button></div>';
        footer.innerHTML = '';
        return;
    }

    body.innerHTML = state.cart.map(function(item) {
        var price = formatPrice(item.price, item.discountPercentage);
        return '<div class="cart-item" data-id="' + item.id + '">' +
            '<div class="cart-item-image"><img src="' + getImageUrl(item.thumbnail) + '" alt="' + item.title + '" loading="lazy"></div>' +
            '<div class="cart-item-info">' +
            '<h4 class="cart-item-title">' + item.title + '</h4>' +
            '<p class="cart-item-price">' + price.display + '</p>' +
            '<div class="cart-item-actions">' +
            '<div class="quantity-selector">' +
            '<button class="qty-dec" data-id="' + item.id + '">-</button>' +
            '<input type="text" value="' + item.quantity + '" readonly style="width:40px;text-align:center;border:none;font-weight:600;">' +
            '<button class="qty-inc" data-id="' + item.id + '">+</button>' +
            '</div>' +
            '<button class="cart-item-remove" data-id="' + item.id + '">Remove</button>' +
            '</div></div></div>';
    }).join('');

    footer.innerHTML = '<div class="flex-between mb-2"><span>Total (' + getCartCount() + ' items):</span><strong style="font-size:var(--font-size-lg);">$' + getCartTotal().toFixed(2) + '</strong></div>' +
        '<button class="btn btn-primary btn-block btn-lg mb-1" id="checkout-drawer-btn">Proceed to Checkout</button>' +
        '<button class="btn btn-secondary btn-block btn-sm" id="clear-cart-drawer-btn">Clear Cart</button>';

    attachEvents();
    updateDrawerVisibility();
}

function attachEvents() {
    var state = store.getState();

    document.querySelectorAll('.qty-dec').forEach(function(btn) {
        btn.onclick = function() {
            var id = parseInt(btn.dataset.id);
            var item = state.cart.find(function(i) { return i.id === id; });
            if (item && item.quantity > 1) {
                updateQuantity(id, item.quantity - 1);
                renderCartDrawer();
            }
        };
    });

    document.querySelectorAll('.qty-inc').forEach(function(btn) {
        btn.onclick = function() {
            var id = parseInt(btn.dataset.id);
            var item = state.cart.find(function(i) { return i.id === id; });
            if (item) {
                updateQuantity(id, item.quantity + 1);
                renderCartDrawer();
            }
        };
    });

    document.querySelectorAll('.cart-item-remove').forEach(function(btn) {
        btn.onclick = function() {
            var id = parseInt(btn.dataset.id);
            removeFromCart(id);
            showToast('Item removed from cart', 'info');
            renderCartDrawer();
        };
    });

    var clearBtn = document.getElementById('clear-cart-drawer-btn');
    if (clearBtn) {
        clearBtn.onclick = function() {
            if (confirm('Clear your cart?')) {
                store.setState({ cart: [] });
                showToast('Cart cleared', 'info');
                renderCartDrawer();
            }
        };
    }

    var checkoutBtn = document.getElementById('checkout-drawer-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            alert('Checkout coming soon!');
        };
    }
}

export function attachCartDrawerEvents() {
    var closeBtn = document.querySelector('#cart-drawer .drawer-close');
    if (closeBtn) {
        closeBtn.onclick = function() { store.setState({ cartOpen: false }); };
    }

    var overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.onclick = function() { store.setState({ cartOpen: false, wishlistOpen: false }); };
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            store.setState({ cartOpen: false, wishlistOpen: false });
        }
    });
}

function updateDrawerVisibility() {
    var state = store.getState();
    var cartDrawer = document.getElementById('cart-drawer');
    var wishlistDrawer = document.getElementById('wishlist-drawer');
    var overlay = document.getElementById('overlay');

    if (cartDrawer) cartDrawer.classList.toggle('open', state.cartOpen);
    if (wishlistDrawer) wishlistDrawer.classList.toggle('open', state.wishlistOpen);
    if (overlay) {
        var anyOpen = state.cartOpen || state.wishlistOpen;
        overlay.classList.toggle('visible', anyOpen);
        if (anyOpen) {
            overlay.classList.remove('hidden');
        } else {
            setTimeout(function() { overlay.classList.add('hidden'); }, 300);
        }
    }
}