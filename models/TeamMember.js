const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    category: String, // Example: President, Head Officers, Managers
    name: String,
    role: String,
    bio: String,
    image: String // Store image path
});

const TeamMember = mongoose.model("TeamMember", teamSchema);
module.exports = TeamMember;
