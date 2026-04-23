const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  const token = jwt.sign({ user: req.body.username }, "SECRET_KEY", { expiresIn: "1h" });
  res.json({ token });
});

app.get("/api/guidelines", (req, res) => {
  res.json({
    version: "2026.1",
    thresholds: { stage1: 130, stage2: 140, crisis: 180 }
  });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
