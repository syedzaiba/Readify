import { store } from '../js/state.js';
import { debounce } from '../js/utils.js';

export function renderSearchBar(placeholder = 'Search books...') {
    return `<div class="search-container">
        <span class="search-icon">🔍</span>
        <input type="search" id="search-input" class="search-input" placeholder="${placeholder}" value="${store.getState().searchQuery}">
        <button class="search-clear ${store.getState().searchQuery?'visible':''}" id="search-clear">✕</button>
    </div>`;
}

export function attachSearchEvents(onSearch) {
    const input = document.getElementById('search-input');
    const clear = document.getElementById('search-clear');
    if (!input) return;
    const debounced = debounce(q => { store.setState({ searchQuery: q, currentPage: 1 }); if (onSearch) onSearch(q); }, 300);
    input.oninput = e => { debounced(e.target.value);
        clear.classList.toggle('visible', !!e.target.value); };
    clear.onclick = () => { input.value = '';
        clear.classList.remove('visible');
        store.setState({ searchQuery: '', currentPage: 1 }); if (onSearch) onSearch(''); };
}