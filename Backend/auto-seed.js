const mongoose = require('mongoose');
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const Player = require('./Models/Players');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pro-talent-connect';

const seedPlayers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected for seeding");

    const count = await Player.countDocuments();

    if (count > 0) {
      console.log("Players already exist. Skipping seed.");
      return;
    }

    const samplePlayers = [
      { name: "Virat Kohli", sport: "Cricket", isDeleted: false },
      { name: "Lionel Messi", sport: "Football", isDeleted: false },
      { name: "LeBron James", sport: "Basketball", isDeleted: false }
    ];

    await Player.insertMany(samplePlayers);
    console.log("Sample players inserted");

  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  seedPlayers();
}

module.exports = seedPlayers;
