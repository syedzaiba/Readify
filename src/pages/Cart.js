import { store } from '../js/state.js';
import { removeFromCart, updateQuantity, getCartTotal, getCartCount } from '../js/cart.js';
import { formatPrice, getImageUrl } from '../js/utils.js';
import { showToast } from '../components/Toast.js';

export function renderCart() {
    var main = document.getElementById('main-content');
    var state = store.getState();

    if (!state.cart.length) {
        main.innerHTML = '<div class="container" style="padding-top:var(--spacing-2xl);">' +
            '<h1 style="font-size:var(--font-size-3xl);font-weight:700;margin-bottom:var(--spacing-lg);">Shopping Cart</h1>' +
            '<div class="empty-state">' +
            '<div class="empty-state-icon">🛒</div>' +
            '<p>Your cart is empty</p>' +
            '<a href="#/products" class="btn btn-primary btn-lg">Browse Books</a>' +
            '</div></div>';
        return;
    }

    var itemsHtml = '';
    for (var i = 0; i < state.cart.length; i++) {
        itemsHtml += renderCartPageItem(state.cart[i]);
    }

    main.innerHTML = '<div class="container" style="padding-top:var(--spacing-lg);padding-bottom:var(--spacing-2xl);">' +
        '<h1 style="font-size:var(--font-size-3xl);font-weight:700;margin-bottom:var(--spacing-lg);">Shopping Cart (' + getCartCount() + ' items)</h1>' +
        '<div style="display:grid;grid-template-columns:1fr 350px;gap:var(--spacing-xl);align-items:start;">' +
        '<div id="cart-items-list">' + itemsHtml +
        '<button class="btn btn-secondary" id="clear-cart-btn" style="margin-top:var(--spacing-md);">Clear Cart</button>' +
        '</div>' +
        '<div style="background:var(--color-bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius-lg);position:sticky;top:calc(var(--header-height) + var(--spacing-md));">' +
        '<h3 style="font-size:var(--font-size-xl);font-weight:700;margin-bottom:var(--spacing-lg);">Order Summary</h3>' +
        '<div class="flex-between mb-1"><span>Subtotal (' + getCartCount() + ' items)</span><strong>$' + getCartTotal().toFixed(2) + '</strong></div>' +
        '<div class="flex-between mb-1"><span>Shipping</span><span style="color:var(--color-success);">Free</span></div>' +
        '<hr style="border-color:var(--color-border);margin:var(--spacing-md) 0;">' +
        '<div class="flex-between mb-3"><span style="font-size:var(--font-size-lg);font-weight:700;">Total</span><strong style="font-size:var(--font-size-xl);color:var(--color-primary);">$' + getCartTotal().toFixed(2) + '</strong></div>' +
        '<button class="btn btn-primary btn-block btn-lg" id="checkout-btn">Proceed to Checkout</button>' +
        '<a href="#/products" style="display:block;text-align:center;margin-top:var(--spacing-md);color:var(--color-primary);">Continue Shopping</a>' +
        '</div></div></div>';

    attachCartPageEvents();
}

function renderCartPageItem(item) {
    var price = formatPrice(item.price, item.discountPercentage);
    var itemTotal = (parseFloat(price.discounted) * item.quantity).toFixed(2);

    return '<div class="cart-item" data-id="' + item.id + '" style="background:var(--color-bg-card);padding:var(--spacing-md);border-radius:var(--radius-lg);margin-bottom:var(--spacing-md);border:1px solid var(--color-border);">' +
        '<div class="cart-item-image" style="width:100px;height:130px;cursor:pointer;" onclick="location.hash=\'#/product/' + item.id + '\'" role="link" tabindex="0">' +
        '<img src="' + getImageUrl(item.thumbnail) + '" alt="' + item.title + '" loading="lazy">' +
        '</div>' +
        '<div class="cart-item-info">' +
        '<h4 class="cart-item-title" style="cursor:pointer;" onclick="location.hash=\'#/product/' + item.id + '\'">' + item.title + '</h4>' +
        '<p class="cart-item-price">' + price.display + ' each</p>' +
        '<p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);">Total: <strong>$' + itemTotal + '</strong></p>' +
        '<div class="cart-item-actions">' +
        '<div class="quantity-selector">' +
        '<button class="qty-dec-page" data-id="' + item.id + '" aria-label="Decrease">-</button>' +
        '<input type="text" value="' + item.quantity + '" readonly style="width:50px;text-align:center;border:none;border-left:2px solid var(--color-border);border-right:2px solid var(--color-border);border-radius:0;">' +
        '<button class="qty-inc-page" data-id="' + item.id + '" aria-label="Increase">+</button>' +
        '</div>' +
        '<button class="cart-item-remove" data-id="' + item.id + '">🗑️ Remove</button>' +
        '</div></div></div>';
}

function attachCartPageEvents() {
    var qtyDecBtns = document.querySelectorAll('.qty-dec-page');
    for (var i = 0; i < qtyDecBtns.length; i++) {
        qtyDecBtns[i].onclick = function() {
            var id = parseInt(this.dataset.id);
            var item = store.getState().cart.find(function(x) { return x.id === id; });
            if (item && item.quantity > 1) {
                updateQuantity(id, item.quantity - 1);
                renderCart();
            }
        };
    }

    var qtyIncBtns = document.querySelectorAll('.qty-inc-page');
    for (var j = 0; j < qtyIncBtns.length; j++) {
        qtyIncBtns[j].onclick = function() {
            var id = parseInt(this.dataset.id);
            var item = store.getState().cart.find(function(x) { return x.id === id; });
            if (item) {
                updateQuantity(id, item.quantity + 1);
                renderCart();
            }
        };
    }

    var removeBtns = document.querySelectorAll('.cart-item-remove');
    for (var k = 0; k < removeBtns.length; k++) {
        removeBtns[k].onclick = function() {
            var id = parseInt(this.dataset.id);
            removeFromCart(id);
            showToast('Item removed from cart', 'info');
            renderCart();
        };
    }

    var clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.onclick = function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                store.setState({ cart: [] });
                showToast('Cart cleared', 'info');
                renderCart();
            }
        };
    }

    var checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            alert('🎉 Thank you for shopping at Readify!\n\nCheckout coming soon!\nTotal: $' + getCartTotal().toFixed(2));
        };
    }
}