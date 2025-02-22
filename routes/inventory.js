const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory"); // Ensure this model exists

// ✅ GET Route - Render Inventory Page
router.get("/", async (req, res) => {
    try {
        const inventoryList = await Inventory.find(); // Fetch inventory data
        res.render("inventory", { inventoryList }); // Pass inventoryList to EJS
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).send("Error loading inventory.");
    }
});

// ✅ POST Route - Add Inventory Data to Database
router.post("/", async (req, res) => {
    try {
        const { warehouse, stockType } = req.body;
        const newInventory = new Inventory({ warehouse, stockType });
        await newInventory.save();
        res.redirect("/inventory");
    } catch (error) {
        console.error("Error saving inventory:", error);
        res.status(500).send("Failed to add inventory.");
    }
});

module.exports = router;
