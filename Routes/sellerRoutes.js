const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../Middleware/authMiddleware')
const pool = require('../db');

const sellerRouter = express.Router();

// Add Product
sellerRouter.post('/products', authMiddleware, [
    body('name').notEmpty().trim().escape(),
    body('category').notEmpty().trim().escape(),
    body('description').trim().escape(),
    body('price').isFloat({ gt: 0 }),
    body('discount').optional().isFloat({ min: 0, max: 100 })
], async (req, res) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Access denied. Only sellers can add products.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, description, price, discount } = req.body;

    try {
        const newProduct = await pool.query(
            'INSERT INTO products (name, category, description, price, discount, seller_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, category, description, price, discount, req.user.id]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Edit Product
sellerRouter.put('/products/:id', authMiddleware, [
    body('name').optional().trim().escape(),
    body('category').optional().trim().escape(),
    body('description').optional().trim().escape(),
    body('price').optional().isFloat({ gt: 0 }),
    body('discount').optional().isFloat({ min: 0, max: 100 })
], async (req, res) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Access denied. Only sellers can edit products.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, description, price, discount } = req.body;

    try {
        const product = await pool.query('SELECT * FROM products WHERE id = $1 AND seller_id = $2', [req.params.id, req.user.id]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found or you are not authorized to edit this product.' });
        }

        const updatedProduct = await pool.query(
            `UPDATE products SET 
             name = COALESCE($1, name), 
             category = COALESCE($2, category), 
             description = COALESCE($3, description), 
             price = COALESCE($4, price), 
             discount = COALESCE($5, discount) 
             WHERE id = $6 RETURNING *`,
            [name, category, description, price, discount, req.params.id]
        );
        res.status(200).json(updatedProduct.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete Product
sellerRouter.delete('/products/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Access denied. Only sellers can delete products.' });
    }

    try {
        const product = await pool.query('SELECT * FROM products WHERE id = $1 AND seller_id = $2', [req.params.id, req.user.id]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found or you are not authorized to delete this product.' });
        }

        await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = sellerRouter;
