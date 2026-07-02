export function renderNotFound() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="container not-found">
            <h1>404</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <a href="#/" class="btn btn-primary btn-lg">Go Home</a>
        </div>
    `;
}