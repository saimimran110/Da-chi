const mongoose = require('mongoose');

// Define the schema for perfumes
const perfumeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true }, // Add stock field
});

// Create the model
const Perfume = mongoose.model('Perfume', perfumeSchema);

module.exports = Perfume;