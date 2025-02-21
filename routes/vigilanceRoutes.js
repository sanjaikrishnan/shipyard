// vigilanceRoute.js
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Grievance = require('../models/Grievance'); // Create a Mongoose model for grievances

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

// Render vigilance page
router.get('/vigilance', (req, res) => {
    res.render('vigilance');
});

// Submit a grievance
router.post('/vigilance/report', upload.single('evidence'), async (req, res) => {
    try {
        const newGrievance = new Grievance({
            name: req.body.name || 'Anonymous',
            contactDetails: req.body.contactDetails || 'Not Provided',
            complaintType: req.body.complaintType,
            description: req.body.description,
            evidence: req.file ? req.file.path : 'No file uploaded'
        });
        await newGrievance.save();
        res.redirect('/vigilance');
    } catch (error) {
        res.status(500).send('Error submitting grievance');
    }
});

module.exports = router;