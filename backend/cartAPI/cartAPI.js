const express = require('express');
const Cart = require('../models/Cart'); // Import the Cart model
const router = express.Router();

// GET API: Retrieve the cart for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the cart for the given user ID
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.json({ items: [] }); // Return an empty cart if none exists
        }

        // Return the cart with all items
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST API: Add an item to the cart
router.post('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, name, image, price, rating, description } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            // Update quantity and total price
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.quantity * existingItem.price;
        } else {
            // Add new product to the cart
            cart.items.push({
                productId,
                name,
                image,
                price,
                rating,
                description,
                quantity: 1,
                totalPrice: price,
            });
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE API: Remove an item from the cart
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// PUT API: Update the quantity of an item in the cart
router.put('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { mode } = req.body; // Mode can be 'increment' or 'decrement'

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find((item) => item.productId.toString() === productId);
        if (item) {
            if (mode === 'increment') {
                // Increment quantity
                item.quantity += 1;
            } else if (mode === 'decrement') {
                // Decrement quantity, but ensure it doesn't go below 1
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    return res.status(400).json({ message: 'Quantity cannot be less than 1' });
                }
            } else {
                return res.status(400).json({ message: 'Invalid mode. Use "increment" or "decrement".' });
            }

            // Update total price
            item.totalPrice = item.quantity * item.price;
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;