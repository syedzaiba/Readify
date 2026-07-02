export function createStore(initial = {}) {
    let state = initial;
    const listeners = new Set();
    return {
        getState: () => state,
        setState: (newState) => { state = {...state, ...newState };
            listeners.forEach(l => l(state)); },
        subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); }
    };
}
export const store = createStore({
    products: [],
    categories: [],
    currentProduct: null,
    loading: false,
    error: null,
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'newest',
    priceRange: '',
    cart: JSON.parse(localStorage.getItem('readify_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('readify_wishlist') || '[]'),
    theme: localStorage.getItem('readify_theme') || 'light',
    cartOpen: false,
    wishlistOpen: false,
    currentPage: 1,
    itemsPerPage: 12
});
store.subscribe(s => {
    localStorage.setItem('readify_cart', JSON.stringify(s.cart));
    localStorage.setItem('readify_wishlist', JSON.stringify(s.wishlist));
    localStorage.setItem('readify_theme', s.theme);
});