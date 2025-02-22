const express = require("express");
const router = express.Router();
const TeamMember = require("../models/TeamMember"); // Adjust path based on your structure

// ✅ GET /about - Render About Us Page
router.get("/", async (req, res) => {
    try {
        // Fetch leadership team members from the database
        const leadershipTeam = await TeamMember.find({ category: "Leadership" });

        // Render about.ejs and pass the team members data
        res.render("about", { leadershipTeam });
    } catch (error) {
        console.error("❌ Error fetching leadership team:", error);
        res.status(500).send("❌ Failed to load About page.");
    }
});

module.exports = router;
