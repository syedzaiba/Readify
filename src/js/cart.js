import { store } from './state.js';

export function addToCart(product, qty = 1) {
    const state = store.getState();
    const existing = state.cart.find(i => i.id === product.id);
    const newCart = existing ?
        state.cart.map(i => i.id === product.id ? {...i, quantity: i.quantity + qty } : i) :
        [...state.cart, { id: product.id, title: product.title, price: product.price, discountPercentage: product.discountPercentage, thumbnail: product.thumbnail, quantity: qty }];
    store.setState({ cart: newCart });
}

export function removeFromCart(id) {
    store.setState({ cart: store.getState().cart.filter(i => i.id !== id) });
}

export function updateQuantity(id, qty) {
    if (qty <= 0) return removeFromCart(id);
    store.setState({ cart: store.getState().cart.map(i => i.id === id ? {...i, quantity: qty } : i) });
}

export function getCartTotal() {
    return store.getState().cart.reduce((t, i) => t + (i.price - i.price * i.discountPercentage / 100) * i.quantity, 0);
}

export function getCartCount() {
    return store.getState().cart.reduce((c, i) => c + i.quantity, 0);
}