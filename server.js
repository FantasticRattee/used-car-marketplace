const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5500;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "u6688141",
  database: "USEDCAR3"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// ✅ Serve static folders
app.use("/Homepage", express.static(path.join(__dirname, "Homepage")));
app.use("/Login", express.static(path.join(__dirname, "Login")));
app.use("/searchpage", express.static(path.join(__dirname, "searchpage")));
app.use("/searchpage-result", express.static(path.join(__dirname, "searchpage-result")));
app.use("/search-result", express.static(path.join(__dirname, "searchpage-result")));
app.use("/detail", express.static(path.join(__dirname, "detail")));
app.use("/product-add", express.static(path.join(__dirname, "product-add")));
app.use("/product-modify", express.static(path.join(__dirname, "product-modify")));
app.use("/member", express.static(path.join(__dirname, "member")));

// ✅ Static routes
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

// ✅ Get all cars
app.get("/api/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Add new car
app.post("/api/cars", (req, res) => {
  const {
    image,
    image_1,
    image_2,
    image_3,
    type,
    brand,
    name,
    model,
    mileage,
    fuelType,
    transmission,
    year,
    price,
    description,
    owner_name,
    owner_surname,
    phone_number
  } = req.body;

  console.log("📦 Incoming data:", req.body);

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
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// ✅ Update vehicle
app.put("/api/cars/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const sql = `
    UPDATE cars SET 
      image_1 = ?, image_2 = ?, image_3 = ?, 
      type = ?, brand = ?, name = ?, model = ?, mileage = ?, fuelType = ?, 
      transmission = ?, year = ?, price = ?, description = ?, 
      owner_name = ?, owner_surname = ?, phone_number = ?
    WHERE id = ?
  `;

  const values = [
    data.image_1, data.image_2, data.image_3,
    data.type, data.brand, data.name, data.model, data.mileage,
    data.fuelType, data.transmission, data.year,
    data.price, data.description,
    data.owner_name, data.owner_surname, data.phone_number,
    id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Update error:", err);
      return res.status(500).json({ error: err });
    }
    res.json({ success: true, updated: result.affectedRows });
  });
});

// ✅ Delete car
app.delete("/api/cars/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM cars WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Delete error:", err);
      return res.status(500).json({ error: err });
    }
    res.json({ success: true, deleted: result.affectedRows });
  });
});

// ✅ Get distinct models based on brand
app.get("/api/models", (req, res) => {
  const brand = req.query.brand;
  if (!brand) return res.status(400).json({ error: "Brand is required" });

  const sql = "SELECT DISTINCT model FROM cars WHERE REPLACE(name, '-', ' ') LIKE ?";
  db.query(sql, [`%${brand}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    const models = results.map(row => row.model);
    res.json(models);
  });
});

// ✅ Login
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

// ✅ Brands route
const brandRoutes = require("./routes/brand");
app.use("/api/brands", brandRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚗 Server running at http://localhost:${PORT}`);
});



// USEDCAR2