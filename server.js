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
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

startServer();