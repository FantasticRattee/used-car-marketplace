"use strict";

// ONE2CAR REST API (Express + MySQL). Run `npm run seed` once before starting.

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { dbConfigFromEnv, createPool, describeDbError } = require("./lib/db");
const {
  verifyPassword,
  dummyHash,
  newSessionToken,
  hashToken,
  readBearerToken,
  createLoginLimiter,
} = require("./lib/auth");
const { SELECT_COLUMNS, validateCar, toApiCar, buildCarQuery } = require("./lib/cars");

const PORT = Number(process.env.BACKEND_PORT || process.env.PORT) || 8080;
const SESSION_TTL_MINUTES = Math.max(1, Number(process.env.SESSION_TTL_MINUTES) || 30);
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGIN || "http://localhost:5500,http://127.0.0.1:5500")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const dbConfig = dbConfigFromEnv();
const pool = createPool(dbConfig);
const loginLimiter = createLoginLimiter();

const GENERIC_ERROR = "Something went wrong on the server. Please try again.";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", false);

app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Cache-Control", "no-store");
  next();
});

// Only the configured front-end origin(s) may call the API from a browser.
app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || ALLOWED_ORIGINS.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  })
);
app.use(express.json({ limit: "32kb" }));

// ---------- helpers ----------

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

function parseId(raw) {
  if (!/^\d{1,10}$/.test(String(raw))) return null;
  const id = Number(raw);
  return id >= 1 && id <= 4294967295 ? id : null;
}

async function findCar(id) {
  const [rows] = await pool.execute(`SELECT ${SELECT_COLUMNS} FROM cars WHERE id = ?`, [id]);
  return toApiCar(rows[0]);
}

function sendValidationErrors(res, errors) {
  const [first] = errors;
  return res.status(400).json({ error: first.message, field: first.field, errors });
}

/** Resolves the bearer token to a user. Sends 401 when the token is missing, unknown or expired. */
const authenticate = asyncRoute(async (req, res, next) => {
  const token = readBearerToken(req);
  if (!token) return res.status(401).json({ error: "Log in to continue." });
  const [rows] = await pool.execute(
    `SELECT u.id, u.username, u.role, s.expires_at
       FROM sessions s JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP()`,
    [hashToken(token)]
  );
  if (rows.length === 0) return res.status(401).json({ error: "Your session has expired. Log in again." });
  req.user = rows[0];
  next();
});

/** authenticate + the account must have the admin role. */
const requireAdmin = [
  authenticate,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "This account can view listings but cannot change them." });
    }
    next();
  },
];

// ---------- health ----------

app.get(
  "/api/health",
  asyncRoute(async (req, res) => {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  })
);

// ---------- auth ----------

app.post(
  "/api/login",
  asyncRoute(async (req, res) => {
    const { username, password } = req.body || {};
    if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
      return res.status(400).json({ success: false, error: "Enter your username and password." });
    }
    const name = username.trim();
    if (loginLimiter.isBlocked(req.ip, name)) {
      return res.status(429).json({ success: false, error: "Too many failed attempts. Wait 15 minutes and try again." });
    }

    let user;
    if (name.length <= 50 && password.length <= 200) {
      const [rows] = await pool.execute(
        "SELECT id, username, password_hash, role FROM admin_users WHERE username = ?",
        [name]
      );
      user = rows[0];
    }
    // Always run one scrypt comparison so unknown usernames take as long as wrong passwords.
    const ok = await verifyPassword(password, user ? user.password_hash : await dummyHash());
    if (!user || !ok) {
      loginLimiter.recordFailure(req.ip, name);
      return res.status(401).json({ success: false, error: "Incorrect username or password." });
    }
    loginLimiter.reset(req.ip, name);

    const token = newSessionToken();
    await pool.execute("DELETE FROM sessions WHERE expires_at <= UTC_TIMESTAMP()");
    await pool.execute(
      "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? MINUTE))",
      [hashToken(token), user.id, SESSION_TTL_MINUTES]
    );
    res.json({
      success: true,
      token,
      username: user.username,
      role: user.role,
      expiresAt: new Date(Date.now() + SESSION_TTL_MINUTES * 60 * 1000).toISOString(),
    });
  })
);

app.post(
  "/api/logout",
  asyncRoute(async (req, res) => {
    const token = readBearerToken(req);
    if (token) await pool.execute("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
    res.status(204).end();
  })
);

app.get("/api/session", authenticate, (req, res) => {
  res.json({
    username: req.user.username,
    role: req.user.role,
    expiresAt: new Date(req.user.expires_at).toISOString(),
  });
});

// ---------- listings (public) ----------

app.get(
  "/api/cars",
  asyncRoute(async (req, res) => {
    const { sql, params, errors } = buildCarQuery(req.query);
    if (errors.length) return res.status(400).json({ error: errors[0], errors });
    const [rows] = await pool.execute(sql, params);
    res.json(rows.map(toApiCar));
  })
);

app.get(
  "/api/cars/:id",
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Listing id must be a positive whole number." });
    const car = await findCar(id);
    if (!car) return res.status(404).json({ error: "This listing does not exist." });
    res.json(car);
  })
);

app.get(
  "/api/brands",
  asyncRoute(async (req, res) => {
    const [rows] = await pool.query(
      "SELECT `brand` AS name, COUNT(*) AS count FROM cars GROUP BY `brand` ORDER BY `brand`"
    );
    res.json(rows.map((row) => ({ name: row.name, count: Number(row.count) })));
  })
);

app.get(
  "/api/models",
  asyncRoute(async (req, res) => {
    const brand = typeof req.query.brand === "string" ? req.query.brand.trim() : "";
    if (!brand) return res.status(400).json({ error: "Choose a brand first." });
    const [rows] = await pool.execute("SELECT DISTINCT `model` FROM cars WHERE `brand` = ? ORDER BY `model`", [brand]);
    res.json(rows.map((row) => row.model));
  })
);

// ---------- listings (admin only) ----------

app.post(
  "/api/cars",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const { values, errors } = validateCar(req.body, { partial: false });
    if (errors.length) return sendValidationErrors(res, errors);
    const columns = Object.keys(values);
    const [result] = await pool.execute(
      `INSERT INTO cars (${columns.map((c) => `\`${c}\``).join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
      columns.map((c) => values[c])
    );
    const car = await findCar(result.insertId);
    res.status(201).json({ success: true, id: car.id, car });
  })
);

app.put(
  "/api/cars/:id",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Listing id must be a positive whole number." });
    const { values, errors } = validateCar(req.body, { partial: true });
    if (errors.length) return sendValidationErrors(res, errors);
    if (!(await findCar(id))) return res.status(404).json({ error: "This listing does not exist." });

    // Column names come from the FIELDS whitelist in lib/cars.js, never from the request.
    const columns = Object.keys(values);
    await pool.execute(
      `UPDATE cars SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")} WHERE id = ?`,
      [...columns.map((c) => values[c]), id]
    );
    res.json({ success: true, car: await findCar(id) });
  })
);

app.delete(
  "/api/cars/:id",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Listing id must be a positive whole number." });
    const [result] = await pool.execute("DELETE FROM cars WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "This listing does not exist." });
    res.json({ success: true, id });
  })
);

// ---------- fallbacks ----------

app.use("/api", (req, res) => res.status(404).json({ error: "This API route does not exist." }));
app.use((req, res) => res.status(404).json({ error: "Not found." }));

// Clients get a generic message; the details stay in the server log.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "The request body must be valid JSON." });
  }
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({ error: "The request body is too large." });
  }
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} failed:`, err);
  if (res.headersSent) return;
  res.status(500).json({ error: GENERIC_ERROR });
});

// ---------- start-up: check the database first, then listen ----------

async function start() {
  try {
    await pool.query("SELECT 1 FROM cars LIMIT 1");
    await pool.query("SELECT 1 FROM admin_users LIMIT 1");
    await pool.query("SELECT 1 FROM sessions LIMIT 1");
  } catch (err) {
    console.error(`\nONE2CAR API could not start.\n  ${describeDbError(err, dbConfig)}\n`);
    await pool.end().catch(() => {});
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`ONE2CAR API listening on http://localhost:${PORT}`);
    console.log(`Database: ${dbConfig.database} on ${dbConfig.socketPath || `${dbConfig.host}:${dbConfig.port}`}`);
    console.log(`Allowed browser origins: ${ALLOWED_ORIGINS.join(", ")}`);
  });
  server.on("error", (err) => {
    console.error(`\nONE2CAR API could not listen on port ${PORT}: ${err.code || err.message}\n`);
    process.exit(1);
  });

  const shutdown = () => {
    server.close(() => pool.end().finally(() => process.exit(0)));
    setTimeout(() => process.exit(0), 3000).unref();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start();
