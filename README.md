# SHOP.CO E-Commerce Platform

A modern, responsive full-stack e-commerce application built with React 19, Vite, SCSS, Node.js, Express, and MongoDB.

---

## Quick Start

1. Backend Setup
```bash
cd backend
npm install
npm run start   # Starts on port 5000
```
To seed sample products, categories, admin, and customer users:
```bash
node seed.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts Vite development server
```

### 3. Demo Credentials
- **Admin Account**:
  - Email: `admin@shop.co`
  - Password: `admin123`
- **Customer Account**:
  - Email: `anshuman@example.com`
  - Password: `customer123`

# SHOP.CO

SHOP.CO is a full-stack e-commerce website built using the MERN stack.

## Tech Stack

- MongoDB - Database
- Express.js - Backend framework
- React.js - Frontend framework
- Node.js - Backend runtime
- Vite - Frontend development tool
- SCSS - Styling

## Features

### User Features

- Signup and login
- Browse products
- Search and filter products
- Sort products
- View product details
- Add products to cart
- Update and remove cart items
- Apply discount coupons
- Place orders
- View order history
- Track order status
- Update profile details

### Admin Features

- Admin dashboard
- Add, edit, and delete products
- Upload product images
- Manage categories
- View customer orders
- Update order status
- Check low-stock and out-of-stock products

## Backend

The backend is built using Node.js and Express.js.

It provides APIs that connect the React frontend with the MongoDB database. The backend handles users, products, categories, orders, authentication, and admin operations.

The main API sections are:

- `/api/auth` - Signup and login
- `/api/products` - Product operations
- `/api/categories` - Category operations
- `/api/orders` - Checkout and orders
- `/api/users` - User profile operations
- `/api/admin` - Admin operations

MongoDB is used to store the application data. Mongoose is used to work with MongoDB from the Node.js application.

The main data stored in the database includes:

- Users
- Products
- Categories
- Orders

Authentication is handled using JWT. After login, the server creates a token for the user. This token is sent with requests that require login.

Passwords are protected using bcrypt before being stored in the database.

The backend also checks user roles. Normal users can access customer features, while admin users can access admin features.

The checkout API checks product stock before creating an order and updates the available quantity after a successful purchase.

The backend also validates coupon codes so that users cannot simply change the discount amount from the frontend.

## Database

The project uses MongoDB Atlas or a local MongoDB database.

The MongoDB connection is configured using environment variables.
