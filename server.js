// frontend/server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 5500;

// ✅ Serve static folders
app.use("/Homepage", express.static(path.join(__dirname, "Homepage")));
app.use("/Login", express.static(path.join(__dirname, "Login")));
app.use("/searchpage", express.static(path.join(__dirname, "searchpage")));
app.use("/searchpage-result", express.static(path.join(__dirname, "searchpage-result")));
app.use("/detail", express.static(path.join(__dirname, "detail")));
app.use("/product-add", express.static(path.join(__dirname, "product-add")));
app.use("/product-modify", express.static(path.join(__dirname, "product-modify")));
app.use("/member", express.static(path.join(__dirname, "member")));

// ✅ Routes
app.get("/", (req, res) => res.redirect("/Homepage"));
app.get("/homepage", (req, res) => res.sendFile(path.join(__dirname, "Homepage", "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "Login", "index.html")));
app.get("/search", (req, res) => res.sendFile(path.join(__dirname, "searchpage", "index.html")));
app.get("/search-result", (req, res) => res.sendFile(path.join(__dirname, "searchpage-result", "index.html")));
app.get("/detail", (req, res) => res.sendFile(path.join(__dirname, "detail", "index.html")));
app.get("/product-add", (req, res) => res.sendFile(path.join(__dirname, "product-add", "index.html")));
app.get("/product-modify", (req, res) => res.sendFile(path.join(__dirname, "product-modify", "index.html")));
app.get("/member", (req, res) => res.sendFile(path.join(__dirname, "member", "index.html")));
app.get("/Logout", (req, res) => res.redirect("/homepage"));


  

// ✅ Start frontend server
app.listen(PORT, () => {
  console.log(`🌐 Frontend running at http://localhost:${PORT}`);
});