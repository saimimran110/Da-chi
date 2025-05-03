const mongoose = require('mongoose');
const colors = require('colors'); // Import colors for colored logs
const dotenv = require('dotenv'); // Import dotenv

dotenv.config(); // Load environment variables from .env

const connectDB = async () => {
    try {
        const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ke8ivmy.mongodb.net/?retryWrites=true&w=majority`;
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB'.blue); // Log in blue
    } catch (err) {
        console.error('Error connecting to MongoDB:'.red, err);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;