const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const RegisterModel = require("./models/Register");

const app = express();

// ✅ Allow only your frontend domain
const corsOptions = {
  origin: "https://forvercel-front.vercel.app",
  credentials: true, // Allow cookies & headers
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use CORS middleware

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.json("Hello from Vercel backend!");
});

app.get("/hello", handler);

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle CORS preflight request
  }

  res.status(200).json({ message: "Hello from Vercel!" });
}
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await RegisterModel.findOne({ email });
    if (user) return res.json("Already have an account");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await RegisterModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export app for Vercel
module.exports = app;
