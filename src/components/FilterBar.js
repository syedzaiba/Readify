import { store } from '../js/state.js';

export function renderFilterBar(categories = []) {
    const s = store.getState();
    return `<div class="filter-bar">
        <div class="filter-group"><label class="filter-label">Category:</label><select id="category-filter" class="filter-select">${categories.map(c=>`<option value="${c}" ${s.selectedCategory===c?'selected':''}>${c==='all'?'All':c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('')}</select></div>
        <div class="filter-group"><label class="filter-label">Sort:</label><select id="sort-filter" class="filter-select">
            <option value="newest" ${s.sortBy==='newest'?'selected':''}>Newest</option>
            <option value="price-asc" ${s.sortBy==='price-asc'?'selected':''}>Price: Low-High</option>
            <option value="price-desc" ${s.sortBy==='price-desc'?'selected':''}>Price: High-Low</option>
            <option value="rating" ${s.sortBy==='rating'?'selected':''}>Top Rated</option>
        </select></div>
        <div class="filter-group"><label class="filter-label">Price:</label><select id="price-filter" class="filter-select">
            <option value="">All</option><option value="0-10">Under $10</option><option value="10-25">$10-$25</option><option value="25-50">$25-$50</option><option value="50">$50+</option>
        </select></div>
    </div>`;
}

export function attachFilterEvents(onChange) {
    document.getElementById('category-filter').onchange = e => { store.setState({ selectedCategory: e.target.value, currentPage: 1 }); onChange(); };
    document.getElementById('sort-filter').onchange = e => { store.setState({ sortBy: e.target.value }); onChange(); };
    document.getElementById('price-filter').onchange = e => { store.setState({ priceRange: e.target.value }); onChange(); };
}