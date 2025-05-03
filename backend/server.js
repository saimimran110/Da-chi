const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Import dotenv
const colors = require('colors'); // Import colors for colored logs

dotenv.config(); // Load environment variables from .env

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));

// MongoDB connection
const mongoURI = `mongodb+srv://cym786:${process.env.DB_PASSWORD}@cluster0.ke8ivmy.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'.blue)) // Log in blue
    .catch(err => console.error('Error connecting to MongoDB:'.red, err));

// Routes
app.get('/', (req, res) => {
    res.send("Hello World!");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.green); // Log in green
});