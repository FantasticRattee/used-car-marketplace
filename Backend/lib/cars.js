"use strict";

/**
 * Listing fields the API accepts. This map is the column whitelist: request keys are
 * looked up here and only `column` values from this file ever reach SQL text.
 */
const FIELDS = {
  brand: { column: "brand", label: "Brand", kind: "text", max: 100, required: true },
  name: { column: "name", label: "Name", kind: "text", max: 150, required: true },
  model: { column: "model", label: "Model", kind: "text", max: 150, required: true },
  year: { column: "year", label: "Year", kind: "int", min: 1950, max: () => new Date().getFullYear() + 1, required: true },
  price: { column: "price", label: "Price", kind: "int", min: 1, max: 1_000_000_000, required: true },
  mileage: { column: "mileage", label: "Mileage", kind: "int", min: 0, max: 2_000_000, nullable: true },
  fuelType: { column: "fuelType", label: "Fuel type", kind: "text", max: 50, required: true },
  transmission: { column: "transmission", label: "Transmission", kind: "text", max: 50, required: true },
  type: { column: "type", label: "Seller type", kind: "enum", values: ["dealer", "private"], required: true },
  image_1: { column: "image_1", label: "Photo 1", kind: "url", required: true },
  image_2: { column: "image_2", label: "Photo 2", kind: "url", nullable: true },
  image_3: { column: "image_3", label: "Photo 3", kind: "url", nullable: true },
  description: { column: "description", label: "Description", kind: "text", max: 2000, nullable: true, multiline: true },
  owner_name: { column: "owner_name", label: "Owner first name", kind: "text", max: 100, required: true },
  owner_surname: { column: "owner_surname", label: "Owner surname", kind: "text", max: 100, nullable: true },
  phone_number: { column: "phone_number", label: "Phone number", kind: "phone", required: true },
};

const SELECT_COLUMNS = [
  "id",
  ...Object.values(FIELDS).map((f) => f.column),
  "created_at",
  "updated_at",
]
  .map((c) => `\`${c}\``)
  .join(", ");

const SORTS = {
  newest: "`id` DESC",
  price_asc: "`price` ASC, `id` DESC",
  price_desc: "`price` DESC, `id` DESC",
  year_desc: "`year` DESC, `id` DESC",
  mileage_asc: "`mileage` IS NULL, `mileage` ASC, `id` DESC",
};

const numberFormat = new Intl.NumberFormat("en-US");
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const CONTROL_CHARS_SINGLE_LINE = /[\u0000-\u001F\u007F]/;

function isEmpty(value) {
  return value === null || value === undefined || (typeof value === "string" && value.trim() === "");
}

/** Normalises one field value. Returns { value } or { error }. */
function normaliseField(field, raw) {
  if (isEmpty(raw)) {
    if (field.required) return { error: `${field.label} is required.` };
    return { value: null };
  }

  switch (field.kind) {
    case "text": {
      if (typeof raw !== "string" && typeof raw !== "number") return { error: `${field.label} must be text.` };
      const value = String(raw).trim();
      if (value.length > field.max) return { error: `${field.label} must be ${field.max} characters or fewer.` };
      const badChars = field.multiline ? CONTROL_CHARS : CONTROL_CHARS_SINGLE_LINE;
      if (badChars.test(value)) return { error: `${field.label} contains characters that are not allowed.` };
      return { value };
    }
    case "int": {
      let value = raw;
      if (typeof raw === "string") {
        // Accept "2,190,000" or "2 190 000" from forms; reject units like "THB" or "km".
        const compact = raw.replace(/[,\s]/g, "");
        if (!/^\d+$/.test(compact)) return { error: `${field.label} must be a whole number.` };
        value = Number(compact);
      }
      const max = typeof field.max === "function" ? field.max() : field.max;
      if (typeof value !== "number" || !Number.isSafeInteger(value) || value < field.min || value > max) {
        return { error: `${field.label} must be a whole number from ${numberFormat.format(field.min)} to ${numberFormat.format(max)}.` };
      }
      return { value };
    }
    case "enum": {
      const value = String(raw).trim().toLowerCase();
      if (!field.values.includes(value)) return { error: `${field.label} must be one of: ${field.values.join(", ")}.` };
      return { value };
    }
    case "url": {
      if (typeof raw !== "string") return { error: `${field.label} must be a link.` };
      const value = raw.trim();
      if (value.length > 2048) return { error: `${field.label} link is too long.` };
      let parsed;
      try {
        parsed = new URL(value);
      } catch {
        return { error: `${field.label} must be a full link starting with https://.` };
      }
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return { error: `${field.label} must be a full link starting with https://.` };
      }
      return { value: parsed.href };
    }
    case "phone": {
      if (typeof raw !== "string" && typeof raw !== "number") return { error: `${field.label} must be text.` };
      const value = String(raw).replace(/[\s().-]/g, "");
      if (!/^\+?\d{9,15}$/.test(value)) return { error: `${field.label} must have 9 to 15 digits.` };
      return { value };
    }
    default:
      return { error: `${field.label} is not supported.` };
  }
}

/**
 * Validates a create (partial = false) or update (partial = true) body.
 * Returns { values, errors } where values is keyed by column name.
 */
function validateCar(body, { partial = false } = {}) {
  const errors = [];
  const values = {};

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { values, errors: [{ field: null, message: "Send the listing as a JSON object." }] };
  }

  for (const key of Object.keys(body)) {
    if (!Object.prototype.hasOwnProperty.call(FIELDS, key)) {
      errors.push({ field: key, message: `"${key}" is not a listing field.` });
    }
  }

  for (const [key, field] of Object.entries(FIELDS)) {
    const present = Object.prototype.hasOwnProperty.call(body, key);
    if (!present) {
      if (!partial && field.required) errors.push({ field: key, message: `${field.label} is required.` });
      continue;
    }
    const result = normaliseField(field, body[key]);
    if (result.error) errors.push({ field: key, message: result.error });
    else values[field.column] = result.value;
  }

  if (partial && errors.length === 0 && Object.keys(values).length === 0) {
    errors.push({ field: null, message: "Send at least one field to update." });
  }

  return { values, errors };
}

/** Shapes a database row for the API (numbers as numbers, missing values as null). */
function toApiCar(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    brand: row.brand,
    name: row.name,
    model: row.model,
    year: row.year === null ? null : Number(row.year),
    price: row.price === null ? null : Number(row.price),
    mileage: row.mileage === null ? null : Number(row.mileage),
    fuelType: row.fuelType,
    transmission: row.transmission,
    type: row.type,
    image_1: row.image_1,
    image_2: row.image_2,
    image_3: row.image_3,
    description: row.description,
    owner_name: row.owner_name,
    owner_surname: row.owner_surname,
    phone_number: row.phone_number,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/** Escapes LIKE wildcards so a search for "100%" means the literal text. */
function escapeLike(text) {
  return text.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

/**
 * Builds the WHERE/ORDER BY for GET /api/cars from query parameters.
 * Supported: q (keywords, all must match), brand, model, type (dealer|private), sort.
 */
function buildCarQuery(query) {
  const errors = [];
  const where = [];
  const params = [];

  const read = (name) => {
    const value = query[name];
    if (value === undefined) return "";
    if (typeof value !== "string") {
      errors.push(`Use "${name}" only once.`);
      return "";
    }
    return value.trim();
  };

  const keyword = read("q").slice(0, 100);
  const brand = read("brand");
  const model = read("model");
  const type = read("type").toLowerCase();
  const sort = read("sort") || "newest";

  if (keyword) {
    const terms = keyword.split(/\s+/).filter(Boolean).slice(0, 6);
    for (const term of terms) {
      where.push("CONCAT_WS(' ', `brand`, `name`, `model`, `year`, `fuelType`, `transmission`, `description`) LIKE ?");
      params.push(`%${escapeLike(term)}%`);
    }
  }
  if (brand) {
    where.push("`brand` = ?");
    params.push(brand);
  }
  if (model) {
    where.push("`model` = ?");
    params.push(model);
  }
  if (type) {
    if (!FIELDS.type.values.includes(type)) errors.push('Seller type must be "dealer" or "private".');
    else {
      where.push("`type` = ?");
      params.push(type);
    }
  }
  if (!Object.prototype.hasOwnProperty.call(SORTS, sort)) {
    errors.push(`Sort must be one of: ${Object.keys(SORTS).join(", ")}.`);
  }

  const sql =
    `SELECT ${SELECT_COLUMNS} FROM cars` +
    (where.length ? ` WHERE ${where.join(" AND ")}` : "") +
    ` ORDER BY ${SORTS[sort] || SORTS.newest}`;

  return { sql, params, errors };
}

module.exports = { FIELDS, SELECT_COLUMNS, validateCar, toApiCar, buildCarQuery };
