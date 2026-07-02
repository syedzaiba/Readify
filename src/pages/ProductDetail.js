import { fetchProductById } from '../js/api.js';
import { store } from '../js/state.js';
import { addToCart } from '../js/cart.js';
import { toggleWishlist, isInWishlist } from '../js/wishlist.js';
import { formatPrice, generateStars, getImageUrl } from '../js/utils.js';
import { showToast } from '../components/Toast.js';

export async function renderProductDetail(id) {
    const main = document.getElementById('main-content');
    main.innerHTML = `<div class="container" style="padding-top:var(--spacing-lg);"><div class="spinner"></div></div>`;

    await fetchProductById(id);
    const product = store.getState().currentProduct;

    if (!product) {
        main.innerHTML = `
            <div class="container text-center" style="padding:var(--spacing-2xl) 0;">
                <h1>Product Not Found</h1>
                <p class="mt-2">The book you're looking for doesn't exist.</p>
                <a href="#/products" class="btn btn-primary mt-3">Browse Books</a>
            </div>`;
        return;
    }

    const price = formatPrice(product.price, product.discountPercentage);
    const inWl = isInWishlist(product.id);

    main.innerHTML = `
        <div class="container">
            <a href="#/products" style="display:inline-block;margin-top:var(--spacing-lg);color:var(--color-primary);">← Back to Books</a>
            <div class="product-detail">
                <div class="product-detail-image">
                    <img src="${getImageUrl(product.thumbnail)}" alt="${product.title}">
                </div>
                <div class="product-detail-info">
                    <p style="color:var(--color-primary);text-transform:uppercase;font-weight:600;font-size:var(--font-size-sm);">${product.category}</p>
                    <h1>${product.title}</h1>
                    <div class="product-detail-meta">
                        <span>By ${product.brand}</span>
                        <span class="product-detail-rating">${generateStars(product.rating)} ${product.rating}</span>
                        <span>Stock: ${product.stock}</span>
                    </div>
                    <div class="product-detail-price">
                        ${price.display}
                        ${product.discountPercentage > 0 ? `<span style="font-size:var(--font-size-lg);color:var(--color-text-tertiary);text-decoration:line-through;margin-left:var(--spacing-sm);">$${price.original}</span>
                        <span style="font-size:var(--font-size-sm);color:var(--color-error);margin-left:var(--spacing-sm);">-${Math.round(product.discountPercentage)}%</span>` : ''}
                    </div>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-actions">
                        <button class="btn btn-primary btn-lg" id="add-to-cart-btn" style="flex:1;">🛒 Add to Cart</button>
                        <button class="btn btn-outline btn-lg" id="wishlist-btn">${inWl ? '❤️' : '🤍'} ${inWl ? 'In Wishlist' : 'Wishlist'}</button>
                    </div>
                    ${product.tags && product.tags.length ? `
                        <div style="display:flex;gap:var(--spacing-sm);flex-wrap:wrap;">
                            ${product.tags.map(tag => `<span style="padding:var(--spacing-xs) var(--spacing-sm);background:var(--color-bg-tertiary);border-radius:var(--radius-full);font-size:var(--font-size-xs);">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('add-to-cart-btn').onclick = () => {
        addToCart(product);
        showToast(`${product.title} added to cart! 🛒`, 'success');
    };
    
    document.getElementById('wishlist-btn').onclick = () => {
        const result = toggleWishlist(product);
        const btn = document.getElementById('wishlist-btn');
        btn.innerHTML = result.added ? '❤️ In Wishlist' : '🤍 Wishlist';
        showToast(result.added ? 'Added to wishlist! ❤️' : 'Removed from wishlist', 'info');
    };
}