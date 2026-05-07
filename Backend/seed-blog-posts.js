require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const mongoose = require("mongoose");
const Admin = require("./Models/Admin");
const Blog = require("./Models/Blog");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pro-talent-connect";
const UPDATE_MODE = process.argv.includes("--update");

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getSeedAuthor() {
  const existingAdmin = await Admin.findOne({ is_active: true }).sort({ role: -1, createdAt: 1 });

  if (existingAdmin) {
    return existingAdmin;
  }

  return Admin.create({
    name: "Pro Talent Editorial",
    email: "editorial@protalent.local",
    password: "Editorial@123",
    role: "Super Admin",
    is_active: true,
  });
}

const posts = [
  {
    title: "What Scouts Notice First in a Modern Forward",
    category: "General",
    readTime: 4,
    tags: ["Scouting", "Forwards", "Player Development"],
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1400&auto=format&fit=crop",
    excerpt:
      "A forward is judged by more than goals. Movement, pressing triggers, first touch, and repeat sprint quality often decide whether a profile feels ready for a higher level.",
    content:
      "A modern forward is evaluated long before the shot arrives. Scouts watch how early the player scans, whether the first movement creates separation, and how quickly the body shape opens after receiving the ball.\n\nGoals still matter, but they are only one signal. A striker who presses intelligently, pins centre-backs, attacks the near post, and makes repeat runs can change a match even without scoring. Coaches also value forwards who understand when to drop between the lines and when to stretch the back line.\n\nFor young players, the biggest takeaway is simple: build habits that are visible without the ball. Time your runs, react after losing possession, and make every touch purposeful. The best forwards make defenders solve problems every few seconds.",
  },
  {
    title: "Why Match Video Matters More Than Highlight Reels",
    category: "News",
    readTime: 3,
    tags: ["Recruitment", "Video Analysis", "Trials"],
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1400&auto=format&fit=crop",
    excerpt:
      "Highlights can open the door, but full match clips show decision-making, recovery runs, positioning, and consistency under pressure.",
    content:
      "A highlight reel is useful, but it is only the first handshake. Recruiters usually learn more from complete match video because it shows the ordinary moments between the spectacular ones.\n\nFull footage reveals how a player reacts after mistakes, whether their positioning holds when the team is under pressure, and how often they choose the correct option quickly. It also helps compare physical intensity across different phases of the game.\n\nA strong player profile should include both. Use a short highlight reel to capture attention, then support it with match footage, timestamps, and basic context: opponent, competition, position played, and final score.",
  },
  {
    title: "Building a Better Player Profile for Trials",
    category: "Announcements",
    readTime: 5,
    tags: ["Trials", "Profiles", "Careers"],
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=1400&auto=format&fit=crop",
    excerpt:
      "A strong profile should make a scout's job easier: clear bio, position, measurements, competition history, video links, and contact path.",
    content:
      "A player profile is not just a form. It is a first impression, and the best ones are easy to verify.\n\nStart with the basics: full name, date of birth, nationality, primary position, preferred foot, height, weight, current club, and recent competitions. Add a short playing summary that describes strengths without exaggeration. Specifics are better than vague claims.\n\nThe most useful profiles include match video, tournament history, coach references, and updated contact details. Keep the profile current. A clean, accurate profile tells clubs and academies that the player is serious about the next step.",
  },
  {
    title: "Premier League Lessons for Indian Youth Football",
    category: "General",
    readTime: 4,
    tags: ["Premier League", "Youth Football", "Development"],
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1400&auto=format&fit=crop",
    excerpt:
      "Elite football environments show the value of tempo, repeatable technique, physical preparation, and clear positional education.",
    content:
      "The Premier League is not only a showcase of star players. It is also a reminder of how much detail sits behind elite performance.\n\nYoung Indian footballers can learn from the speed of decision-making, the intensity of transitions, and the discipline players show in their roles. The technical level matters, but so does the ability to repeat actions at match speed.\n\nFor academies, the lesson is to create training that looks and feels closer to the game. Small-sided pressure, positional constraints, video review, and physical development all help players adapt when the level rises.",
  },
  {
    title: "How Midfielders Can Stand Out in Scouting Reports",
    category: "Achievements",
    readTime: 4,
    tags: ["Midfielders", "Scouting", "Analytics"],
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1400&auto=format&fit=crop",
    excerpt:
      "Midfielders stand out through scanning, receiving angles, pressure resistance, passing range, and defensive awareness.",
    content:
      "Midfield is often judged through details that casual viewers miss. Scouts look for players who scan before receiving, offer useful passing angles, and play forward when the moment is right.\n\nA midfielder does not need to force spectacular passes to stand out. Secure first touch, awareness under pressure, and good defensive positioning can be just as valuable. The best midfielders help the team breathe when the game becomes chaotic.\n\nPlayers should review their own match clips with three questions: did I check my shoulder before receiving, did I support the ball after passing, and did I react quickly when possession changed?",
  },
  {
    title: "The Rise of Data in Football Recruitment",
    category: "News",
    readTime: 5,
    tags: ["Analytics", "Recruitment", "Scouting"],
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1400&auto=format&fit=crop",
    excerpt:
      "Data does not replace scouts, but it helps them ask better questions and find players who may otherwise be missed.",
    content:
      "Football recruitment is becoming more evidence-led. Clubs still trust human scouting, but data now helps narrow the search, compare players, and identify patterns across competitions.\n\nUseful data can be simple: minutes played, position, goals, assists, clean sheets, injury history, competition level, and video availability. More advanced environments add pressing actions, progressive passes, duel success, and expected goals.\n\nFor developing players, this means consistency matters. A single good match can help, but a reliable record across several games makes a profile easier to trust.",
  },
];

async function seedBlogPosts() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const author = await getSeedAuthor();
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    const slug = slugify(post.title);
    const publishedAt = new Date();
    const blogData = {
      ...post,
      slug,
      author: author.name,
      author_id: author._id,
      cover_image: post.image,
      status: "PUBLISHED",
      published_at: publishedAt,
      isDeleted: false,
    };

    const existing = await Blog.findOne({ slug });

    if (existing && UPDATE_MODE) {
      await Blog.updateOne({ _id: existing._id }, { $set: blogData });
      console.log(`Updated ${post.title}`);
      updated += 1;
      continue;
    }

    if (existing) {
      console.log(`Skipped ${post.title} - already exists`);
      skipped += 1;
      continue;
    }

    await Blog.create(blogData);
    console.log(`Inserted ${post.title}`);
    inserted += 1;
  }

  console.log(`Done. Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seedBlogPosts().catch(async (err) => {
  console.error("Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
