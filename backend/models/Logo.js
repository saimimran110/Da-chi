const mongoose = require('mongoose');

// Define the schema for the logo
const logoSchema = new mongoose.Schema({
    image: { type: String, required: true }, // Path to the logo image
});

// Create the model
const Logo = mongoose.model('Logo', logoSchema);

module.exports = Logo;