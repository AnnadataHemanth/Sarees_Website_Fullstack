const pool = require("./db");

async function initializeDatabase() {
    try {
        // USERS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // PRODUCTS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price NUMERIC(10, 2) NOT NULL,
                image VARCHAR(500),
                category VARCHAR(100),
                stock INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // ORDERS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                customer_name VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                address TEXT NOT NULL,
                total NUMERIC(10, 2) NOT NULL,
                status VARCHAR(30) NOT NULL DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // ORDER ITEMS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER NOT NULL
                    REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER
                    REFERENCES products(id) ON DELETE SET NULL,
                product_name VARCHAR(255) NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1
            );
        `);

        console.log("Database tables initialized successfully.");

    } catch (error) {
        console.error("Database initialization failed:");
        console.error(error);
        process.exit(1);
    }
}

module.exports = initializeDatabase;