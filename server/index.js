const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RegisterModel = require("./models/Register");

const app = express();

// const corsOptions = {
//   origin: "https://forvercel-front.vercel.app/", // Allow only this origin
//   credentials: true, // Allow credentials
// };

// app.use(cors(corsOptions));

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return fn(req, res);
};

const handler = (req, res) => {
  const d = new Date();
  res.send(d.toString());
};

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
