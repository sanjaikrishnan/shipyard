const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Pending" }, // Status: Pending / Resolved
    response: { type: String, default: "" }, // Admin response
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Support", supportSchema);