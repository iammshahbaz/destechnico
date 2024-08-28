const express = require('express');
const authMiddleware = require('../Middleware/authMiddleware')
const pool = require('../db');

const buyerRouter = express.Router();

// Search Products
buyerRouter.get('/products', async (req, res) => {
    const { name, category } = req.query;

    try {
        let query = 'SELECT * FROM products WHERE 1=1';
        const queryParams = [];

        if (name) {
            queryParams.push(`%${name}%`);
            query += ` AND name ILIKE $${queryParams.length}`;
        }

        if (category) {
            queryParams.push(category);
            query += ` AND category = $${queryParams.length}`;
        }

        const products = await pool.query(query, queryParams);
        res.status(200).json(products.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Add to Cart
buyerRouter.post('/cart', authMiddleware, async (req, res) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).json({ message: 'Access denied. Only buyers can add products to the cart.' });
    }

    const { productId, quantity } = req.body;

    try {
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const newCartItem = await pool.query(
            'INSERT INTO cart (buyer_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, productId, quantity || 1]
        );
        res.status(201).json(newCartItem.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Remove from Cart
buyerRouter.delete('/cart/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).json({ message: 'Access denied. Only buyers can remove products from the cart.' });
    }

    try {
        const cartItem = await pool.query('SELECT * FROM cart WHERE id = $1 AND buyer_id = $2', [req.params.id, req.user.id]);
        if (cartItem.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found in your cart.' });
        }

        await pool.query('DELETE FROM cart WHERE id = $1', [req.params.id]);
        res.status(200).json({ message: 'Item removed from cart.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = buyerRouter;
