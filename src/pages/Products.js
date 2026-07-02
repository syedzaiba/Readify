import { renderSearchBar, attachSearchEvents } from '../components/SearchBar.js';
import { renderFilterBar, attachFilterEvents } from '../components/FilterBar.js';
import { renderProductGrid } from '../components/ProductGrid.js';
import { store } from '../js/state.js';
import { fetchProducts, fetchCategories } from '../js/api.js';
import { filterProducts } from '../js/utils.js';

let allProducts = [];

export async function renderProducts() {
    const main = document.getElementById('main-content');

    main.innerHTML = `
        <div class="container" style="padding-top:var(--spacing-lg);">
           <h1 style="font-size:var(--font-size-3xl);font-weight:700;margin-bottom:var(--spacing-lg);">Browse Books</h1>
            ${renderSearchBar()}
            <div id="filter-container"></div>
            <div id="products-container">${renderProductGrid([], true)}</div>
            <div id="pagination-container"></div>
        </div>
    `;

    await fetchProducts(100);
    const categories = await fetchCategories();

    allProducts = store.getState().products;

    const filterContainer = document.getElementById('filter-container');
    if (filterContainer) {
        filterContainer.innerHTML = renderFilterBar(categories);
        attachFilterEvents(updateDisplay);
    }

    attachSearchEvents(updateDisplay);
    updateDisplay();
}

function updateDisplay() {
    const state = store.getState();
    const filtered = filterProducts(allProducts, {
        search: state.searchQuery,
        category: state.selectedCategory,
        sortBy: state.sortBy,
        priceRange: state.priceRange
    });

    const { currentPage, itemsPerPage } = state;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    const container = document.getElementById('products-container');
    if (container) container.innerHTML = renderProductGrid(paginated);

    const pagination = document.getElementById('pagination-container');
    if (pagination && totalPages > 1) {
        pagination.innerHTML = renderPagination(currentPage, totalPages);
        attachPaginationEvents();
    } else if (pagination) {
        pagination.innerHTML = '';
    }
}

function renderPagination(current, total) {
    let html = '<div class="pagination">';
    html += `<button ${current === 1 ? 'disabled' : ''} data-page="${current - 1}">← Previous</button>`;

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - 2 && i <= current + 2)) {
            html += `<button class="${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === current - 3 || i === current + 3) {
            html += '<span style="padding:0 0.5rem;">...</span>';
        }
    }

    html += `<button ${current === total ? 'disabled' : ''} data-page="${current + 1}">Next →</button>`;
    html += '</div>';
    return html;
}

function attachPaginationEvents() {
    document.querySelectorAll('.pagination button:not(:disabled)').forEach(btn => {
        btn.onclick = () => {
            store.setState({ currentPage: parseInt(btn.dataset.page) });
            updateDisplay();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    });
}