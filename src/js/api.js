import { parseProduct } from './utils.js';
import { store } from './state.js';

var API = 'https://dummyjson.com';

// Local book data as fallback (since DummyJSON has limited books)
var localBooks = [
    { id: 1001, title: "The Great Gatsby", description: "A story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.", price: 12.99, discountPercentage: 15, rating: 4.5, stock: 50, brand: "Scribner", category: "fiction", thumbnail: "https://covers.openlibrary.org/b/id/7222246-L.jpg", images: ["https://covers.openlibrary.org/b/id/7222246-L.jpg"], tags: ["classic", "american", "fiction"] },
    { id: 1002, title: "To Kill a Mockingbird", description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.", price: 14.99, discountPercentage: 10, rating: 4.8, stock: 75, brand: "HarperCollins", category: "fiction", thumbnail: "https://covers.openlibrary.org/b/id/8226191-L.jpg", images: ["https://covers.openlibrary.org/b/id/8226191-L.jpg"], tags: ["classic", "fiction", "pulitzer"] },
    { id: 1003, title: "1984", description: "A dystopian social science fiction novel and cautionary tale about the future of totalitarianism.", price: 11.99, discountPercentage: 20, rating: 4.6, stock: 100, brand: "Penguin Books", category: "fiction", thumbnail: "https://covers.openlibrary.org/b/id/8575708-L.jpg", images: ["https://covers.openlibrary.org/b/id/8575708-L.jpg"], tags: ["dystopian", "classic", "fiction"] },
    { id: 1004, title: "Pride and Prejudice", description: "A romantic novel of manners that follows the character development of Elizabeth Bennet.", price: 9.99, discountPercentage: 5, rating: 4.7, stock: 60, brand: "Penguin Classics", category: "fiction", thumbnail: "https://covers.openlibrary.org/b/id/12645190-L.jpg", images: ["https://covers.openlibrary.org/b/id/12645190-L.jpg"], tags: ["romance", "classic", "fiction"] },
    { id: 1005, title: "The Catcher in the Rye", description: "The story of Holden Caulfield's experiences in New York City after being expelled from prep school.", price: 13.99, discountPercentage: 8, rating: 4.3, stock: 45, brand: "Little Brown", category: "fiction", thumbnail: "https://covers.openlibrary.org/b/id/8225265-L.jpg", images: ["https://covers.openlibrary.org/b/id/8225265-L.jpg"], tags: ["coming-of-age", "fiction", "classic"] },
    { id: 1006, title: "Sapiens: A Brief History of Humankind", description: "A groundbreaking narrative of humanity's creation and evolution that explores how we got here.", price: 24.99, discountPercentage: 25, rating: 4.9, stock: 30, brand: "Harper", category: "non-fiction", thumbnail: "https://covers.openlibrary.org/b/id/8122344-L.jpg", images: ["https://covers.openlibrary.org/b/id/8122344-L.jpg"], tags: ["history", "science", "non-fiction"] },
    { id: 1007, title: "The Hobbit", description: "Bilbo Baggins is swept into a quest to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug.", price: 16.99, discountPercentage: 12, rating: 4.8, stock: 80, brand: "Houghton Mifflin", category: "fantasy", thumbnail: "https://covers.openlibrary.org/b/id/14627280-L.jpg", images: ["https://covers.openlibrary.org/b/id/14627280-L.jpg"], tags: ["fantasy", "adventure", "classic"] },
    { id: 1008, title: "Harry Potter and the Sorcerer's Stone", description: "Harry Potter has never even heard of Hogwarts when letters start dropping on the doormat.", price: 19.99, discountPercentage: 15, rating: 4.9, stock: 120, brand: "Scholastic", category: "fantasy", thumbnail: "https://covers.openlibrary.org/b/id/7984916-L.jpg", images: ["https://covers.openlibrary.org/b/id/7984916-L.jpg"], tags: ["fantasy", "magic", "young adult"] },
    { id: 1009, title: "Thinking, Fast and Slow", description: "A tour of the mind that explains the two systems that drive the way we think.", price: 18.99, discountPercentage: 18, rating: 4.6, stock: 40, brand: "FSG", category: "non-fiction", thumbnail: "https://covers.openlibrary.org/b/id/8264657-L.jpg", images: ["https://covers.openlibrary.org/b/id/8264657-L.jpg"], tags: ["psychology", "science", "non-fiction"] },
    { id: 1010, title: "Dune", description: "Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides.", price: 15.99, discountPercentage: 10, rating: 4.7, stock: 55, brand: "Ace Books", category: "fiction", thumbnail: "https://covers.openlibrary.org/b/id/10525412-L.jpg", images: ["https://covers.openlibrary.org/b/id/10525412-L.jpg"], tags: ["sci-fi", "fiction", "epic"] },
    { id: 1011, title: "The Art of War", description: "An ancient Chinese military treatise that has become a classic of strategy and philosophy.", price: 8.99, discountPercentage: 5, rating: 4.4, stock: 200, brand: "Shambhala", category: "non-fiction", thumbnail: "https://covers.openlibrary.org/b/id/8948267-L.jpg", images: ["https://covers.openlibrary.org/b/id/8948267-L.jpg"], tags: ["philosophy", "strategy", "classic"] },
    { id: 1012, title: "A Game of Thrones", description: "Summers span decades. Winter can last a lifetime. And the struggle for the Iron Throne has begun.", price: 22.99, discountPercentage: 20, rating: 4.8, stock: 65, brand: "Bantam", category: "fantasy", thumbnail: "https://covers.openlibrary.org/b/id/14370265-L.jpg", images: ["https://covers.openlibrary.org/b/id/14370265-L.jpg"], tags: ["fantasy", "epic", "fiction"] }
];

async function fetchAPI(endpoint) {
    var res = await fetch(API + endpoint);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
}

export async function fetchProducts(limit) {
    if (!limit) limit = 100;
    store.setState({ loading: true });

    try {
        // Try to get products from DummyJSON
        var data = await fetchAPI('/products?limit=' + limit);
        var products = data.products.map(parseProduct);

        // Filter for book-like categories only
        var bookCategories = ['books', 'book', 'textbooks', 'literature', 'fiction', 'non-fiction', 'fantasy', 'mystery', 'romance', 'thriller'];
        var filteredProducts = products.filter(function(p) {
            var cat = p.category.toLowerCase();
            // Check if category is book-related OR if it looks like a book
            for (var i = 0; i < bookCategories.length; i++) {
                if (cat.indexOf(bookCategories[i]) !== -1) return true;
            }
            return false;
        });

        // If DummyJSON returns no book products, use our local book data
        if (filteredProducts.length < 4) {
            console.log('Using local book data - DummyJSON has limited books');
            store.setState({ products: localBooks, loading: false });
            return;
        }

        store.setState({ products: filteredProducts, loading: false });
    } catch (e) {
        // On error, use local book data
        console.log('API error, using local book data:', e.message);
        store.setState({ products: localBooks, loading: false });
    }
}

export async function fetchProductById(id) {
    store.setState({ loading: true });

    // Check local books first
    var localBook = localBooks.find(function(b) { return b.id === id; });
    if (localBook) {
        store.setState({ currentProduct: parseProduct(localBook), loading: false });
        return;
    }

    try {
        var data = await fetchAPI('/products/' + id);
        store.setState({ currentProduct: parseProduct(data), loading: false });
    } catch (e) {
        store.setState({ loading: false, error: 'Book not found' });
    }
}

export async function fetchCategories() {
    // Return only book-related categories
    var categories = ['all', 'fiction', 'non-fiction', 'fantasy', 'mystery', 'romance', 'thriller', 'classic'];
    store.setState({ categories: categories });
    return categories;
}