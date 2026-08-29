# Saavithri Handlooms

A full-stack e-commerce web application built for **Saavithri Handlooms**, a saree business based in Hyderabad, India.

Saavithri Handlooms provides customers with an online platform to browse sarees, search and filter products, manage a shopping cart, place orders, and track order status. A dedicated admin dashboard allows administrators to manage products, inventory, and customer orders.

## Features

### Customer Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Browse saree collection
- Search products
- Filter products by category
- View product details
- Add products to cart
- Increase and decrease product quantity
- Remove products from cart
- Clear shopping cart
- Checkout with delivery details
- Place orders
- View order history
- Track order status

### Admin Features

- Secure admin authentication
- Dedicated admin dashboard
- Separate admin navigation
- Product management
- Add products
- Delete products
- Manage product stock
- View total products
- View total orders
- View pending orders
- View customer orders
- Update order status

## Technology Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- React Context API

### Backend

- Node.js
- Express.js
- REST APIs
- JSON Web Tokens (JWT)
- bcrypt

### Database

- PostgreSQL

## Architecture

```text
                         SAAVITHRI HANDLOOMS
                                  |
                   +--------------+--------------+
                   |                             |
                   v                             v
             React Frontend                Node.js Backend
                   |                             |
                   |                       Express REST API
                   |                             |
                   +------------- API ------------+
                                  |
                                  v
                             PostgreSQL
```

## Application Flow

### Customer Flow

```text
Register / Login
       |
       v
Browse Sarees
       |
       v
Product Details
       |
       v
Add to Cart
       |
       v
Shopping Cart
       |
       v
Checkout
       |
       v
Place Order
       |
       v
Order Stored in PostgreSQL
       |
       v
My Orders
       |
       v
Track Order Status
```

### Admin Flow

```text
Admin Login
      |
      v
Admin Dashboard
      |
      +----------------------+
      |                      |
      v                      v
   Products                Orders
      |                      |
      v                      v
Add Product            View Orders
Delete Product              |
Stock Management             v
                         Update Status
```

## Project Structure

```text
Saavithri Handlooms/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── hero.png
│   │   │
│   │   ├── components/
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Products.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Frontend Routes

```text
/                         Home
/products                 Product Collection
/products/:id             Product Details
/login                    Login
/register                 Registration
/cart                     Shopping Cart
/checkout                 Checkout
/orders                   Customer Orders
/admin                    Admin Dashboard
```

## REST API

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Products

```text
GET    /api/products
GET    /api/products/categories
GET    /api/products/:id

POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```text
POST /api/orders
GET  /api/orders/my-orders
GET  /api/orders/:id

GET  /api/orders/admin/all
PUT  /api/orders/admin/:id/status
```

## Database

The application uses PostgreSQL for persistent data storage.

### Main Tables

```text
users
products
orders
order_items
```

### Users

The `users` table stores:

- User ID
- Name
- Email
- Password hash
- Role
- Created date

Supported roles:

```text
user
admin
```

### Products

The `products` table stores:

- Product ID
- Name
- Description
- Price
- Image
- Category
- Stock

### Orders

The `orders` table stores:

- Order ID
- User ID
- Customer name
- Phone number
- Delivery address
- Total
- Status
- Created date

### Order Items

The `order_items` table stores:

- Order item ID
- Order ID
- Product ID
- Product name
- Price
- Quantity

## Authentication and Authorization

The application uses JWT-based authentication.

```text
User Login
    |
    v
Credentials Verified
    |
    v
JWT Generated
    |
    v
Token Stored by Frontend
    |
    v
Protected API Request
    |
    v
Authorization: Bearer <token>
    |
    v
JWT Verification Middleware
    |
    v
Request Authorized
```

Admin routes additionally verify that the authenticated user's role is `admin`.

Passwords are hashed using bcrypt before being stored in PostgreSQL.

## Shopping Cart

The shopping cart allows customers to:

- Add products
- Increase quantity
- Decrease quantity
- Remove products
- Clear the cart
- View item count
- View total price
- Proceed to checkout

## Order Processing

When a customer places an order:

```text
Select Products
      |
      v
Shopping Cart
      |
      v
Checkout
      |
      v
Backend Validates Products
      |
      v
Backend Checks Stock
      |
      v
Backend Calculates Total
      |
      v
Order Created
      |
      v
Order Items Created
      |
      v
Product Stock Updated
```

The backend calculates the order total using the actual prices stored in PostgreSQL rather than trusting prices sent by the client.

## Order Status

Orders can have the following statuses:

```text
Pending
Confirmed
Processing
Shipped
Delivered
Cancelled
```

Administrators can update the order status from the admin dashboard.

## Admin Dashboard

The admin dashboard is available at:

```text
http://localhost:5173/admin
```

The admin dashboard is separate from the customer-facing website and contains:

- Dashboard statistics
- Product management
- Inventory management
- Customer orders
- Order status management

## Local Development

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- Git

### Clone the Repository

```bash
git clone https://github.com/AnnadataHemanth/Sarees_Website_Fullstack
cd saavithri-handlooms
```

Replace `YOUR_USERNAME` with the GitHub username that owns the repository.

### Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE saavithri_handlooms;
```

Make sure PostgreSQL is running.

The application requires the following tables:

```text
users
products
orders
order_items
```

### Backend Setup

```bash
cd backend
npm install
```

Create a local `.env` file using `backend/.env.example` as a reference.

Example:

```env
PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=saavithri_handlooms
DB_PASSWORD=your_database_password
DB_PORT=5432

JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
node server.js
```

Backend URL:

```text
http://localhost:5000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a local `.env` file using `frontend/.env.example` as a reference.

Example:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Environment Variables

### Backend

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=saavithri_handlooms
DB_PASSWORD=your_database_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### Frontend

```env
VITE_API_URL=http://localhost:5000
```

Never commit real `.env` files containing database credentials, JWT secrets, API keys, or other sensitive information.

Use `.env.example` files to document the required configuration.

## Security

The application includes:

- JWT authentication
- Password hashing using bcrypt
- Protected API routes
- Role-based admin authorization
- Server-side price calculation
- Server-side stock validation
- Environment-based secret configuration

## Current Project Scope

The current version implements the core e-commerce workflow:

```text
Product Catalogue
       |
       v
Product Details
       |
       v
Shopping Cart
       |
       v
Checkout
       |
       v
Order Creation
       |
       v
Customer Order History
       |
       v
Admin Order Management
```

## Future Improvements

Possible future improvements include:

- Product image uploads instead of image URLs
- Cloud image storage
- Product editing
- Online payment integration
- Delivery charge calculation
- Pincode validation
- Customer profiles
- Multiple delivery addresses
- WhatsApp integration
- Email notifications
- Order notifications
- Advanced inventory management
- Product reviews and ratings
- Wishlist functionality
- Product sorting
- Analytics and reporting
- Production deployment
- Custom domain
- HTTPS and SSL
- Monitoring and logging

## Learning Outcomes

This project demonstrates practical experience with:

- Full-stack web development
- React
- Vite
- React Router
- React Context API
- Component-based frontend development
- Node.js
- Express.js
- REST API development
- PostgreSQL
- SQL
- CRUD operations
- JWT authentication
- Role-based access control
- Password hashing
- Shopping cart implementation
- Checkout and order processing
- Inventory management
- Frontend and backend integration
- Responsive UI development

## Business Use Case

Saavithri Handlooms is a saree business based in Hyderabad, India.

The application provides a digital storefront where customers can discover sarees, view product details, place orders, provide delivery information, and track their orders.

The business can manage products, inventory, and customer orders through a dedicated admin dashboard.

## Future Production Roadmap

```text
Product Image Upload
        |
        v
Cloud Image Storage
        |
        v
Payment Gateway
        |
        v
Delivery Integration
        |
        v
Production Database
        |
        v
Backend Deployment
        |
        v
Frontend Deployment
        |
        v
Custom Domain
        |
        v
HTTPS / SSL
        |
        v
Monitoring
```

## Author

**Hemanth Annadata**

B.Tech - Artificial Intelligence & Data Science  
IFHE University, Hyderabad

## Project Type

**Full-Stack E-Commerce Web Application**

Built using:

```text
React
Node.js
Express.js
PostgreSQL
JWT
bcrypt
```

## License

This project was developed as an internship project and is intended for educational, portfolio, and demonstration purposes.
