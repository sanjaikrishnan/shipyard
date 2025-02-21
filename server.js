const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Ensure JSON parsing
app.use(express.static("public"));
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Import User Model
const Contact = require("./models/Contact");

// Route to render the Home Page
app.get("/", (req, res) => {
    res.render("index");
});

// Route to handle form submission
app.post("/submit", async (req, res) => {
    console.log("Received Data:", req.body); // Log incoming data

    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).send("❌ Missing Required Fields");
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log("✅ Data Saved:", newContact);
        res.send("✅ Data Saved Successfully!");
    } catch (error) {
        console.error("❌ Error Saving Data:", error);
        res.status(500).send("❌ Failed to save data.");
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
