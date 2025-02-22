const express = require("express");
const router = express.Router();

// Inventory Page
router.get("/", (req, res) => {
    res.render("inventory");
});

module.exports = router;