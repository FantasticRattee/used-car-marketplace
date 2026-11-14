"use strict";

const mysql = require("mysql2/promise");

/** Reads MySQL connection settings from environment variables (see .env.example). */
function dbConfigFromEnv(env = process.env) {
  const config = {
    host: env.DB_HOST || "localhost",
    port: Number(env.DB_PORT) || 3306,
    user: env.DB_USER || "root",
    password: env.DB_PASSWORD || "",
    database: env.DB_NAME || "one2car",
  };
  if (env.DB_SOCKET) config.socketPath = env.DB_SOCKET;
  return config;
}

/** Database names are interpolated into CREATE DATABASE, so only plain identifiers are allowed. */
function assertSafeDatabaseName(name) {
  if (!/^[A-Za-z0-9_]{1,64}$/.test(name)) {
    throw new Error(`DB_NAME "${name}" is not allowed. Use letters, digits and underscores only.`);
  }
}

function createPool(config) {
  const pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_SIZE) || 10,
    enableKeepAlive: true,
    timezone: "Z",
    charset: "utf8mb4",
  });
  // Keep every pooled connection on UTC so session expiry and timestamps line up.
  pool.pool.on("connection", (connection) => {
    connection.query("SET time_zone = '+00:00'");
  });
  return pool;
}

/** Turns low-level MySQL errors into a one-line hint that tells the developer what to fix. */
function describeDbError(err, config) {
  const where = config.socketPath ? `socket ${config.socketPath}` : `${config.host}:${config.port}`;
  switch (err && err.code) {
    case "ECONNREFUSED":
      return `Nothing is accepting MySQL connections at ${where}. Start MySQL, or fix DB_HOST/DB_PORT in Backend/.env.`;
    case "ENOTFOUND":
    case "EAI_AGAIN":
      return `The MySQL host "${config.host}" could not be resolved. Check DB_HOST in Backend/.env.`;
    case "ETIMEDOUT":
      return `Connecting to MySQL at ${where} timed out. Check that the server is running and reachable.`;
    case "ENOENT":
      return `The MySQL socket ${config.socketPath} does not exist. Check DB_SOCKET in Backend/.env.`;
    case "ER_ACCESS_DENIED_ERROR":
      return `MySQL rejected the login for user "${config.user}". Check DB_USER and DB_PASSWORD in Backend/.env.`;
    case "ER_DBACCESS_DENIED_ERROR":
      return `User "${config.user}" may not use database "${config.database}". Grant access or change DB_NAME.`;
    case "ER_BAD_DB_ERROR":
      return `Database "${config.database}" does not exist yet. Run "npm run seed" in Backend/ to create it.`;
    case "ER_NO_SUCH_TABLE":
      return `Tables are missing in database "${config.database}". Run "npm run seed" in Backend/ to create them.`;
    default:
      return `${(err && err.code) || "Error"}: ${(err && err.message) || err}`;
  }
}

module.exports = { dbConfigFromEnv, assertSafeDatabaseName, createPool, describeDbError };
