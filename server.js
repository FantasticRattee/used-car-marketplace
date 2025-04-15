


const express = require("express");
const path = require("path");

const app = express();
const PORT = 5500;

// Serve static files
app.use("/Homepage", express.static(path.join(__dirname, "Homepage")));
app.use("/Login", express.static(path.join(__dirname, "Login")));
app.use("/searchpage", express.static(path.join(__dirname, "searchpage")));
app.use("/searchpage-result", express.static(path.join(__dirname, "searchpage-result")));
app.use("/search-result", express.static(path.join(__dirname, "searchpage-result"))); // ✅ Fix

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
  res.sendFile(path.join(__dirname, "Login", "index.html"));
});

// Search page route
app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "searchpage", "index.html"));
});

// ✅ Fixed: Search result route (must match form action)
app.get("/search-result", (req, res) => {
  res.sendFile(path.join(__dirname, "searchpage-result", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚗 Server running at http://localhost:${PORT}`);
});

