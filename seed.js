const mongoose = require("mongoose");
const dotenv = require("dotenv");
const HomeData = require("./models/Home"); // Home Page Data Model
const TeamMember = require("./models/TeamMember"); // Team Members Model

dotenv.config(); // Load environment variables

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Connection Error:", err));

// ✅ Seed Home Page Data
const seedHomeData = async () => {
  try {
    await HomeData.deleteMany(); // Clear existing data

    await HomeData.create({
      bannerText: "Welcome to Shipyard Management System",
      shipyardOverview: "Our shipyard spans over 500 acres, accommodating multiple vessels for repair and maintenance.",
      history: "Founded in 1980, our shipyard has been at the forefront of maritime engineering and innovation.",
      facilities: [
        { name: "Dry Dock", image: "/images/drydock.jpg", description: "Modern dry dock for ship repairs" },
        { name: "Storage Area", image: "/images/storage.jpg", description: "Secure storage area for ship parts" },
        { name: "Workshops", image: "/images/workshops.jpg", description: "High-tech workshops for ship maintenance" }
      ],
      locationMap: "https://www.google.com/maps/embed?..."
    });

    console.log("✅ Home Page Data Seeded Successfully!");
  } catch (error) {
    console.error("❌ Home Page Seeding Error:", error);
  }
};

// ✅ Seed Team Members Data
const teamData = [
    { category: "President", name: "John Doe", role: "President", bio: "Oversees the entire shipyard operations.", image: "/images/president.jpg" },
    
    { category: "Head Officers", name: "Sarah Smith", role: "Head Officer", bio: "Leads major shipbuilding projects.", image: "/images/head1.jpg" },
    { category: "Head Officers", name: "David Johnson", role: "Head Officer", bio: "Manages ship repair initiatives.", image: "/images/head2.jpg" },
    { category: "Head Officers", name: "Emily Brown", role: "Head Officer", bio: "Handles logistics and operations.", image: "/images/head3.jpg" },

    { category: "Managers", name: "Michael Wilson", role: "Operations Manager", bio: "Coordinates daily shipyard activities.", image: "/images/manager1.jpg" },
    { category: "Managers", name: "James Anderson", role: "Finance Manager", bio: "Oversees financial planning.", image: "/images/manager3.jpg" },

    { category: "Supervisors", name: "William Taylor", role: "Supervisor", bio: "Ensures shipyard safety.", image: "/images/supervisor1.jpg" },
    { category: "Supervisors", name: "Daniel Martinez", role: "Supervisor", bio: "Supervises ship construction.", image: "/images/supervisor2.jpg" },
    { category: "Supervisors", name: "Sophia White", role: "Supervisor", bio: "Monitors project timelines.", image: "/images/supervisor3.jpg" },
    { category: "Supervisors", name: "Benjamin Clark", role: "Supervisor", bio: "Ensures compliance with safety regulations.", image: "/images/supervisor4.jpg" },
    { category: "Supervisors", name: "Mia Roberts", role: "Supervisor", bio: "Manages workforce efficiency.", image: "/images/supervisor5.jpg" },
    { category: "Supervisors", name: "Ethan Lewis", role: "Supervisor", bio: "Handles logistics for materials.", image: "/images/supervisor6.jpg" },
    { category: "Supervisors", name: "Amelia Scott", role: "Supervisor", bio: "Supervises dock maintenance.", image: "/images/supervisor7.jpg" },
    { category: "Supervisors", name: "Noah Hall", role: "Supervisor", bio: "Ensures smooth operations.", image: "/images/supervisor8.jpg" },

    { category: "Lead Engineers", name: "Oliver Martin", role: "Lead Engineer", bio: "Designs ship structures.", image: "/images/engineer1.jpg" },
    { category: "Lead Engineers", name: "Emma Lopez", role: "Lead Engineer", bio: "Expert in ship propulsion systems.", image: "/images/engineer2.jpg" },
    { category: "Lead Engineers", name: "Liam Carter", role: "Lead Engineer", bio: "Handles ship electrical systems.", image: "/images/engineer3.jpg" },
    { category: "Lead Engineers", name: "Ava Mitchell", role: "Lead Engineer", bio: "Supervises mechanical repairs.", image: "/images/engineer4.jpg" },
    { category: "Lead Engineers", name: "Lucas Wright", role: "Lead Engineer", bio: "Develops structural components.", image: "/images/engineer5.jpg" },
    { category: "Lead Engineers", name: "Harper Adams", role: "Lead Engineer", bio: "Specialist in ship materials.", image: "/images/engineer6.jpg" },
    { category: "Lead Engineers", name: "Ethan Moore", role: "Lead Engineer", bio: "Works on automation and control.", image: "/images/engineer7.jpg" },
    { category: "Lead Engineers", name: "Olivia King", role: "Lead Engineer", bio: "Responsible for fuel efficiency.", image: "/images/engineer8.jpg" }
];

const seedTeamData = async () => {
  try {
    await TeamMember.deleteMany(); // Clear existing data
    await TeamMember.insertMany(teamData);
    console.log("✅ Team Members Seeded Successfully!");
  } catch (error) {
    console.error("❌ Team Seeding Error:", error);
  }
};

// ✅ Run both seeding functions
const seedAllData = async () => {
  await seedHomeData();
  await seedTeamData();
  mongoose.connection.close(); // Close DB connection after inserting data
  console.log("✅ Database Seeding Completed!");
};

seedAllData();
