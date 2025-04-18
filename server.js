

const express = require("express");
const path = require("path");

// SQL
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5500;

// SQL
app.use(cors());
app.use(express.json()); // for parsing JSON body


const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // your DB username
  password: "",      // your DB password
  database: "car_marketplace" // your DB name
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});







// Serve static files
app.use("/Homepage", express.static(path.join(__dirname, "Homepage")));
app.use("/Login", express.static(path.join(__dirname, "Login")));
app.use("/searchpage", express.static(path.join(__dirname, "searchpage")));
app.use("/searchpage-result", express.static(path.join(__dirname, "searchpage-result")));
app.use("/search-result", express.static(path.join(__dirname, "searchpage-result"))); // ✅ Fix
app.use("/detail", express.static(path.join(__dirname, "detail")));
app.use("/product-add", express.static(path.join(__dirname, "product-add")));

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

// detail
app.get("/detail", (req, res) => {
  res.sendFile(path.join(__dirname, "detail", "index.html"));
});

//productmanage - add
app.get("/product-add", (req, res) => {
  res.sendFile(path.join(__dirname, "product-add", "index.html"));
});

// SQL
app.get("/api/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


app.post("/api/cars", (req, res) => {
  const {
    image,
    image_1,
    image_2,
    image_3,
    type,
    name,
    model,
    mileage,
    fuelType,
    transmission,
    year,
    price,
    description
  } = req.body;

  const sql = `
    INSERT INTO cars 
    (image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ success: true, id: result.insertId });
  });
});

app.listen(PORT, () => {
  console.log(`🚗 Server running at http://localhost:${PORT}`);
});

