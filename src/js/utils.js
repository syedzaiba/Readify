export function formatPrice(price, discount = 0) {
    const d = price - (price * discount / 100);
    return { original: price.toFixed(2), discounted: d.toFixed(2), display: `$${d.toFixed(2)}` };
}
export function generateStars(r) {
    const f = Math.floor(r),
        h = r % 1 >= 0.5,
        e = 5 - f - (h ? 1 : 0);
    return '⭐'.repeat(f) + (h ? '✨' : '') + '☆'.repeat(e);
}
export function debounce(fn, d = 300) {
    let t;
    return (...a) => { clearTimeout(t);
        t = setTimeout(() => fn(...a), d); };
}
export function getImageUrl(url, fallback = '/favicon.svg') {
    return url && url !== '' ? url : fallback;
}
export function parseProduct(p) {
    return {
        id: p.id,
        title: p.title || 'Untitled',
        description: p.description || '',
        price: p.price || 0,
        discountPercentage: p.discountPercentage || 0,
        rating: p.rating || 0,
        stock: p.stock || 0,
        brand: p.brand || 'Unknown',
        category: p.category || 'uncategorized',
        thumbnail: p.thumbnail || '',
        images: p.images || [p.thumbnail],
        tags: p.tags || []
    };
}
export function filterProducts(products, { search, category, sortBy, priceRange }) {
    let f = [...products];
    if (search) {
        const s = search.toLowerCase();
        f = f.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
    }
    if (category && category !== 'all') f = f.filter(p => p.category === category);
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        f = f.filter(p => { const pr = p.price - (p.price * p.discountPercentage / 100); return max ? (pr >= min && pr <= max) : pr >= min; });
    }
    const sortFn = {
        'price-asc': (a, b) => (a.price - a.price * a.discountPercentage / 100) - (b.price - b.price * b.discountPercentage / 100),
        'price-desc': (a, b) => (b.price - b.price * b.discountPercentage / 100) - (a.price - a.price * a.discountPercentage / 100),
        'rating': (a, b) => b.rating - a.rating,
        'name': (a, b) => a.title.localeCompare(b.title)
    };
    if (sortFn[sortBy]) f.sort(sortFn[sortBy]);
    return f;
}