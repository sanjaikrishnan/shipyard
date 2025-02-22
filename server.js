require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const multer = require("multer");

const app = express();

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve CSS, JS, Images
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Express Session Setup
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// ✅ Connect to MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

// ✅ Tender Schema
const tenderSchema = new mongoose.Schema({
    name: String,
    description: String,
    deadline: String,
    bidAmountRange: String,
    document: String
});
const Tender = mongoose.model("Tender", tenderSchema);

// ✅ Vigilance Schema
const vigilanceSchema = new mongoose.Schema({
    name: String,
    contactDetails: String,
    complaintType: String,
    description: String,
    evidence: String
});
const Vigilance = mongoose.model("Vigilance", vigilanceSchema);

// ✅ Team Member Schema
const teamSchema = new mongoose.Schema({
    category: String,
    name: String,
    role: String,
    bio: String,
    image: String
});
const TeamMember = mongoose.model("TeamMember", teamSchema);

const serviceSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String
});
const Service = mongoose.model("Service", serviceSchema);

// ✅ Financial Report Schema
const financialSchema = new mongoose.Schema({
    year: Number,
    revenue: Number,
    expenses: Number
});
const Financial = mongoose.model("Financial", financialSchema);

// ✅ Multer Setup (For File Uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ✅ Home Page Route
app.get("/", (req, res) => {
    res.render("index", { user: req.session.user });
});

// ✅ Register Page Route
app.get("/register", (req, res) => {
    res.render("register");
});

// ✅ Register (Sign Up) Logic
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send(`<script>alert("❌ Email already registered! Please Sign In."); window.location.href='/signin';</script>`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return res.send(`<script>alert("✅ Registration successful! Please Sign In."); window.location.href='/signin';</script>`);
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).send(`<script>alert("❌ Registration failed. Please try again."); window.location.href='/register';</script>`);
    }
});

// ✅ Sign-In Page Route
app.get("/signin", (req, res) => {
    res.render("signin");
});

// ✅ Sign-In (Login) Logic
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // If user does not exist, create a new one
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();
            req.session.user = newUser;
            return res.send(`<script>alert("New account created successfully!"); window.location.href='/';</script>`);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send(`<script>alert("Invalid email or password. Please try again."); window.location.href='/signin';</script>`);
        }

        req.session.user = user;
        return res.send(`<script>alert("Login successful! Redirecting to home page."); window.location.href='/';</script>`);
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).send(`<script>alert("❌ Login failed. Please try again later."); window.location.href='/signin';</script>`);
    }
});


// ✅ Dashboard Route (Requires Login)
app.get("/dashboard", (req, res) => {
    if (!req.session.user) return res.redirect("/signin");
    res.render("dashboard", { user: req.session.user });
});

// ✅ Logout Route
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/signin");
    });
});

// ✅ Render Tenders Page
app.get("/tenders", async (req, res) => {
    try {
        const tenders = await Tender.find();
        res.render("tender", { tenders });
    } catch (error) {
        console.error("❌ Error fetching tenders:", error);
        res.status(500).send("❌ Failed to load tenders.");
    }
});

// ✅ Apply for a Tender
app.post("/tenders/apply", upload.single("document"), async (req, res) => {
    try {
        const { companyName, contactDetails, bidAmount } = req.body;
        const documentPath = req.file ? "/uploads/" + req.file.filename : "";

        const newTender = new Tender({
            name: companyName,
            description: contactDetails,
            deadline: new Date().toISOString().split("T")[0],
            bidAmountRange: bidAmount,
            document: documentPath
        });

        await newTender.save();
        res.redirect("/tenders");
    } catch (error) {
        console.error("❌ Tender Submission Error:", error);
        res.status(500).send("❌ Tender submission failed.");
    }
});

// ✅ Render Vigilance Page
app.get("/vigilance", (req, res) => {
    res.render("vigilance");
});

// ✅ Submit a Vigilance Report
app.post("/vigilance/report", upload.single("evidence"), async (req, res) => {
    try {
        const { name, contactDetails, complaintType, description } = req.body;
        const evidencePath = req.file ? "/uploads/" + req.file.filename : "";

        const newVigilanceReport = new Vigilance({
            name,
            contactDetails,
            complaintType,
            description,
            evidence: evidencePath
        });

        await newVigilanceReport.save();
        res.redirect("/vigilance");
    } catch (error) {
        console.error("❌ Vigilance Report Submission Error:", error);
        res.status(500).send("❌ Vigilance report submission failed.");
    }
});
app.get("/teams", async (req, res) => {
    try {
        const teamMembers = await TeamMember.find();
        const groupedTeam = teamMembers.reduce((acc, member) => {
            if (!acc[member.category]) acc[member.category] = [];
            acc[member.category].push(member);
            return acc;
        }, {});
        res.render("team", { team: groupedTeam });
    } catch (error) {
        console.error("❌ Error fetching team members:", error);
        res.status(500).send("❌ Failed to load team members.");
    }
});
// ✅ Services Page Route
app.get("/services", async (req, res) => {
    try {
        const services = await Service.find();
        res.render("services", { services });
    } catch (error) {
        console.error("❌ Error fetching services:", error);
        res.status(500).send("❌ Failed to load services.");
    }
});

// ✅ Fetch Financial Data API (For Chart.js)
app.get("/api/financials", async (req, res) => {
    try {
        const financialData = await Financial.find();
        res.json(financialData);
    } catch (error) {
        console.error("❌ Error fetching financial data:", error);
        res.status(500).send("❌ Failed to fetch financial data.");
    }
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
