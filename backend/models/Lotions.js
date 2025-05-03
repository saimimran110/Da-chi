const mongoose = require('mongoose');

// Define the schema for lotions
const lotionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true }, // Add stock field
});

// Create the model
const Lotion = mongoose.model('Lotion', lotionSchema);

module.exports = Lotion;