const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const RegisterModel = require("./models/Register");

const app = express();

app.use(express.json());
app.use(
  cors({ origin: "https://forvercel-front.vercel.app", credentials: true })
);

mongoose.connect(
  "mongodb+srv://sureshkumaroneteam:7eMboiXaP6KhV6iE@cluster0.qstot.mongodb.net/yourDatabaseName?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.get("/", (req, res) => {
  res.json("Hello from Vercel backend!");
});

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

// Export the Express app as a Vercel serverless function
module.exports = app;
