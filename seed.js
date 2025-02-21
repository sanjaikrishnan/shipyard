const mongoose = require("mongoose");
const dotenv = require("dotenv");
const HomeData = require("./models/Home");

dotenv.config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Connection Error:", err));

const seedData = async () => {
  try {
    await HomeData.deleteMany({}); // Clear existing data

    await HomeData.create({
      bannerText: "Welcome to Shipyard Management System",
      shipyardOverview: "Our shipyard spans over 500 acres, accommodating multiple vessels for repair and maintenance.",
      history: "Founded in 1980, our shipyard has been at the forefront of maritime engineering and innovation.",
      facilities: [
        { name: "Dry Dock", image: "images/drydock.jpg", description: "Modern dry dock for ship repairs" },
        { name: "Storage Area", image: "images/storage.jpg", description: "Secure storage area for ship parts" },
        { name: "Workshops", image: "images/workshops.jpg", description: "High-tech workshops for ship maintenance" }
      ],
      locationMap: "https://www.google.com/maps/embed?..."
    });

    console.log("✅ Home Page Data Seeded Successfully!");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  } finally {
    mongoose.connection.close(); // Close DB connection after inserting data
  }
};

seedData();
