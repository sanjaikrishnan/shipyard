// tenderRoute.js
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Tender = require('../models/Tender'); // Create a Mongoose model for tenders
const Bid = require('../models/Bid'); // Create a Mongoose model for bids

const router = express.Router();

// File storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Get all open tenders
router.get('/tenders', async (req, res) => {
    try {
        const tenders = await Tender.find();
        res.render('tenders', { tenders });
    } catch (error) {
        res.status(500).send('Error fetching tenders');
    }
});

// Submit a bid
router.post('/tenders/apply', upload.single('document'), async (req, res) => {
    try {
        const newBid = new Bid({
            companyName: req.body.companyName,
            contactDetails: req.body.contactDetails,
            bidAmount: req.body.bidAmount,
            document: req.file.path
        });
        await newBid.save();
        res.redirect('/tenders');
    } catch (error) {
        res.status(500).send('Error submitting bid');
    }
});

module.exports = router;