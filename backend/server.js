const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // Import the database connection function
const Deodorant = require('./models/Deodorant'); // Import the Deodorant model

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON request bodies

// Connect to MongoDB
connectDB();
app.get('/', (req, res) => {    
    res.send('API is running...'); // Simple message to indicate the server is running
}   );

// POST API: Add a new deodorant
app.post('/api/deodorants', async (req, res) => {
    try {
        const { name, image, price, rating, description } = req.body;

        // Validate the request body
        if (!name || !image || !price || !rating || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new deodorant document
        const deodorant = new Deodorant({ name, image, price, rating, description });
        await deodorant.save();

        res.status(201).json(deodorant); // Respond with the newly created deodorant
    } catch (error) {
        console.error('Error adding deodorant:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve all deodorants
app.get('/api/deodorants', async (req, res) => {
    try {
        const deodorants = await Deodorant.find(); // Fetch all deodorants from the database
        res.json(deodorants); // Send the deodorants as JSON
    } catch (error) {
        console.error('Error fetching deodorants:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve all lotions
app.get('/api/lotions', async (req, res) => {
    try {
        const lotions = await Lotion.find(); // Fetch all lotions from the database
        res.json(lotions); // Send the lotions as JSON
    } catch (error) {
        console.error('Error fetching lotions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST API: Add a new lotion
app.post('/api/lotions', async (req, res) => {
    try {
        const { name, price, image, rating, description } = req.body;

        // Validate the request body
        if (!name || !price || !image || !rating || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new lotion document
        const lotion = new Lotion({ name, price, image, rating, description });
        await lotion.save();

        res.status(201).json(lotion); // Respond with the newly created lotion
    } catch (error) {
        console.error('Error adding lotion:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.green); // Log in green
});