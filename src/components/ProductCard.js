import { addToCart } from '../js/cart.js';
import { toggleWishlist, isInWishlist } from '../js/wishlist.js';
import { formatPrice, generateStars, getImageUrl } from '../js/utils.js';
import { showToast } from './Toast.js';
import { store } from '../js/state.js';

export function renderProductCard(product) {
    const price = formatPrice(product.price, product.discountPercentage);
    const wl = isInWishlist(product.id);
    return `<article class="product-card fade-in">
        <div class="product-card-image" onclick="location.hash='#/product/${product.id}'">
            <img src="${getImageUrl(product.thumbnail)}" alt="${product.title}" loading="lazy">
            ${product.discountPercentage>10?`<span class="product-card-badge">-${Math.round(product.discountPercentage)}%</span>`:''}
            <div class="product-card-actions">
                <button class="icon-btn wl-btn" data-id="${product.id}">${wl?'❤️':'🤍'}</button>
            </div>
        </div>
        <div class="product-card-body">
            <p class="product-card-category">${product.category}</p>
            <h3 class="product-card-title" onclick="location.hash='#/product/${product.id}'">${product.title}</h3>
            <div class="product-card-rating">${generateStars(product.rating)} <span>(${product.rating})</span></div>
            <div class="product-card-footer">
                <div class="product-card-price">${price.display}${product.discountPercentage>0?`<span class="original">$${price.original}</span>`:''}</div>
                <button class="btn btn-primary btn-sm cart-btn" data-id="${product.id}">🛒 Add</button>
            </div>
        </div></article>`;
}

export function attachCardEvents() {
    document.querySelectorAll('.cart-btn').forEach(b => b.onclick = (e) => {
        const p = store.getState().products.find(x => x.id == b.dataset.id) || store.getState().currentProduct;
        if (p) { addToCart(p); showToast('Added to cart! 🛒', 'success'); }
    });
    document.querySelectorAll('.wl-btn').forEach(b => b.onclick = (e) => {
        const p = store.getState().products.find(x => x.id == b.dataset.id) || store.getState().currentProduct;
        if (p) { const r = toggleWishlist(p); b.textContent = r.added ? '❤️' : '🤍'; showToast(r.added ? 'Added to wishlist! ❤️' : 'Removed from wishlist', 'info'); }
    });
}