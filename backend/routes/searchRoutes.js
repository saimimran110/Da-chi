const express = require('express');
const Deodorant = require('../models/Deodorant');
const Lotion = require('../models/Lotions');
const Perfume = require('../models/Perfume');

const router = express.Router();

// Search product by name across all collections
router.get('/search-product', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  try {
    // Search in lotions
    const lotion = await Lotion.findOne({ name: { $regex: name, $options: 'i' } });
    if (lotion) {
      return res.json({ ...lotion.toObject(), category: 'lotions' });
    }

    // Search in deodorants
    const deodorant = await Deodorant.findOne({ name: { $regex: name, $options: 'i' } });
    if (deodorant) {
      return res.json({ ...deodorant.toObject(), category: 'deodorants' });
    }

    // Search in perfumes
    const perfume = await Perfume.findOne({ name: { $regex: name, $options: 'i' } });
    if (perfume) {
      return res.json({ ...perfume.toObject(), category: 'perfumes' });
    }

    // If no product is found
    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    console.error('Error searching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;