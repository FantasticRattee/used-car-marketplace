const express = require("express");
const path = require("path");

const app = express();
const PORT = 5500;

// Serve static files for Homepage and Login
app.use("/Homepage", express.static(path.join(__dirname, "Homepage")));
app.use("/Login", express.static(path.join(__dirname, "Login")));

// Default route
app.get("/", (req, res) => {
  res.redirect("/Homepage");
});

// Homepage route
app.get("/homepage", (req, res) => {
  res.sendFile(path.join(__dirname, "Homepage", "index.html"));
});

// Login route
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login", "index.html")); // lowercase here
});

app.listen(PORT, () => {
  console.log(`🚗 Server running at http://localhost:${PORT}`);
});