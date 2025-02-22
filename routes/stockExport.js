const express = require("express");
const router = express.Router();
const multer = require("multer");

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Stock Export Page
router.get("/", (req, res) => {
    res.render("stockExport");
});

// Handle Form Submission
router.post("/", upload.array("stockImages", 5), (req, res) => {
    console.log(req.body);
    res.send("Stock Export Request Submitted Successfully!");
});

module.exports = router;