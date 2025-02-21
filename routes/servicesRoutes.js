const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shipyard', { useNewUrlParser: true, useUnifiedTopology: true });

const Order = mongoose.model('Order', new mongoose.Schema({
    budget: Number,
    technology: String,
    ship_type: String
}));

const Complaint = mongoose.model('Complaint', new mongoose.Schema({
    model: String,
    year: Number,
    ship_type: String,
    description: String
}));

const Financial = mongoose.model('Financial', new mongoose.Schema({
    year: Number,
    revenue: Number,
    expenses: Number
}));

// Ship Building Order
router.post('/order', async (req, res) => {
    const { budget, technology, ship_type } = req.body;
    const newOrder = new Order({ budget, technology, ship_type });
    await newOrder.save();
    res.json({ message: 'Order received', order: newOrder });
});

// Ship Repair Complaint Submission
router.post('/shiprepair/complaint', async (req, res) => {
    const { model, year, ship_type, description } = req.body;
    const newComplaint = new Complaint({ model, year, ship_type, description });
    await newComplaint.save();
    res.json({ message: 'Complaint submitted', complaint: newComplaint });
});

// Ship Repair Status Check (Mock Data)
router.get('/shiprepair/status', (req, res) => {
    res.json({ status: 'In Progress', estimatedCompletion: '2025-03-15' });
});

// Fetch Financial Reports (MongoDB Data)
router.get('/api/financials', async (req, res) => {
    const financialData = await Financial.find();
    res.json(financialData);
});

module.exports = router;