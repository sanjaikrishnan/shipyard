const express = require("express");
const router = express.Router();
const Support = require("../models/Support");

// Support Page (Display Form & Previous Requests)
router.get("/", async (req, res) => {
    const supportRequests = await Support.find();
    res.render("support", { requests: supportRequests });
});

// Handle Form Submission
router.post("/", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.send("All fields are required.");
    }

    const newRequest = new Support({ name, email, message });
    await newRequest.save();

    res.send("Your support request has been submitted!");
});

// Admin Response Update (Mock: In real use case, admin would update via panel)
router.post("/respond/:id", async (req, res) => {
    const { response } = req.body;
    const requestId = req.params.id;

    await Support.findByIdAndUpdate(requestId, { response, status: "Resolved" });
    res.send("Response recorded successfully!");
});

module.exports = router;