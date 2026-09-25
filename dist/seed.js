"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_js_1 = require("./config/env.js");
const db_js_1 = require("./config/db.js");
const User_js_1 = require("./models/User.js");
const Category_js_1 = require("./models/Category.js");
const Book_js_1 = require("./models/Book.js");
const Review_js_1 = require("./models/Review.js");
const CartItem_js_1 = require("./models/CartItem.js");
const WishlistItem_js_1 = require("./models/WishlistItem.js");
const slugify_js_1 = require("./utils/slugify.js");
const categories = [
    { name: 'Fiction' },
    { name: 'Science Fiction & Fantasy' },
    { name: 'Classics' },
    { name: 'History' },
    { name: 'Science' },
    { name: 'Philosophy' },
    { name: 'Biography & Memoir' },
    { name: 'Psychology' },
];
const books = [
    {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        category: 'Fiction',
        price: 14.99,
        stock: 24,
        description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice. Harper Lees masterpiece views a world of great beauty and savage inequities through the eyes of a young girl.',
    },
    {
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        category: 'Fiction',
        price: 12.99,
        stock: 18,
        description: 'Winston Smith rewrites history for the Ministry of Truth in a world of perpetual war, omnipresent government surveillance, and the ever-watchful Big Brother.',
    },
    {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        category: 'Classics',
        price: 13.0,
        stock: 31,
        description: 'Jay Gatsby is the storys hope of the future, the man who reinvents himself in pursuit of the American dreams elusive green light.',
    },
    {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '9780141439518',
        category: 'Classics',
        price: 11.0,
        stock: 12,
        description: 'Mr. Bennets five eligible daughters are thrust into the sparkling world of English society, where wit, pride, and prejudice collide.',
    },
    {
        title: 'Dune',
        author: 'Frank Herbert',
        isbn: '9780441172719',
        category: 'Science Fiction & Fantasy',
        price: 16.0,
        stock: 42,
        description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides who would lead its nomadic tribes into battle against the Empire and become its messiah.',
    },
    {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        isbn: '9780547928227',
        category: 'Science Fiction & Fantasy',
        price: 15.99,
        stock: 4,
        description: 'Bilbo Baggins is a comfortable, unambitious hobbit until he is swept into an epic, dragon-guarded quest through Middle-earth.',
    },
    {
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        isbn: '9781451673319',
        category: 'Science Fiction & Fantasy',
        price: 14.0,
        stock: 0,
        description: 'Guy Montag is a fireman whose job is to destroy the most illegal of commodities—the printed book. Then one day a young woman awakens him to the scorching reality.',
    },
    {
        title: 'The Left Hand of Darkness',
        author: 'Ursula K. Le Guin',
        isbn: '9780441478125',
        category: 'Science Fiction & Fantasy',
        price: 13.5,
        stock: 9,
        description: 'A lone human emissary to Winter, a planet whose inhabitants can change gender, must overcome fear and prejudice to complete his mission.',
    },
    {
        title: 'Moby-Dick',
        author: 'Herman Melville',
        isbn: '9780142437247',
        category: 'Classics',
        price: 12.0,
        stock: 7,
        description: 'Call me Ishmael. A monumental allegory of obsession, vengeance, and the inscrutable nature of fate aboard the whaling ship Pequod.',
    },
    {
        title: 'The Odyssey',
        author: 'Homer',
        isbn: '9780140268867',
        category: 'Classics',
        price: 15.0,
        stock: 15,
        description: 'Odysseuss ten-year journey home from the Trojan War—an epic of temptation, endurance, and cunning survival in Robert Fagles celebrated translation.',
    },
    {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        isbn: '9780062316097',
        category: 'History',
        price: 18.99,
        stock: 27,
        description: 'From the emergence of Homo sapiens to the age of the Anthropocene, a sweeping narrative of how one species came to rule the planet.',
    },
    {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '9780553380163',
        category: 'Science',
        price: 13.0,
        stock: 3,
        description: 'From the Big Bang to black holes, Stephen Hawkings landmark book makes the frontiers of cosmology accessible to the general reader.',
    },
    {
        title: 'Cosmos',
        author: 'Carl Sagan',
        isbn: '9780345539434',
        category: 'Science',
        price: 16.99,
        stock: 21,
        description: 'Carl Sagans stirring exploration of the universe—thirteen interconnected chapters that celebrate science and the human spirit.',
    },
    {
        title: 'The Selfish Gene',
        author: 'Richard Dawkins',
        isbn: '9780198788607',
        category: 'Science',
        price: 14.5,
        stock: 6,
        description: 'An argument that evolution is driven by the gene, not the organism—the landmark work of modern evolutionary biology.',
    },
    {
        title: 'Meditations',
        author: 'Marcus Aurelius',
        isbn: '9780140449334',
        category: 'Philosophy',
        price: 10.0,
        stock: 33,
        description: 'The private reflections of a Roman emperor on duty, resilience, and the conduct of a life governed by reason.',
    },
    {
        title: 'The Diary of a Young Girl',
        author: 'Anne Frank',
        isbn: '9780553296983',
        category: 'Biography & Memoir',
        price: 9.99,
        stock: 19,
        description: 'The compelling diary of a young girl hiding from the Nazis—a portrait of adolescence, courage, and the endurance of hope.',
    },
    {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        isbn: '9780374533557',
        category: 'Psychology',
        price: 17.0,
        stock: 11,
        description: 'Nobel laureate Daniel Kahnemans exploration of the two systems that drive the way we think—and the biases that shape our choices.',
    },
    {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '9780316769488',
        category: 'Fiction',
        price: 12.0,
        stock: 0,
        description: 'Holden Caulfields restless, searching voice captures the loneliness of adolescence in this enduring American novel.',
    },
];
const reviews = [
    { book: 'To Kill a Mockingbird', user: 'demo@bookstore.com', rating: 5, comment: 'A quiet, devastating masterpiece. Atticus Finch is unforgettable.', status: 'approved' },
    { book: 'To Kill a Mockingbird', user: 'admin@store.com', rating: 4, comment: 'Beautifully written, though the pacing is slow in the middle chapters.', status: 'approved' },
    { book: 'Dune', user: 'demo@bookstore.com', rating: 5, comment: 'The world-building is astonishing. Pauls journey still resonates decades later.', status: 'approved' },
    { book: '1984', user: 'demo@bookstore.com', rating: 4, comment: 'Unsettling and essential. The appendix about Newspeak is fascinating.', status: 'approved' },
    { book: 'Sapiens', user: 'admin@store.com', rating: 5, comment: 'A sweeping, lucid history of our species. Hard to put down.', status: 'approved' },
    { book: 'The Hobbit', user: 'demo@bookstore.com', rating: 5, comment: 'Pure, joyful adventure. The perfect introduction to Middle-earth.', status: 'approved' },
    { book: 'Moby-Dick', user: 'demo@bookstore.com', rating: 3, comment: 'Dense and digressive, but the final chase is worth the voyage.', status: 'pending' },
];
async function seed() {
    if (!env_js_1.env.mongoUri)
        throw new Error('MONGODB_URI is not set in server/.env');
    await (0, db_js_1.connectDB)();
    console.log('Clearing existing data...');
    await Promise.all([
        User_js_1.UserModel.deleteMany({}),
        Category_js_1.CategoryModel.deleteMany({}),
        Book_js_1.BookModel.deleteMany({}),
        Review_js_1.ReviewModel.deleteMany({}),
        CartItem_js_1.CartItemModel.deleteMany({}),
        WishlistItem_js_1.WishlistItemModel.deleteMany({}),
        mongoose_1.default.connection.collection('orders').deleteMany({}),
    ]);
    const adminHash = await bcryptjs_1.default.hash('admin123', 10);
    const demoHash = await bcryptjs_1.default.hash('demo123', 10);
    const admin = await User_js_1.UserModel.create({
        name: 'Store Admin',
        email: 'admin@bookstore.com',
        passwordHash: adminHash,
        role: 'admin',
    });
    const demo = await User_js_1.UserModel.create({
        name: 'Demo Customer',
        email: 'demo@bookstore.com',
        passwordHash: demoHash,
        role: 'customer',
    });
    console.log(`Users: admin (${admin.email}), demo customer (${demo.email})`);
    const createdCategories = await Category_js_1.CategoryModel.insertMany(categories.map((c) => ({ name: c.name, slug: (0, slugify_js_1.slugify)(c.name) })));
    const categoryBySlug = new Map(createdCategories.map((c) => [c.slug, c._id]));
    console.log(`Categories: ${createdCategories.length}`);
    const bookDocs = books.map((b) => {
        const category = categoryBySlug.get((0, slugify_js_1.slugify)(b.category));
        if (!category)
            throw new Error(`Unknown category: ${b.category}`);
        return {
            ...b,
            category,
            coverImage: `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`,
        };
    });
    const insertedBooks = await Book_js_1.BookModel.insertMany(bookDocs);
    console.log(`Books: ${insertedBooks.length}`);
    const bookByTitle = new Map(insertedBooks.map((b) => [b.title, b._id]));
    const reviewDocs = reviews.map((r) => {
        const book = bookByTitle.get(r.book);
        if (!book)
            throw new Error(`Unknown book in review: ${r.book}`);
        const user = r.user === 'admin@store.com' ? admin : demo;
        return {
            book,
            user: user._id,
            rating: r.rating,
            comment: r.comment,
            status: r.status,
        };
    });
    const insertedReviews = await Review_js_1.ReviewModel.insertMany(reviewDocs);
    console.log(`Reviews: ${insertedReviews.length}`);
    const aggregate = await Review_js_1.ReviewModel.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: '$book', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    for (const row of aggregate) {
        await Book_js_1.BookModel.updateOne({ _id: row.book }, { $set: { ratingAvg: Math.round(row.avg * 10) / 10, ratingCount: row.count } });
    }
    console.log('--- Seed complete ---');
    console.log('Admin login:    admin@bookstore.com / admin123');
    console.log('Customer login: demo@bookstore.com / demo123');
    await (0, db_js_1.disconnectDB)();
    process.exit(0);
}
seed().catch(async (err) => {
    console.error('Seed failed:', err);
    await (0, db_js_1.disconnectDB)();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map