const routes = {};
let notFoundHandler = null;

export function route(path, handler) { routes[path] = handler; }
export function notFound(handler) { notFoundHandler = handler; }
export function navigate(path) { window.location.hash = path; }
export function getCurrentRoute() { return window.location.hash.slice(1) || '/'; }

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    if (!window.location.hash) window.location.hash = '#/';
    handleRoute();
}

function handleRoute() {
    const hash = getCurrentRoute();
    const [_, path, ...params] = hash.split('/');
    const routePath = `/${path || ''}`;

    if (routes[hash]) return routes[hash](params);
    if (routes[`/${path}/:id`] && params[0]) return routes[`/${path}/:id`](params);
    if (routes[routePath]) return routes[routePath](params);
    if (notFoundHandler) notFoundHandler();
    window.scrollTo(0, 0);
}

export function isActiveRoute(path) {
    return getCurrentRoute().startsWith(path);
}