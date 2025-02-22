require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const multer = require("multer");

const stockExportRoutes = require("./routes/stockExport");
const inventoryRoutes = require("./routes/inventory");
const supportRoutes = require("./routes/support");

const app = express();
app.use("/inventory", inventoryRoutes);


// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
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

// ✅ MongoDB Connection (Local & Atlas)
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shipyardDB";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
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
app.get("/teams", async (req, res) => {
    try {
        const teamMembers = await TeamMember.find(); // Fetch team members from DB

        // Grouping team members by category (President, Head Officers, Managers, etc.)
        const groupedTeam = teamMembers.reduce((acc, member) => {
            if (!acc[member.category]) acc[member.category] = [];
            acc[member.category].push(member);
            return acc;
        }, {});

        res.render("teams", { team: groupedTeam }); // Render teams.ejs
    } catch (error) {
        console.error("❌ Error fetching team members:", error);
        res.status(500).send("❌ Failed to load team members.");
    }
});


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

// ✅ Routes Setup
app.use("/export", stockExportRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/support", supportRoutes);

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


// ✅ Stock Export Schema
const stockExportSchema = new mongoose.Schema({
    fullName: String,
    companyName: String,
    stockName: String,
    stockCategory: String,
    stockImages: [String],
    createdAt: { type: Date, default: Date.now }
});
const StockExport = mongoose.models.StockExport || mongoose.model("StockExport", stockExportSchema);

// Support Request Schema
const supportSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    status: { type: String, default: "Pending" },
    response: { type: String, default: "" }
});
const SupportRequest = mongoose.models.SupportRequest || mongoose.model("SupportRequest", supportSchema);

// Routes
app.use("/export", stockExportRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/support", supportRoutes);



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
app.get("/tender", async (req, res) => {
    try {
        const tenders = await Tender.find();
        res.render("tenders", { tenders });
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
        res.redirect("/tender");
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

// ✅ GET Route - Display Inventory Page
app.get("/inventory", async (req, res) => {
    try {
        const inventoryList = await Inventory.find();
        res.render("inventory", { inventoryList });
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).send("Error loading inventory.");
    }
});

// ✅ POST Route - Add Inventory Data to Database
app.post("/inventory", async (req, res) => {
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
app.get("/admin/support", async (req, res) => {
    try {
        const requests = await Support.find();
        res.render("admin_support", { requests });
    } catch (error) {
        console.error("Error fetching support requests:", error);
        res.status(500).send("Error loading support requests.");
    }
});

// Respond to Support Requests
app.post("/support/respond/:id", async (req, res) => {
    try {
        const { response } = req.body;
        await Support.findByIdAndUpdate(req.params.id, { response, status: "Resolved" });
        res.redirect("/admin/support");
    } catch (error) {
        console.error("Error updating support request:", error);
        res.status(500).send("Failed to update support request.");
    }
});
// ✅ GET Route - Render Stock Export Form
app.get("/export", (req, res) => {
    res.render("export");
});

// ✅ POST Route - Handle Stock Export Submission
app.post("/export", upload.array("stockImages"), async (req, res) => {
    try {
        const { fullName, companyName, stockName, stockCategory } = req.body;
        const stockImages = req.files.map(file => "/uploads/" + file.filename);

        const newExportRequest = new StockExport({
            fullName, companyName, stockName, stockCategory, stockImages
        });
        await newExportRequest.save();

        res.send(`<script>alert("✅ Stock export request submitted successfully!"); window.location.href='/export';</script>`);
    } catch (error) {
        console.error("❌ Stock Export Submission Error:", error);
        res.status(500).send("❌ Failed to submit stock export request.");
    }
});

// ✅ GET Route - Render Support Page
app.get("/support", async (req, res) => {
    try {
        const requests = await SupportRequest.find();
        res.render("support", { requests });
    } catch (error) {
        console.error("❌ Error fetching support requests:", error);
        res.status(500).send("❌ Failed to load support requests.");
    }
});

// ✅ POST Route - Handle New Support Request
app.post("/support", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newRequest = new SupportRequest({ name, email, message });
        await newRequest.save();
        res.redirect("/support");
    } catch (error) {
        console.error("❌ Support Request Submission Error:", error);
        res.status(500).send("❌ Failed to submit support request.");
    }
});

// ✅ POST Route - Respond to Support Request
app.post("/support/respond/:id", async (req, res) => {
    try {
        const { response } = req.body;
        await SupportRequest.findByIdAndUpdate(req.params.id, { response, status: "Resolved" });
        res.redirect("/support");
    } catch (error) {
        console.error("❌ Support Response Error:", error);
        res.status(500).send("❌ Failed to respond to support request.");
    }
});
// ✅ Start the Server
// Removed duplicate PORT declaration


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
