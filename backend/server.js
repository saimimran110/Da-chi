const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // Import the database connection function

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send("Hello World!");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.green); // Log in green
});