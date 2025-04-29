const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Company Schema
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
});

const Company = mongoose.model("Company", companySchema);

// Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
});
const Job = mongoose.model("Job", jobSchema);

// POST /companies - Register a new company
app.post("/companies", async (req, res) => {
  try {
    const { name, industry } = req.body;
    const company = new Company({ name, industry });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /jobs - Post a new job for a company
app.post("/jobs", async (req, res) => {
  try {
    const { title, description, location, companyId } = req.body;
    const job = new Job({ title, description, location, companyId });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Job Posting API");
})

// Server start
const PORT = 6788;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
