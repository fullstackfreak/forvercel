const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const RegisterModel = require("./models/Register");

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/gg", (req, res) => {
  res.json("Hello from Vercel backend!");
});

app.get("/", handler);

function handler(req, res) {
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
