const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Associate the cart with a user
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            rating: { type: Number, required: true },
            description: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            totalPrice: { type: Number, required: true }, // price * quantity
        },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;