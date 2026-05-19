const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tech: [String],
    link: String,
    github: String
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
const Contact = mongoose.model("Contact", contactSchema);

const sampleProjects = [
  {
    title: "Personal Portfolio Website",
    description: "A responsive portfolio website with backend API and MongoDB integration.",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "MongoDB"],
    link: "#",
    github: "#"
  },
  {
    title: "Task Management Application",
    description: "A task app for creating, updating, deleting, and tracking tasks.",
    tech: ["JavaScript", "Node.js", "Express", "MongoDB"],
    link: "#",
    github: "#"
  },
  {
    title: "E-Commerce Web Application",
    description: "An online store concept with product catalog, cart, and order features.",
    tech: ["React", "Express", "MongoDB"],
    link: "#",
    github: "#"
  }
];

app.get("/api/profile", (req, res) => {
  res.json({
    name: "Your Name",
    role: "Full-Stack Developer",
    location: "India",
    summary:
      "I build responsive web applications with clean interfaces, reliable APIs, and practical database design.",
    email: "your.email@example.com",
    phone: "+91 98765 43210",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST APIs",
      "Responsive Design"
    ]
  });
});

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  await Contact.create({ name, email, message });
  res.status(201).json({ message: "Thank you. Your message has been received." });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(sampleProjects);
      console.log("Sample projects added");
    }

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

startServer();