const Program = require("../models/Program");

exports.homeData = async (req, res) => {
  const programs = await Program.find();

  const features = [
    {
      "title": "Browse Dentists",
      "image": "https://cdn-icons-png.flaticon.com/512/4105/4105446.png",
      "route": "/dentists"
    },
    {
      "title": "Quick Book Appointment",
      "image": "https://cdn-icons-png.flaticon.com/512/4320/4320337.png",
      "route": "/slots"
    }
  ];

  res.json({
    features,
    programs
  });
};
