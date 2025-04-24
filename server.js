// ✅ backend/server.js (API ONLY on port 8080)
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// ✅ Web service endpoints
app.get("/api/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/cars", (req, res) => {
  const {
    image, image_1, image_2, image_3, type, brand,
    name, model, mileage, fuelType, transmission,
    year, price, description, owner_name, owner_surname, phone_number
  } = req.body;

  const sql = `
    INSERT INTO cars 
    (image, image_1, image_2, image_3, type, brand, name, model, mileage, fuelType, transmission, year, price, description, owner_name, owner_surname, phone_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    image, image_1, image_2, image_3,
    type, brand, name, model, mileage, fuelType,
    transmission, year, price, description,
    owner_name, owner_surname, phone_number
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// other endpoints (PUT, DELETE, etc) follow the same pattern...

app.listen(PORT, () => {
  console.log(`🛠️ Backend API running at http://localhost:${PORT}`);
});


// ✅ Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admin_logins WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    
    if (results.length === 1) {
      res.json({ success: true, role: results[0].role });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

// ✅ Get models by brand
app.get("/api/models", (req, res) => {
  const brand = req.query.brand;

  if (!brand) {
    return res.status(400).json({ error: "Brand is required" });
  }

  const sql = "SELECT DISTINCT model FROM cars WHERE brand = ?";
  db.query(sql, [brand], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results.map(row => row.model));
  });
});