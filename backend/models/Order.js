const mongoose = require('mongoose');

// Define the schema for orders
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // User who placed the order
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true }, // Total amount for the order
    status: { type: String, default: 'Pending' }, // Order status (e.g., Pending, Completed)
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the order was placed
});

// Create the model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;