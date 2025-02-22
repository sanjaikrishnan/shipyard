const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    warehouse: String,
    stockType: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inventory", inventorySchema);
