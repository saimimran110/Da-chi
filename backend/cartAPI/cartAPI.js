const express = require('express');
const Cart = require('../models/Cart'); // Import the Cart model
const router = express.Router();
const Deodorant = require('../models/Deodorant'); // Import the Deodorant model
const Lotion = require('../models/Lotions'); // Import the Lotion model
const Perfume = require('../models/Perfume'); // Import the Perfume model
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

        // Fetch the product to check stock
        const product = await Perfume.findById(productId) || 
                        await Deodorant.findById(productId) || 
                        await Lotion.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < 1) {
            return res.status(400).json({ message: 'Product is out of stock' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            if (existingItem.quantity + 1 > product.stock) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.quantity * existingItem.price;
        } else {
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
        const { mode } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find((item) => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Fetch the product to check stock
        const product = await Perfume.findById(productId) || 
                        await Deodorant.findById(productId) || 
                        await Lotion.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (mode === 'increment') {
            if (item.quantity + 1 > product.stock) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            item.quantity += 1;
        } else if (mode === 'decrement') {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                return res.status(400).json({ message: 'Quantity cannot be less than 1' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid mode. Use "increment" or "decrement".' });
        }

        item.totalPrice = item.quantity * item.price;
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;