"use strict";

// Creates (or updates) the ONE2CAR database in place:
//   1. CREATE DATABASE IF NOT EXISTS <DB_NAME>   (never drops anything)
//   2. db/schema.sql                              (CREATE TABLE IF NOT EXISTS ...)
//   3. db/seed-cars.sql                           (only when the cars table is empty)
//   4. admin user from ADMIN_USERNAME / ADMIN_PASSWORD, stored as a scrypt hash
//
// Usage: npm run seed   (reads Backend/.env)

require("dotenv").config();
const fs = require("node:fs/promises");
const path = require("node:path");
const mysql = require("mysql2/promise");

const { dbConfigFromEnv, assertSafeDatabaseName, describeDbError } = require("./lib/db");
const { hashPassword } = require("./lib/auth");

function readAdminCredentials() {
  const username = (process.env.ADMIN_USERNAME || "").trim();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!/^[A-Za-z0-9_.-]{3,50}$/.test(username)) {
    throw new Error("Set ADMIN_USERNAME in Backend/.env (3-50 letters, digits, dot, dash or underscore).");
  }
  if (password.length < 10 || /change-?me/i.test(password)) {
    throw new Error("Set ADMIN_PASSWORD in Backend/.env to your own password of at least 10 characters.");
  }
  return { username, password };
}

async function main() {
  const config = dbConfigFromEnv();
  assertSafeDatabaseName(config.database);
  const admin = readAdminCredentials();

  const { database, ...serverConfig } = config;
  let connection;
  try {
    connection = await mysql.createConnection({ ...serverConfig, multipleStatements: true, charset: "utf8mb4" });
  } catch (err) {
    throw new Error(describeDbError(err, config));
  }

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.query(`USE \`${database}\``);
    await connection.query("SET time_zone = '+00:00'");
    console.log(`Database "${database}" is ready.`);

    const schema = await fs.readFile(path.join(__dirname, "db", "schema.sql"), "utf8");
    await connection.query(schema);
    console.log("Tables admin_users, sessions and cars are ready.");

    const [[{ total }]] = await connection.query("SELECT COUNT(*) AS total FROM cars");
    if (Number(total) === 0) {
      const seedCars = await fs.readFile(path.join(__dirname, "db", "seed-cars.sql"), "utf8");
      await connection.query(seedCars);
      const [[{ added }]] = await connection.query("SELECT COUNT(*) AS added FROM cars");
      console.log(`Added ${added} demo listings.`);
    } else {
      console.log(`The cars table already has ${total} listings, so the demo listings were not added again.`);
    }

    const passwordHash = await hashPassword(admin.password);
    const [existing] = await connection.execute("SELECT id FROM admin_users WHERE username = ?", [admin.username]);
    if (existing.length) {
      await connection.execute("UPDATE admin_users SET password_hash = ?, role = 'admin' WHERE id = ?", [
        passwordHash,
        existing[0].id,
      ]);
      // A new password should end any sessions created with the old one.
      await connection.execute("DELETE FROM sessions WHERE user_id = ?", [existing[0].id]);
      console.log(`Admin "${admin.username}" already existed: password updated and old sessions ended.`);
    } else {
      await connection.execute("INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, 'admin')", [
        admin.username,
        passwordHash,
      ]);
      console.log(`Admin "${admin.username}" created.`);
    }
  } catch (err) {
    if (err && err.code) throw new Error(describeDbError(err, config));
    throw err;
  } finally {
    await connection.end();
  }

  console.log("Seed finished. Start the API with: npm start");
}

main().catch((err) => {
  console.error(`\nSeed failed: ${err.message}\n`);
  process.exit(1);
});
