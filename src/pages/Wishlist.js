import { store } from '../js/state.js';
import { toggleWishlist } from '../js/wishlist.js';
import { addToCart } from '../js/cart.js';
import { formatPrice, generateStars, getImageUrl } from '../js/utils.js';
import { showToast } from '../components/Toast.js';

export function renderWishlist() {
    var main = document.getElementById('main-content');
    var state = store.getState();

    if (!state.wishlist.length) {
        main.innerHTML = '<div class="container" style="padding-top:var(--spacing-2xl);">' +
            '<h1 style="font-size:var(--font-size-3xl);font-weight:700;margin-bottom:var(--spacing-lg);">My Wishlist</h1>' +
            '<div class="empty-state">' +
            '<div class="empty-state-icon">❤️</div>' +
            '<p>Your wishlist is empty</p>' +
            '<a href="#/products" class="btn btn-primary btn-lg">Discover Books</a>' +
            '</div></div>';
        return;
    }

    var cardsHtml = '';
    for (var i = 0; i < state.wishlist.length; i++) {
        cardsHtml += renderWishlistCard(state.wishlist[i]);
    }

    main.innerHTML = '<div class="container" style="padding-top:var(--spacing-lg);padding-bottom:var(--spacing-2xl);">' +
        '<div class="section-header">' +
        '<h1 style="font-size:var(--font-size-3xl);font-weight:700;">My Wishlist (' + state.wishlist.length + ' items)</h1>' +
        '<button class="btn btn-secondary" id="clear-wishlist-btn">Clear All</button></div>' +
        '<div class="product-grid">' + cardsHtml + '</div></div>';

    attachWishlistPageEvents();
}

function renderWishlistCard(item) {
    var price = formatPrice(item.price, item.discountPercentage);
    var discountBadge = '';
    if (item.discountPercentage > 10) {
        discountBadge = '<span class="product-card-badge">-' + Math.round(item.discountPercentage) + '%</span>';
    }
    var originalPrice = '';
    if (item.discountPercentage > 0) {
        originalPrice = '<span class="original">$' + price.original + '</span>';
    }

    return '<article class="product-card fade-in">' +
        '<div class="product-card-image" onclick="location.hash=\'#/product/' + item.id + '\'">' +
        '<img src="' + getImageUrl(item.thumbnail) + '" alt="' + item.title + '" loading="lazy">' +
        discountBadge + '</div>' +
        '<div class="product-card-body">' +
        '<p class="product-card-category">' + (item.category || 'Book') + '</p>' +
        '<h3 class="product-card-title" onclick="location.hash=\'#/product/' + item.id + '\'">' + item.title + '</h3>' +
        '<div class="product-card-rating">' + generateStars(item.rating || 0) + '</div>' +
        '<div class="product-card-price" style="margin-bottom:var(--spacing-sm);">' + price.display + originalPrice + '</div>' +
        '<div style="display:flex;gap:var(--spacing-sm);">' +
        '<button class="btn btn-primary btn-sm move-cart-btn" data-id="' + item.id + '" style="flex:1;">🛒 Add to Cart</button>' +
        '<button class="btn btn-secondary btn-sm remove-wl-btn" data-id="' + item.id + '">✕</button>' +
        '</div></div></article>';
}

function attachWishlistPageEvents() {
    var moveBtns = document.querySelectorAll('.move-cart-btn');
    for (var i = 0; i < moveBtns.length; i++) {
        moveBtns[i].onclick = function() {
            var state = store.getState();
            var product = state.products.find(function(p) { return p.id == this.dataset.id; });
            if (!product) {
                product = state.wishlist.find(function(w) { return w.id == this.dataset.id; });
            }
            if (product) {
                addToCart(product);
                showToast('Added to cart! 🛒', 'success');
            }
        };
    }

    var removeBtns = document.querySelectorAll('.remove-wl-btn');
    for (var j = 0; j < removeBtns.length; j++) {
        removeBtns[j].onclick = function() {
            var state = store.getState();
            var product = state.products.find(function(p) { return p.id == this.dataset.id; });
            if (product) {
                toggleWishlist(product);
            } else {
                store.setState({ wishlist: state.wishlist.filter(function(w) { return w.id != this.dataset.id; }) });
            }
            showToast('Removed from wishlist', 'info');
            renderWishlist();
        };
    }

    var clearBtn = document.getElementById('clear-wishlist-btn');
    if (clearBtn) {
        clearBtn.onclick = function() {
            if (confirm('Clear your entire wishlist?')) {
                store.setState({ wishlist: [] });
                showToast('Wishlist cleared', 'info');
                renderWishlist();
            }
        };
    }
}