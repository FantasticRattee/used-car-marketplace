// ✅ backend/server.js (API ONLY on port 8080)

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;

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


// ✅ WEB SERVICE 1: Authentication
// Test Login as superadmin
// method: POST
// URL: http://localhost:8080/api/login
// body: raw JSON
// { "username": "rattee", "password": "usedcar" }
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


// ✅ WEB SERVICE 2: Search and View
// Test Get All Cars
// method: GET
// URL: http://localhost:8080/api/cars
app.get("/api/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Get Models by Brand
// method: GET
// URL: http://localhost:8080/api/models?brand=BMW
app.get("/api/models", (req, res) => {
  const brand = req.query.brand;

  if (!brand) return res.status(400).json({ error: "Brand is required" });

  const sql = "SELECT DISTINCT model FROM cars WHERE brand = ?";
  db.query(sql, [brand], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results.map(row => row.model));
  });
});


// ✅ WEB SERVICE 3: Product Management


// Test Insert Car - BMW 3.0 CSL 2025
// method: POST
// URL: http://localhost:8080/api/cars
// body: raw JSON
// {
//   "brand": "BMW",
//   "image": "https://autostation.com/wp-content/uploads/2022/11/2-44.jpg",
//   "image_1": "https://autostation.com/wp-content/uploads/2022/11/2-44.jpg",
//   "image_2": "https://autostation.com/wp-content/uploads/2022/11/2-44.jpg",
//   "image_3": "https://autostation.com/wp-content/uploads/2022/11/2-44.jpg",
//   "type": "dealer",
//   "name": "BMW 3.0 CSL",
//   "model": "Limited Edition",
//   "mileage": "500 KM",
//   "fuelType": "Petrol",
//   "transmission": "6-Speed Manual",
//   "year": 2025,
//   "price": "35,000,000 THB",
//   "description": "The BMW 3.0 CSL 2025 is a tribute to the iconic coupe, delivering unmatched driving precision and exclusivity.",
//   "owner_name": "Stefan",
//   "owner_surname": "Krause",
//   "phone_number": "0823456789"
// }

// Test Insert Car - Mercedes Benz G63
// method: POST
// URL: http://localhost:8080/api/cars
// body: raw JSON
// {
//   "image": "https://autostation.com/wp-content/uploads/2023/07/mercedes-amg-g63-grand-edition.jpg",
//   "image_1": "https://autostation.com/wp-content/uploads/2023/07/mercedes-amg-g63-grand-edition.jpg",
//   "image_2": "https://autostation.com/wp-content/uploads/2023/07/mercedes-amg-g63-grand-edition.jpg",
//   "image_3": "https://autostation.com/wp-content/uploads/2023/07/mercedes-amg-g63-grand-edition.jpg",
//   "type": "dealer",
//   "brand": "Mercedes Benz",
//   "name": "Mercedes Benz G63",
//   "model": "AMG Grand Edition",
//   "mileage": "5,000 KM",
//   "fuelType": "Petrol",
//   "transmission": "9G-Tronic",
//   "year": 2025,
//   "price": "16,900,000 THB",
//   "description": "Iconic off-roader meets AMG performance in the luxurious G63 Grand Edition.",
//   "owner_name": "Patrick",
//   "owner_surname": "Weiss",
//   "phone_number": "0869998877"
// }
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


app.put("/api/cars/:id", (req, res) => {
  const carId = req.params.id;
  const updates = req.body;

  const fields = Object.keys(updates).map(field => `${field} = ?`).join(", ");
  const values = [...Object.values(updates), carId];


  //Testcase for update 
// ✅ Test Update Car ID 1
// method: PUT
// URL: http://localhost:8080/api/cars/1
// body: raw JSON
// { "price": "33,000,000 THB", "mileage": "550 KM" }

// ✅ Test Update Car ID 2
// method: PUT
// URL: http://localhost:8080/api/cars/2
// body: raw JSON
// { "model": "AMG G63 Final Edition", "owner_name": "Maximilian" }
  const sql = `UPDATE cars SET ${fields} WHERE id = ?`;
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: `Car ID ${carId} updated.` });
  });
});


// ✅ Test Delete car by ID
// Test Delete Car ID 1
// method: DELETE
// URL: http://localhost:8080/api/cars/1

// Test Delete Car ID 2
// method: DELETE
// URL: http://localhost:8080/api/cars/2
app.delete("/api/cars/:id", (req, res) => {
  const carId = req.params.id;

  const sql = `DELETE FROM cars WHERE id = ?`;
  db.query(sql, [carId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: `Car ID ${carId} deleted.` });
  });
});


// ✅ Start backend
app.listen(PORT, () => {
  console.log(`🛠️ Backend API running at http://localhost:${PORT}`);
});




