import { renderProductCard, attachCardEvents } from './ProductCard.js';

export function renderProductGrid(products, loading) {
    if (loading === undefined) loading = false;

    if (loading) {
        var html = '<div class="product-grid">';
        for (var i = 0; i < 8; i++) {
            html += '<div class="product-card">';
            html += '<div class="skeleton" style="padding-top:140%;"></div>';
            html += '<div class="product-card-body">';
            html += '<div class="skeleton" style="height:16px;width:60%;margin-bottom:8px;"></div>';
            html += '<div class="skeleton" style="height:40px;margin-bottom:8px;"></div>';
            html += '</div></div>';
        }
        html += '</div>';
        return html;
    }

    if (!products || products.length === 0) {
        return '<div class="empty-state"><div class="empty-state-icon">📚</div><p>No books found</p><button class="btn btn-primary" onclick="location.hash=\'#/products\'">Browse All Books</button></div>';
    }

    var html = '<div class="product-grid">';
    for (var j = 0; j < products.length; j++) {
        html += renderProductCard(products[j]);
    }
    html += '</div>';

    setTimeout(attachCardEvents, 100);

    return html;
}