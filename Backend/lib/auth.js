"use strict";

const crypto = require("node:crypto");
const { promisify } = require("node:util");

const scrypt = promisify(crypto.scrypt);

// scrypt cost parameters. N=2^14, r=8 uses ~16 MB per hash, which is fine for an admin login.
const SCRYPT = { N: 16384, r: 8, p: 1, keyLength: 64, maxmem: 64 * 1024 * 1024 };

/** Hashes a password as "scrypt$N$r$p$salt$key" (salt and key are base64). */
async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(String(password).normalize("NFKC"), salt, SCRYPT.keyLength, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
    maxmem: SCRYPT.maxmem,
  });
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64"), key.toString("base64")].join("$");
}

/** Constant-time check of a password against a stored hash. Returns false for malformed hashes. */
async function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [N, r, p] = parts.slice(1, 4).map(Number);
  const salt = Buffer.from(parts[4], "base64");
  const expected = Buffer.from(parts[5], "base64");
  if (![N, r, p].every(Number.isInteger) || expected.length === 0) return false;
  const key = await scrypt(String(password).normalize("NFKC"), salt, expected.length, {
    N,
    r,
    p,
    maxmem: SCRYPT.maxmem,
  });
  return crypto.timingSafeEqual(key, expected);
}

let dummyHashPromise;
/** A real hash to compare against when the username does not exist, so both paths take similar time. */
function dummyHash() {
  if (!dummyHashPromise) dummyHashPromise = hashPassword(crypto.randomBytes(16).toString("hex"));
  return dummyHashPromise;
}

/** 256-bit random bearer token. Only its SHA-256 digest is stored in the database. */
function newSessionToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

/** Reads "Authorization: Bearer <token>" and returns the token, or null. */
function readBearerToken(req) {
  const match = /^Bearer\s+([A-Za-z0-9_-]{20,200})$/.exec(req.get("authorization") || "");
  return match ? match[1] : null;
}

/**
 * Small in-memory limiter for failed logins: after `limit` failures for the same
 * IP + username inside `windowMs`, further attempts are refused until the window passes.
 */
function createLoginLimiter({ limit = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const failures = new Map();
  const keyFor = (ip, username) => `${ip}|${String(username).toLowerCase()}`;
  function prune(now) {
    for (const [key, entry] of failures) if (now - entry.first > windowMs) failures.delete(key);
  }
  return {
    isBlocked(ip, username) {
      const now = Date.now();
      prune(now);
      const entry = failures.get(keyFor(ip, username));
      return Boolean(entry && entry.count >= limit);
    },
    recordFailure(ip, username) {
      const key = keyFor(ip, username);
      const entry = failures.get(key) || { count: 0, first: Date.now() };
      entry.count += 1;
      failures.set(key, entry);
    },
    reset(ip, username) {
      failures.delete(keyFor(ip, username));
    },
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  dummyHash,
  newSessionToken,
  hashToken,
  readBearerToken,
  createLoginLimiter,
};
