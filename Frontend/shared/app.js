// ONE2CAR shared front-end module.
// API base URL, session helpers, safe DOM building, formatting, toasts and the site header/footer.
// Every value that comes from the database is rendered with textContent (via el()), never innerHTML.

export const API_BASE = String(window.ONE2CAR_API_BASE || "http://localhost:8080").replace(/\/+$/, "");
export const FALLBACK_IMAGE = "/shared/img/car-placeholder.svg";

const SESSION_KEY = "one2car.session";
const FLASH_KEY = "one2car.flash";
const LAST_SEARCH_KEY = "one2car.lastSearch";
const LEGACY_KEYS = ["isLoggedIn", "role", "loginTime", "modifyCarId"];

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

/**
 * Creates an element. attrs: class, text, dataset, on<event> handlers, or plain attributes.
 * Children may be nodes, strings (inserted as text) or null/false (skipped).
 */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
    else if (value === true) node.setAttribute(key, "");
    else node.setAttribute(key, String(value));
  }
  append(node, children);
  return node;
}

function append(node, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

/** For the rare case where an HTML string is built by hand. */
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

// Static icon markup only (never user data).
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  gauge: '<path d="M3.5 17a9 9 0 1 1 17 0"/><path d="m12 14 4.5-4.5"/><circle cx="12" cy="14" r="1.6"/>',
  fuel: '<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M7 8h4"/><path d="M14 10h2a2 2 0 0 1 2 2v4.5a1.5 1.5 0 0 0 3 0V8.5L18 5.5"/>',
  gear: '<circle cx="6" cy="5" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="18" cy="5" r="1.8"/><circle cx="6" cy="19" r="1.8"/><circle cx="12" cy="19" r="1.8"/><path d="M6 6.8v10.4M12 6.8v10.4M18 6.8V12H6"/>',
  phone: '<path d="M5 4h3.5l2 5-2.5 1.5a11 11 0 0 0 5.5 5.5l1.5-2.5 5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="m3 3 18 18"/><path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.9 9.9 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.01"/>',
  store: '<path d="M3 9.5 4.5 4h15L21 9.5M4 9.5V20h16V9.5M3 9.5h18M9.5 20v-5.5h5V20"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
};

export function icon(name, className = "icon") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.innerHTML = ICONS[name] || "";
  return svg;
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

const numberFormat = new Intl.NumberFormat("en-US");

export function formatNumber(value) {
  const n = Number(value);
  return value === null || value === undefined || value === "" || !Number.isFinite(n) ? "" : numberFormat.format(n);
}

export function formatMileage(km) {
  return km === null || km === undefined || km === "" ? "Mileage not listed" : `${formatNumber(km)} km`;
}

/** 0812345670 -> 081-234-5670, 021234567 -> 02-123-4567. */
export function formatPhone(raw) {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  return digits;
}

export function sellerTypeLabel(type) {
  const t = String(type ?? "").toLowerCase();
  if (t === "dealer") return "Dealer";
  if (t === "private") return "Private seller";
  return "Seller";
}

export function carTitle(car) {
  return [car?.year, car?.name].filter(Boolean).join(" ") || "Untitled listing";
}

export function plural(count, one, many = `${one}s`) {
  return `${formatNumber(count)} ${count === 1 ? one : many}`;
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

/** Returns the URL if it is an absolute http(s) link, otherwise null. */
export function safeImageUrl(url) {
  try {
    const parsed = new URL(String(url ?? "").trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
}

/** Points an <img> at a listing photo, falling back to the local placeholder if it is missing or broken. */
export function setImageSource(img, url) {
  const safe = safeImageUrl(url);
  img.classList.toggle("is-fallback", !safe);
  img.referrerPolicy = "no-referrer";
  img.onerror = () => {
    img.onerror = null;
    img.classList.add("is-fallback");
    img.src = FALLBACK_IMAGE;
  };
  img.src = safe || FALLBACK_IMAGE;
}

export function carImage(url, alt, attrs = {}) {
  const img = el("img", { alt: alt ?? "", loading: "lazy", decoding: "async", ...attrs });
  setImageSource(img, url);
  return img;
}

// ---------------------------------------------------------------------------
// Session (admin login)
// ---------------------------------------------------------------------------

function storage(kind) {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function getSession() {
  const store = storage("local");
  if (!store) return null;
  try {
    const session = JSON.parse(store.getItem(SESSION_KEY) || "null");
    if (!session?.token || !session.expiresAt || Date.parse(session.expiresAt) <= Date.now()) {
      store.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    store.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession({ token, username, role, expiresAt }) {
  storage("local")?.setItem(SESSION_KEY, JSON.stringify({ token, username, role, expiresAt }));
}

export function clearSession() {
  const store = storage("local");
  store?.removeItem(SESSION_KEY);
  LEGACY_KEYS.forEach((key) => store?.removeItem(key));
}

export function isAdmin() {
  return getSession()?.role === "admin";
}

export function loginUrl(next = location.pathname + location.search) {
  return `/login?next=${encodeURIComponent(next)}`;
}

/** Only same-site paths are allowed as a post-login destination. */
export function safeNextPath(next) {
  return typeof next === "string" && /^\/(?![/\\])/.test(next) ? next : "/homepage";
}

function redirectToLogin(message) {
  clearSession();
  flash(message, "info");
  location.replace(loginUrl());
}

/**
 * Admin pages call this first. It checks the stored token with the API.
 * Returns true when the page may continue.
 */
export async function ensureAdmin() {
  if (!isAdmin()) {
    redirectToLogin("Log in as an admin to manage listings.");
    return false;
  }
  try {
    const session = await api("/api/session", { auth: true });
    if (session.role !== "admin") {
      redirectToLogin("This account cannot manage listings. Log in with an admin account.");
      return false;
    }
    return true;
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      redirectToLogin("Your session has expired. Log in again to continue.");
      return false;
    }
    toast(err.message, { type: "error" });
    return true;
  }
}

/** Shared handling for 401/403 on admin actions. Returns true if the error was handled. */
export function handleAuthError(err) {
  if (err?.status === 401) {
    redirectToLogin("Your session has expired. Log in again to continue.");
    return true;
  }
  if (err?.status === 403) {
    toast(err.message, { type: "error" });
    return true;
  }
  return false;
}

export async function logout() {
  if (getSession()) {
    try {
      await api("/api/logout", { method: "POST", auth: true });
    } catch {
      // The local session is cleared either way.
    }
  }
  clearSession();
  flash("You're logged out.", "info");
  location.href = "/homepage";
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.field = body?.field ?? null;
  }
}

export async function api(path, { method = "GET", body, auth = false, signal } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const session = getSession();
    if (session) headers.Authorization = `Bearer ${session.token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError(`Can't reach the ONE2CAR API at ${API_BASE}. Check that the backend is running.`, 0, null);
  }

  let data = null;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    throw new ApiError(data?.error || `The server answered with status ${response.status}.`, response.status, data);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Toasts and flash messages
// ---------------------------------------------------------------------------

let toastRegion;

function toastContainer() {
  if (!toastRegion || !toastRegion.isConnected) {
    toastRegion = el("div", { class: "toast-region", role: "status", "aria-live": "polite" });
    document.body.append(toastRegion);
  }
  return toastRegion;
}

/** Shows a dismissible notification. type: success | error | info. */
export function toast(message, { type = "success", timeout = type === "error" ? 8000 : 5000 } = {}) {
  const region = toastContainer();
  const iconName = type === "error" ? "alert" : type === "info" ? "info" : "check";
  let timer;
  const item = el(
    "div",
    { class: `toast toast--${type}` },
    icon(iconName, "icon toast__icon"),
    el("p", { class: "toast__text", text: message }),
    el("button", { class: "toast__close", type: "button", "aria-label": "Dismiss notification", onclick: () => dismiss() }, icon("close"))
  );
  function dismiss() {
    clearTimeout(timer);
    item.classList.add("is-leaving");
    setTimeout(() => item.remove(), 200);
  }
  const start = () => {
    if (timeout) timer = setTimeout(dismiss, timeout);
  };
  item.addEventListener("mouseenter", () => clearTimeout(timer));
  item.addEventListener("mouseleave", start);
  region.append(item);
  start();
  return dismiss;
}

/** Queues a toast for the next page load (e.g. "Listing published" after a redirect). */
export function flash(message, type = "success") {
  storage("session")?.setItem(FLASH_KEY, JSON.stringify({ message, type }));
}

function showFlash() {
  const store = storage("session");
  const raw = store?.getItem(FLASH_KEY);
  if (!raw) return;
  store.removeItem(FLASH_KEY);
  try {
    const { message, type } = JSON.parse(raw);
    if (message) toast(message, { type });
  } catch {
    // ignore malformed flash data
  }
}

// ---------------------------------------------------------------------------
// Site chrome
// ---------------------------------------------------------------------------

export function logoPlate(extraClass = "") {
  return el(
    "span",
    { class: `plate plate--logo ${extraClass}`.trim(), "aria-hidden": "true" },
    el("span", { class: "plate__main", text: "ONE2CAR" }),
    el("span", { class: "plate__sub", text: "รถมือสอง" })
  );
}

const NAV_LINKS = [
  { href: "/homepage", label: "Home", paths: ["/", "/homepage"] },
  { href: "/search", label: "Search", paths: ["/search", "/search-result"] },
  { href: "/member", label: "Team", paths: ["/member"] },
];

function currentPath() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const path = currentPath();
  const session = getSession();
  const admin = session?.role === "admin";

  const links = el(
    "ul",
    { class: "site-nav__links" },
    NAV_LINKS.map((link) =>
      el("li", {}, el("a", { href: link.href, "aria-current": link.paths.includes(path) ? "page" : null, text: link.label }))
    )
  );

  const actions = el("div", { class: "site-nav__actions" });
  if (admin) {
    actions.append(
      el("span", { class: "site-nav__user", text: `Signed in as ${session.username}` }),
      el(
        "a",
        { class: "btn btn--on-ink btn--sm", href: "/product-modify", "aria-current": path === "/product-modify" ? "page" : null },
        icon("edit"),
        "Manage listings"
      ),
      el(
        "a",
        { class: "btn btn--primary btn--sm", href: "/product-add", "aria-current": path === "/product-add" ? "page" : null },
        icon("plus"),
        "Add listing"
      ),
      el("button", { class: "btn btn--on-ink btn--sm", type: "button", onclick: () => logout() }, "Log out")
    );
  } else {
    actions.append(el("a", { class: "btn btn--on-ink btn--sm", href: loginUrl(path === "/login" ? "/homepage" : undefined) }, "Admin login"));
  }

  const nav = el("nav", { class: "site-nav", id: "site-nav", "aria-label": "Main" }, links, actions);
  const toggle = el(
    "button",
    { class: "nav-toggle", type: "button", "aria-expanded": "false", "aria-controls": "site-nav" },
    icon("menu"),
    el("span", { text: "Menu" })
  );
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.replaceChildren(icon(open ? "close" : "menu"), el("span", { text: open ? "Close" : "Menu" }));
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  const header = el(
    "header",
    { class: "site-header" },
    el(
      "div",
      { class: "site-header__inner container" },
      el("a", { class: "brand-link", href: "/homepage", "aria-label": "ONE2CAR home" }, logoPlate()),
      toggle,
      nav
    )
  );
  mount.replaceWith(header);
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  const accountLink = isAdmin()
    ? el("a", { href: "/product-modify", text: "Manage listings" })
    : el("a", { href: "/login", text: "Admin login" });
  const footer = el(
    "footer",
    { class: "site-footer" },
    el(
      "div",
      { class: "container site-footer__inner" },
      logoPlate("plate--sm"),
      el(
        "div",
        { class: "site-footer__about" },
        el("p", { text: "ONE2CAR is a student web development project, revised in November 2026." }),
        el("p", { text: "Listings, sellers and phone numbers are demo data." })
      ),
      el(
        "nav",
        { "aria-label": "Footer" },
        el(
          "ul",
          {},
          el("li", {}, el("a", { href: "/search", text: "Search cars" })),
          el("li", {}, el("a", { href: "/member", text: "Team" })),
          el("li", {}, accountLink)
        )
      )
    )
  );
  mount.replaceWith(footer);
}

/** Call once at the top of every page script. */
export function initPage() {
  const store = storage("local");
  LEGACY_KEYS.forEach((key) => store?.removeItem(key));
  renderHeader();
  renderFooter();
  showFlash();
}

// ---------------------------------------------------------------------------
// Listing UI pieces
// ---------------------------------------------------------------------------

export function pricePlate(price, extraClass = "") {
  const n = Number(price);
  const known = price !== null && price !== undefined && Number.isFinite(n) && n > 0;
  return el(
    "span",
    { class: `plate plate--price ${extraClass}`.trim() },
    el("span", { class: "plate__main", text: known ? formatNumber(n) : "Ask seller" }),
    el("span", { class: "plate__sub", text: known ? "THB" : "price" })
  );
}

export function sellerTag(type) {
  const t = String(type ?? "").toLowerCase();
  if (t !== "dealer" && t !== "private") return null;
  return el("span", { class: `tag tag--${t}` }, icon(t === "dealer" ? "store" : "user"), sellerTypeLabel(t));
}

const SPEC_ICONS = { year: "calendar", mileage: "gauge", fuelType: "fuel", transmission: "gear" };

export function specList(car, keys = ["mileage", "fuelType", "transmission"]) {
  const values = {
    year: car.year,
    mileage: formatMileage(car.mileage),
    fuelType: car.fuelType,
    transmission: car.transmission,
  };
  const labels = { year: "Year", mileage: "Mileage", fuelType: "Fuel", transmission: "Transmission" };
  return el(
    "ul",
    { class: "specs" },
    keys
      .filter((key) => values[key])
      .map((key) =>
        el(
          "li",
          { class: "specs__item" },
          icon(SPEC_ICONS[key]),
          el("span", { class: "sr-only", text: `${labels[key]}: ` }),
          el("span", { text: values[key] })
        )
      )
  );
}

/** A listing card. The title link is stretched over the whole card, so the card is one tab stop. */
export function carCard(car, { headingLevel = "h3" } = {}) {
  const title = carTitle(car);
  return el(
    "article",
    { class: "car-card" },
    el("div", { class: "car-card__media" }, carImage(car.image_1, `${title}${car.model ? `, ${car.model}` : ""}`), sellerTag(car.type)),
    el(
      "div",
      { class: "car-card__body" },
      el(headingLevel, { class: "car-card__title" }, el("a", { class: "car-card__link", href: `/detail?id=${encodeURIComponent(car.id)}`, text: title })),
      car.model ? el("p", { class: "car-card__model", text: car.model }) : null,
      specList(car),
      el("div", { class: "car-card__foot" }, pricePlate(car.price))
    )
  );
}

export function brandTile(brand, { current = false } = {}) {
  return el(
    "a",
    { class: "brand-tile", href: searchUrl({ brand: brand.name }), "aria-current": current ? "true" : null },
    el("span", { class: "brand-tile__name", text: brand.name }),
    el("span", { class: "brand-tile__count", text: plural(Number(brand.count) || 0, "car") })
  );
}

export function skeletons(count, className) {
  return Array.from({ length: count }, () => el("li", { class: `skeleton ${className}`, "aria-hidden": "true" }));
}

export function stateBlock({ title, text, actions = [], tone = "" }) {
  return el(
    "div",
    { class: `state ${tone ? `state--${tone}` : ""}`.trim() },
    el("h2", { class: "state__title", text: title }),
    text ? el("p", { class: "state__text", text }) : null,
    actions.length ? el("div", { class: "state__actions" }, actions) : null
  );
}

// ---------------------------------------------------------------------------
// Search form (home hero, search page, results page)
// ---------------------------------------------------------------------------

export const SORT_OPTIONS = [
  ["newest", "Newest first"],
  ["price_asc", "Price: low to high"],
  ["price_desc", "Price: high to low"],
  ["year_desc", "Year: newest model"],
  ["mileage_asc", "Mileage: lowest first"],
];

/** Reads the search filters from the current URL (keeps the original parameter names). */
export function currentSearchValues() {
  const params = new URLSearchParams(location.search);
  const sellerType = (params.get("sellerType") ?? params.get("type") ?? "").toLowerCase();
  return {
    keyword: (params.get("keyword") ?? params.get("q") ?? "").trim(),
    brand: (params.get("brand") ?? "").trim(),
    model: (params.get("model") ?? "").trim(),
    sellerType: sellerType === "dealer" || sellerType === "private" ? sellerType : "",
    sort: SORT_OPTIONS.some(([value]) => value === params.get("sort")) ? params.get("sort") : "",
  };
}

export function searchUrl(values = {}) {
  const params = new URLSearchParams();
  for (const key of ["keyword", "brand", "model", "sellerType", "sort"]) {
    const value = String(values[key] ?? "").trim();
    if (value && !(key === "sort" && value === "newest")) params.set(key, value);
  }
  const query = params.toString();
  return `/search-result${query ? `?${query}` : ""}`;
}

export function rememberSearch(url = location.pathname + location.search) {
  storage("session")?.setItem(LAST_SEARCH_KEY, url);
}

export function lastSearch() {
  const value = storage("session")?.getItem(LAST_SEARCH_KEY);
  return value && value.startsWith("/search-result") ? value : null;
}

let brandsPromise;
export function loadBrands() {
  if (!brandsPromise) brandsPromise = api("/api/brands").catch((err) => ((brandsPromise = null), Promise.reject(err)));
  return brandsPromise;
}

function fillSelect(select, placeholder, options, selected) {
  select.replaceChildren(el("option", { value: "", text: placeholder }));
  for (const [value, label] of options) select.append(el("option", { value, text: label }));
  if (selected && !options.some(([value]) => value === selected)) {
    select.append(el("option", { value: selected, text: selected }));
  }
  select.value = selected || "";
}

/**
 * Wires a search form whose fields are named keyword, brand, model, sellerType, sort
 * (model and sort are optional). Submitting navigates to /search-result with clean params.
 */
export async function initSearchForm(form, { values = currentSearchValues(), autoApply = false } = {}) {
  const { keyword, brand, model, sellerType, sort } = form.elements;
  if (keyword) keyword.value = values.keyword;
  if (sellerType) sellerType.value = values.sellerType;
  if (sort) {
    sort.replaceChildren(...SORT_OPTIONS.map(([value, label]) => el("option", { value, text: label })));
    sort.value = values.sort || "newest";
  }

  const submit = () => {
    location.href = searchUrl({
      keyword: keyword?.value,
      brand: brand?.value,
      model: model?.value,
      sellerType: sellerType?.value,
      sort: sort?.value,
    });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submit();
  });

  async function loadModels(selectedBrand, selectedModel = "") {
    if (!model) return;
    if (!selectedBrand) {
      fillSelect(model, "Any model", [], "");
      model.disabled = true;
      return;
    }
    model.disabled = true;
    try {
      const models = await api(`/api/models?brand=${encodeURIComponent(selectedBrand)}`);
      fillSelect(model, "Any model", models.map((m) => [m, m]), selectedModel);
    } catch {
      fillSelect(model, "Any model", [], selectedModel);
    }
    model.disabled = false;
  }

  if (brand) {
    brand.addEventListener("change", async () => {
      await loadModels(brand.value);
      if (autoApply) submit();
    });
    try {
      const brands = await loadBrands();
      fillSelect(brand, "Any brand", brands.map((b) => [b.name, `${b.name} (${b.count})`]), values.brand);
    } catch {
      fillSelect(brand, "Any brand", [], values.brand);
    }
  }
  await loadModels(values.brand, values.model);

  if (autoApply) {
    for (const field of [model, sellerType, sort]) field?.addEventListener("change", submit);
  }
}
