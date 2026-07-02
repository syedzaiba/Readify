import { store } from './state.js';

export function initTheme() {
    const saved = localStorage.getItem('readify_theme');
    applyTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
}

export function toggleTheme() {
    applyTheme(store.getState().theme === 'light' ? 'dark' : 'light');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    store.setState({ theme });
}

export function getCurrentTheme() {
    return store.getState().theme;
}