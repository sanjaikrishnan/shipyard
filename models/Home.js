const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  bannerText: String,
  shipyardOverview: String,
  history: String,
  facilities: [
    {
      name: String,
      image: String, // Store image URLs
      description: String
    }
  ],
  locationMap: String // Embed Google Maps URL
});

const HomeData = mongoose.model("HomeData", homeSchema);
module.exports = HomeData;
