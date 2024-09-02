# Simple E-Commerce Application 

This is a simple e-commerce application REST API built with Node.js, Express.js, and PostgreSQL. It provides user authentication and supports different functionalities for sellers and buyers.

## Features

- **User Authentication**: Sign up and login functionality for both sellers and buyers.
- **Seller Functionality**: 
  - Add, edit, and delete products.
- **Buyer Functionality**: 
  - Search for products by name or category.
  - Add and remove products from the cart.

## Tech Stack

- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **PostgreSQL**: Relational database management system.
- **Libraries**: Additional packages for tasks like authentication, validation, and database interaction.

## Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed.
- **PostgreSQL**: Ensure that PostgreSQL is installed and running.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    ```
2. Navigate into the project directory:
    ```bash
    cd your-repo-name
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory and add the following environment variables:
    ```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=shahbaz
    DB_NAME=ecommerce
    JWT_SECRET=shahbaz
    ```

5. Set up the PostgreSQL database by creating the necessary tables. You can use a migration tool like `pg-migrate` or manually execute SQL commands.

### Database Setup

Create the following tables in your PostgreSQL database:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('seller', 'buyer')) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL
);
## API Endpoints

### User Endpoints

- **Sign Up**: `POST /api/users/signup`
- **Login**: `POST /api/users/login`

### Seller Endpoints

- **Add Product**: `POST /api/seller/products`
- **Edit Product**: `PUT /api/seller/products/:id`
- **Delete Product**: `DELETE /api/seller/products/:id`

### Buyer Endpoints

- **Search Products**: `GET /api/buyer/products`
- **Add to Cart**: `POST /api/buyer/cart`
- **Remove from Cart**: `DELETE /api/buyer/cart/:id`

## Start the development server:
- npm run server

## Testing the API

You can use tools like [ThunderClient](https://www.thunderclient.com/) or [Postman](https://www.postman.com/) to test the API endpoints.
