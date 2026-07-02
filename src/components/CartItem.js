import { removeFromCart, updateQuantity } from '../js/cart.js';
import { formatPrice, getImageUrl } from '../js/utils.js';
import { showToast } from './Toast.js';
import { renderCartDrawer } from './CartDrawer.js';

export function renderCartItem(item) {
    const price = formatPrice(item.price, item.discountPercentage);
    return `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${getImageUrl(item.thumbnail)}" alt="${item.title}" loading="lazy">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">${price.display}</p>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="qty-dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                        <input type="text" value="${item.quantity}" readonly aria-label="Quantity">
                        <button class="qty-inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">Remove</button>
                </div>
            </div>
        </div>
    `;
}

export function attachCartItemEvents() {
    document.querySelectorAll('.qty-dec').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            const input = btn.parentElement.querySelector('input');
            const newQty = parseInt(input.value) - 1;
            if (newQty >= 1) {
                updateQuantity(id, newQty);
                renderCartDrawer();
            }
        };
    });

    document.querySelectorAll('.qty-inc').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            const input = btn.parentElement.querySelector('input');
            const newQty = parseInt(input.value) + 1;
            updateQuantity(id, newQty);
            renderCartDrawer();
        };
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
            showToast('Item removed from cart', 'info');
            renderCartDrawer();
        };
    });
}