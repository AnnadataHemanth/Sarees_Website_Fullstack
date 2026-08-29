import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Outlet,
    Navigate
} from "react-router-dom";

import {
    AuthProvider,
    useAuth
} from "./context/AuthContext";

import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNavbar from "./components/AdminNavbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

import AdminDashboard from "./pages/AdminDashboard";


// ============================================================
// CUSTOMER LAYOUT
// ============================================================

function CustomerLayout() {
    const { user } = useAuth();

    if (user?.role === "admin") {
        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }

    return (
        <div className="app">

            <Navbar />

            <Outlet />

            <Footer />

        </div>
    );
}


// ============================================================
// ADMIN LAYOUT
// ============================================================

function AdminLayout() {
    const { user } = useAuth();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (user.role !== "admin") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <div className="admin-app">

            <AdminNavbar />

            <Outlet />

        </div>
    );
}


// ============================================================
// NOT FOUND
// ============================================================

function NotFound() {
    const { user } = useAuth();

    if (user?.role === "admin") {
        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }

    return (
        <main className="page-center">

            <h1>
                Page Not Found
            </h1>

            <Link
                to="/"
                className="primary-button"
            >
                Back Home
            </Link>

        </main>
    );
}


// ============================================================
// APP
// ============================================================

function App() {
    return (
        <BrowserRouter>

            <AuthProvider>

                <CartProvider>

                    <Routes>

                        {/* ====================================
                            CUSTOMER
                        ==================================== */}

                        <Route
                            element={<CustomerLayout />}
                        >

                            <Route
                                path="/"
                                element={<Home />}
                            />

                            <Route
                                path="/products"
                                element={<Products />}
                            />

                            <Route
                                path="/products/:id"
                                element={<ProductDetails />}
                            />

                            <Route
                                path="/login"
                                element={<Login />}
                            />

                            <Route
                                path="/register"
                                element={<Register />}
                            />

                            <Route
                                path="/cart"
                                element={<Cart />}
                            />

                            <Route
                                path="/checkout"
                                element={<Checkout />}
                            />

                            <Route
                                path="/orders"
                                element={<MyOrders />}
                            />

                        </Route>


                        {/* ====================================
                            ADMIN
                        ==================================== */}

                        <Route
                            element={<AdminLayout />}
                        >

                            <Route
                                path="/admin"
                                element={<AdminDashboard />}
                            />

                        </Route>


                        {/* ====================================
                            FALLBACK
                        ==================================== */}

                        <Route
                            path="*"
                            element={<NotFound />}
                        />

                    </Routes>

                </CartProvider>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;