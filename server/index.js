const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RegisterModel = require("./models/Register");

const app = express();
const corsOptions = {
  origin: "https://forvercel-front.vercel.app", // Allow only this origin
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(
  "mongodb+srv://sureshkumaroneteam:7eMboiXaP6KhV6iE@cluster0.qstot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

app.get("/", (req, res) => {
  res.json("Hello");
});
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  RegisterModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.json("Already have an account");
      } else {
        RegisterModel.create({ name: name, email: email, password: password })
          .then((result) => res.json(result))
          .catch((err) => res.json(err));
      }
    })
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log("Server is Running on port 3001");
});
