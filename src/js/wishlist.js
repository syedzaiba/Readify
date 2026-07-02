import { store } from './state.js';

export function toggleWishlist(product) {
    const state = store.getState();
    const exists = state.wishlist.some(i => i.id === product.id);
    const newWishlist = exists ?
        state.wishlist.filter(i => i.id !== product.id) :
        [...state.wishlist, { id: product.id, title: product.title, price: product.price, discountPercentage: product.discountPercentage, thumbnail: product.thumbnail }];
    store.setState({ wishlist: newWishlist });
    return { added: !exists };
}

export function isInWishlist(id) {
    return store.getState().wishlist.some(i => i.id === id);
}

export function getWishlistCount() {
    return store.getState().wishlist.length;
}