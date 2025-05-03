const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Import multer for file uploads
const path = require('path');
const connectDB = require('./db'); // Import the database connection function
const Deodorant = require('./models/Deodorant'); // Import the Deodorant model
const Lotion = require('./models/Lotions'); // Import the Lotion model
const Perfume = require('./models/Perfume'); // Import the Perfume model
const Logo = require('./models/Logo');
const cartAPI = require('./cartAPI/cartAPI');
const Order = require('./models/order'); // Import the Order model
const Cart = require('./models/Cart'); // Import the Cart model

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON request bodies

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Save with a unique name
    },
});
const upload = multer({ storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('API is running...'); // Simple message to indicate the server is running
});

// POST API: Add a new deodorant
app.post('/api/deodorants', upload.single('image'), async (req, res) => {
    try {
        const { name, price, rating, description, stock } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Save the image path

        // Validate the request body
        if (!name || !price || !image || !rating || !description || !stock) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new deodorant document
        const deodorant = new Deodorant({ name, price, image, rating, description, stock });
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

// POST API: Add a new lotion
app.post('/api/lotions', upload.single('image'), async (req, res) => {
    try {
        const { name, price, rating, description, stock } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Save the image path

        // Validate the request body
        if (!name || !price || !image || !rating || !description || !stock) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new lotion document
        const lotion = new Lotion({ name, price, image, rating, description, stock });
        await lotion.save();

        res.status(201).json(lotion); // Respond with the newly created lotion
    } catch (error) {
        console.error('Error adding lotion:', error);
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

// POST API: Add a new perfume
app.post('/api/perfumes', upload.single('image'), async (req, res) => {
    try {
        const { name, price, rating, description, stock } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !price || !rating || !description || !image || !stock) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const perfume = new Perfume({ name, image, price, rating, description, stock });
        await perfume.save();

        res.status(201).json(perfume);
    } catch (error) {
        console.error('Error adding perfume:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve all perfumes
app.get('/api/perfumes', async (req, res) => {
    try {
        const perfumes = await Perfume.find(); // Fetch all perfumes from the database
        res.json(perfumes); // Send the perfumes as JSON
    } catch (error) {
        console.error('Error fetching perfumes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST API: Upload a new logo
app.post('/api/logo', upload.single('image'), async (req, res) => {
    try {
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Save the image path

        // Validate the request body
        if (!image) {
            return res.status(400).json({ message: 'Logo image is required' });
        }

        // Create a new logo document
        const logo = new Logo({ image });
        await logo.save();

        res.status(201).json(logo); // Respond with the newly created logo
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve the logo
app.get('/api/logo', async (req, res) => {
    try {
        const logo = await Logo.findOne(); // Fetch the first logo document from the database
        if (!logo) {
            return res.status(404).json({ message: 'Logo not found' });
        }
        res.json(logo); // Send the logo as JSON
    } catch (error) {
        console.error('Error fetching logo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// GET API: Retrieve trending products
app.get('/api/trendings', async (req, res) => {
    try {
        // Fetch products with a rating of 4.5 or above
        const perfumes = await Perfume.find({ rating: { $gte: 4.5 } });
        const deodorants = await Deodorant.find({ rating: { $gte: 4.5 } });
        const lotions = await Lotion.find({ rating: { $gte: 4.5 } });

        // Create the response object
        const trendingProducts = {
            PERFUMES: perfumes,
            DEODORANTS: deodorants,
            LOTIONS: lotions,
        };

        res.json(trendingProducts); // Send the trending products as JSON
    } catch (error) {
        console.error('Error fetching trending products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve all orders for a specific user
app.get('/api/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all orders for the given user ID
        const orders = await Order.find({ userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.json(orders); // Send the orders as JSON
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST API: Place an order
app.post('/api/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate the total amount
        const totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

        // Create a new order
        const order = new Order({
            userId,
            items: cart.items,
            totalAmount,
        });
        await order.save();

        // Clear the user's cart after placing the order
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Helper function to get the product type based on the product ID
const getProductTypeById = async (productId) => {
    // Check each product collection for the given ID
    const deodorant = await Deodorant.findById(productId);
    if (deodorant) return { productType: 'Deodorant', product: deodorant };

    const lotion = await Lotion.findById(productId);
    if (lotion) return { productType: 'Lotion', product: lotion };

    const perfume = await Perfume.findById(productId);
    if (perfume) return { productType: 'Perfume', product: perfume };

    // If no product is found, return null
    return null;
};

// POST API: Submit an order (direct buy)
app.post('/api/submit-order', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate the request body
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get the product type and product details using the helper function
        const result = await getProductTypeById(productId);
        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { productType, product } = result;

        // Check if the requested quantity is available
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Subtract the quantity from the product's stock
        product.stock -= quantity;
        await product.save();

        // Calculate the total price
        const totalPrice = product.price * quantity;

        // Create a new order
        const order = new Order({
            userId,
            items: [
                {
                    productId: product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity,
                    totalPrice,
                },
            ],
            totalAmount: totalPrice,
        });
        await order.save();

        res.status(201).json({ message: 'Order submitted successfully', order });
    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Cart api
app.use('/api/cart', cartAPI);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.green); // Log in green
});