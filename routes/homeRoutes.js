const express = require("express");
const User = require("../models/user");

const router = express.Router();

// Home Page Route
router.get("/", (req, res) => {
  res.render("index");
});

// Handle Form Submission
router.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newUser = new User({ name, email, message });
    await newUser.save();
    res.send("✅ Data Saved to MongoDB Successfully!");
  } catch (error) {
    console.error("❌ Error Saving Data:", error);
    res.status(500).send("❌ Failed to save data.");
  }
});

module.exports = router;
