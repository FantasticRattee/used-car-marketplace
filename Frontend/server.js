"use strict";

// ONE2CAR front-end server: serves the static pages and the shared design system on port 5500.

const path = require("node:path");
const express = require("express");

const PORT = Number(process.env.FRONTEND_PORT || process.env.PORT) || 5500;
const API_BASE_URL = (process.env.API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");

let apiOrigin;
try {
  apiOrigin = new URL(API_BASE_URL).origin;
} catch {
  console.error(`API_BASE_URL "${API_BASE_URL}" is not a valid URL (example: http://localhost:8080).`);
  process.exit(1);
}

// URL path -> folder. Folder names keep their original (mixed) case; URLs are lower-case.
const PAGES = {
  homepage: "Homepage",
  login: "Login",
  search: "searchpage",
  "search-result": "searchpage-result",
  detail: "Detail",
  "product-add": "product-add",
  "product-modify": "product-modify",
  member: "member",
};

const app = express();
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.set({
    "Content-Security-Policy": [
      "default-src 'self'",
      `connect-src 'self' ${apiOrigin}`,
      "img-src 'self' https: http: data:",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "script-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
    "X-Content-Type-Options": "nosniff",
    // Listing photos are hot-linked from image hosts that reject unknown referrers.
    "Referrer-Policy": "no-referrer",
  });
  next();
});

// Lets the pages find the API without hard-coding its URL in every script.
app.get("/config.js", (req, res) => {
  res
    .type("application/javascript")
    .set("Cache-Control", "no-store")
    .send(`window.ONE2CAR_API_BASE = ${JSON.stringify(API_BASE_URL)};\n`);
});

app.use("/shared", express.static(path.join(__dirname, "shared"), { index: false }));

for (const [route, folder] of Object.entries(PAGES)) {
  const dir = path.join(__dirname, folder);
  app.get(`/${route}`, (req, res) => res.sendFile(path.join(dir, "index.html")));
  app.use(`/${route}`, express.static(dir, { index: false }));
}

// Old links from the first version of the site.
const withQuery = (req, target) => target + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "");
app.get("/", (req, res) => res.redirect("/homepage"));
app.get("/searchpage", (req, res) => res.redirect(301, withQuery(req, "/search")));
app.get("/searchpage-result", (req, res) => res.redirect(301, withQuery(req, "/search-result")));
app.get("/logout", (req, res) => res.redirect("/homepage"));

app.use((req, res) => {
  res.status(404).type("text/plain").send("Page not found. Go to /homepage.");
});

const server = app.listen(PORT, () => {
  console.log(`ONE2CAR front end running at http://localhost:${PORT}`);
  console.log(`Pages call the API at ${API_BASE_URL}`);
});
server.on("error", (err) => {
  console.error(`Front end could not listen on port ${PORT}: ${err.code || err.message}`);
  process.exit(1);
});
