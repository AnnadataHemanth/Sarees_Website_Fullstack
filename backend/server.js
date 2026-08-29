const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const initializeDatabase = require("./database");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());


// ============================================================
// ROUTES
// ============================================================

app.get("/", (req, res) => {

    res.json({
        message: "Saavithri Handlooms API is running"
    });

});


app.get("/api/test-db", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            time: result.rows[0].now
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }

});


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", require("./routes/orderRoutes"));


// ============================================================
// SERVER
// ============================================================

const PORT = process.env.PORT || 5000;


async function startServer() {

    try {

        await initializeDatabase();

        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "Failed to start server:",
            error
        );

    }

}


startServer();