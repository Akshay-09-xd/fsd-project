require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const mongoose = require("mongoose");
const Player = require("./Models/Players");
const { calculateScoutReport } = require("./services/scoutReportCalculator");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pro-talent-connect";
const UPDATE_MODE = process.argv.includes("--update");

function calculateAge(dateOfBirth) {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age;
}

function getAgeGroup(age) {
  if (age <= 13) return "U13";
  if (age <= 15) return "U15";
  if (age <= 17) return "U17";
  if (age <= 19) return "U19";
  return "Senior";
}

function buildPlayer(player) {
  const age = calculateAge(player.dateOfBirth);
  const data = {
    ...player,
    age,
    age_group: getAgeGroup(age),
    gender: "Male",
    currentLeague: "Premier League",
    clubTier: "Tier 1",
    mobileNumber: "N/A",
    address: "",
    scouting_notes: "Seeded public profile using publicly available football data.",
    competitions: [
      {
        name: "Premier League",
        type: "Foreign Exposure",
        year: 2026,
        result: "Participant",
      },
      {
        name: `${player.nationality} senior national team`,
        type: "National Team",
        year: 2026,
        result: "Participant",
      },
    ],
    clubsPlayed: [
      {
        clubName: player.currentClub,
        duration: "Present",
      },
    ],
    media_links: [player.profileImage],
    career_history: `${player.name} is a professional footballer currently listed for ${player.currentClub}.`,
    featured: true,
    isDeleted: false,
  };

  data.scoutReport = calculateScoutReport(data);
  delete data.currentClub;

  return data;
}

const players = [
  {
    playerId: "PL-HAALAND-09",
    name: "Erling Haaland",
    dateOfBirth: "2000-07-21",
    nationality: "Norwegian",
    state: "Leeds, England",
    playingPosition: "Striker",
    alternativePosition: "Centre-forward",
    preferredFoot: "Left",
    height: 195,
    weight: 88,
    jersey_no: 9,
    size: "XL",
    email: "erling.haaland@example.protalent",
    currentClub: "Manchester City",
    profileImage: "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png",
    transferMarketLink: "https://www.transfermarkt.com/erling-haaland/profil/spieler/418560",
  },
  {
    playerId: "PL-SALAH-11",
    name: "Mohamed Salah",
    dateOfBirth: "1992-06-15",
    nationality: "Egyptian",
    state: "Nagrig, Egypt",
    playingPosition: "Right winger",
    alternativePosition: "Right midfielder",
    preferredFoot: "Left",
    height: 175,
    weight: 71,
    jersey_no: 11,
    size: "M",
    email: "mohamed.salah@example.protalent",
    currentClub: "Liverpool",
    profileImage: "https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png",
    transferMarketLink: "https://www.transfermarkt.com/mohamed-salah/profil/spieler/148455",
  },
  {
    playerId: "PL-SAKA-07",
    name: "Bukayo Saka",
    dateOfBirth: "2001-09-05",
    nationality: "English",
    state: "London, England",
    playingPosition: "Right winger",
    alternativePosition: "Left winger",
    preferredFoot: "Left",
    height: 178,
    weight: 72,
    jersey_no: 7,
    size: "M",
    email: "bukayo.saka@example.protalent",
    currentClub: "Arsenal",
    profileImage: "https://resources.premierleague.com/premierleague/photos/players/250x250/p223340.png",
    transferMarketLink: "https://www.transfermarkt.com/bukayo-saka/profil/spieler/433177",
  },
  {
    playerId: "PL-PALMER-10",
    name: "Cole Palmer",
    dateOfBirth: "2002-05-06",
    nationality: "English",
    state: "Manchester, England",
    playingPosition: "Attacking midfielder",
    alternativePosition: "Winger",
    preferredFoot: "Left",
    height: 185,
    weight: 73,
    jersey_no: 10,
    size: "M",
    email: "cole.palmer@example.protalent",
    currentClub: "Chelsea",
    profileImage: "https://resources.premierleague.com/premierleague/photos/players/250x250/p244851.png",
    transferMarketLink: "https://www.transfermarkt.com/cole-palmer/profil/spieler/568177",
  },
  {
    playerId: "PL-RICE-41",
    name: "Declan Rice",
    dateOfBirth: "1999-01-14",
    nationality: "English",
    state: "Kingston upon Thames, England",
    playingPosition: "Midfielder",
    alternativePosition: "Defensive midfielder",
    preferredFoot: "Right",
    height: 188,
    weight: 80,
    jersey_no: 41,
    size: "L",
    email: "declan.rice@example.protalent",
    currentClub: "Arsenal",
    profileImage: "https://resources.premierleague.com/premierleague/photos/players/250x250/p204480.png",
    transferMarketLink: "https://www.transfermarkt.com/declan-rice/profil/spieler/357662",
  },
  {
    playerId: "PL-VANDIJK-04",
    name: "Virgil van Dijk",
    dateOfBirth: "1991-07-08",
    nationality: "Dutch",
    state: "Breda, Netherlands",
    playingPosition: "Centre-back",
    alternativePosition: "Defender",
    preferredFoot: "Right",
    height: 195,
    weight: 92,
    jersey_no: 4,
    size: "XL",
    email: "virgil.vandijk@example.protalent",
    currentClub: "Liverpool",
    profileImage: "https://resources.premierleague.com/premierleague/photos/players/250x250/p97032.png",
    transferMarketLink: "https://www.transfermarkt.com/virgil-van-dijk/profil/spieler/139208",
  },
  {
    playerId: "PL-FERNANDES-08",
    name: "Bruno Fernandes",
    dateOfBirth: "1994-09-08",
    nationality: "Portuguese",
    state: "Maia, Portugal",
    playingPosition: "Attacking midfielder",
    alternativePosition: "Central midfielder",
    preferredFoot: "Right",
    height: 179,
    weight: 69,
    jersey_no: 8,
    size: "M",
    email: "bruno.fernandes@example.protalent",
    currentClub: "Manchester United",
    profileImage: "https://resources.premierleague.com/premierleague/photos/players/250x250/p141746.png",
    transferMarketLink: "https://www.transfermarkt.com/bruno-fernandes/profil/spieler/240306",
  },
  {
    playerId: "PL-ODEGAARD-08",
    name: "Martin Odegaard",
    dateOfBirth: "1998-12-17",
    nationality: "Norwegian",
    state: "Drammen, Norway",
    playingPosition: "Midfielder",
    alternativePosition: "Attacking midfielder",
    preferredFoot: "Left",
    height: 178,
    weight: 68,
    jersey_no: 8,
    size: "M",
    email: "martin.odegaard@example.protalent",
    currentClub: "Arsenal",
    profileImage: "https://resources.premierleague.com/premierleague/photos/players/250x250/p184029.png",
    transferMarketLink: "https://www.transfermarkt.com/martin-odegaard/profil/spieler/316264",
  },
];

async function seedRealPlayers() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const player of players.map(buildPlayer)) {
    const existing = await Player.findOne({
      $or: [{ playerId: player.playerId }, { email: player.email }],
      isDeleted: { $ne: true },
    });

    if (existing && UPDATE_MODE) {
      await Player.updateOne({ _id: existing._id }, { $set: player });
      console.log(`Updated ${player.name}`);
      updated += 1;
      continue;
    }

    if (existing) {
      console.log(`Skipped ${player.name} - already exists`);
      skipped += 1;
      continue;
    }

    await Player.create(player);
    console.log(`Inserted ${player.name}`);
    inserted += 1;
  }

  console.log(`Done. Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seedRealPlayers().catch(async (err) => {
  console.error("Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
