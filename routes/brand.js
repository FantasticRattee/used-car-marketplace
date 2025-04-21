const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// 🟢 Use your DB config here
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "u6688141",
  database: "USEDCAR3"
};

const brandLogos = {
  BMW: "https://cdn.builder.io/api/v1/image/assets/TEMP/e8ad0641098bbea9d3f78cc96b7f8f1359fd12ce",
  Toyota: "https://cdn.builder.io/api/v1/image/assets/TEMP/beac503c5660eb442aa656eca3405498eef6d3e4",
  Porsche: "https://cdn.builder.io/api/v1/image/assets/TEMP/7e1f9cf389e036a833487650fc3e0020fe451b96",
  Audi: "https://cdn.builder.io/api/v1/image/assets/TEMP/de855507fc4a625b8daa690e08f7aeca8bfbb03d",
  "Mercedes Benz": "https://cdn.builder.io/api/v1/image/assets/TEMP/117f27dd1639365d5b2d7b99a4309366c7b9a807",
  Honda: "https://cdn.builder.io/api/v1/image/assets/TEMP/48a02aa3fb6fced44d88452000933f29987048ec"
};

// ✅ Promise version
router.get("/", async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query("SELECT DISTINCT brand FROM cars");

    const brands = rows
    .filter(row => row.brand) // 🛡️ Skip null brands
    .map(row => ({
      name: row.brand,
      imageUrl: brandLogos[row.brand] || `https://via.placeholder.com/120x60?text=${encodeURIComponent(row.brand)}`
    }));

    res.json(brands);
    await db.end();
  } catch (err) {
    console.error("❌ Failed to fetch brands:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;