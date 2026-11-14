// Listing form shared by product-add and product-modify: markup, previews, number formatting,
// client-side validation and the JSON payload sent to POST/PUT /api/cars.

import { el, icon, loadBrands, setImageSource, formatNumber, FALLBACK_IMAGE } from "/shared/app.js";

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Petrol Hybrid", "Diesel Hybrid", "Electric"];
const TRANSMISSION_SUGGESTIONS = [
  "Automatic",
  "Manual",
  "CVT",
  "6-Speed Manual",
  "7-Speed PDK",
  "8-Speed Automatic",
  "8-Speed Tiptronic",
  "9G-Tronic AWD",
];
const BRAND_SUGGESTIONS = [
  "Audi", "BMW", "Bentley", "BYD", "Ferrari", "Ford", "Honda", "Hyundai", "Isuzu", "Lamborghini",
  "Land Rover", "Lexus", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nissan",
  "Porsche", "Rolls-Royce", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
];

const MAX_YEAR = new Date().getFullYear() + 1;

/* Static markup only; every value is filled in later through .value. */
const TEMPLATE = `
<section class="form-card" aria-labelledby="photos-title">
  <div class="form-card__head">
    <h2 class="form-card__title" id="photos-title">Photos</h2>
    <p class="form-card__hint">Paste image links that start with https://. Photo 1 is the main photo on cards and on the listing page.</p>
  </div>
  <div class="form-grid form-grid--photos">
    ${[1, 2, 3]
      .map(
        (n) => `
    <div class="field photo-field">
      <div class="photo-field__preview"><img id="preview-image_${n}" alt="" src="${FALLBACK_IMAGE}"></div>
      <label for="image_${n}">Photo ${n}${n === 1 ? " (main)" : ' <span class="field__optional">(optional)</span>'}</label>
      <input class="input" id="image_${n}" name="image_${n}" type="url" inputmode="url" maxlength="2048" placeholder="https://" autocomplete="off" ${n === 1 ? "required" : ""}>
    </div>`
      )
      .join("")}
  </div>
</section>

<section class="form-card" aria-labelledby="car-title">
  <div class="form-card__head">
    <h2 class="form-card__title" id="car-title">Car details</h2>
  </div>
  <div class="form-grid form-grid--three">
    <div class="field">
      <label for="brand">Brand</label>
      <input class="input" id="brand" name="brand" list="brand-options" required maxlength="100" autocomplete="off" placeholder="e.g. Toyota">
      <datalist id="brand-options"></datalist>
    </div>
    <div class="field">
      <label for="name">Listing name</label>
      <input class="input" id="name" name="name" required maxlength="150" autocomplete="off" placeholder="e.g. Toyota GR Supra 3.0" aria-describedby="name-hint">
      <p class="field__hint" id="name-hint">Shown as the card title, after the year.</p>
    </div>
    <div class="field">
      <label for="model">Model or trim</label>
      <input class="input" id="model" name="model" required maxlength="150" autocomplete="off" placeholder="e.g. RZ Coupe">
    </div>
    <div class="field">
      <label for="year">Year</label>
      <input class="input" id="year" name="year" type="number" inputmode="numeric" required min="1950" max="${MAX_YEAR}" step="1" placeholder="${MAX_YEAR - 2}">
    </div>
    <div class="field">
      <label for="mileage">Mileage <span class="field__optional">(optional)</span></label>
      <div class="input-affix">
        <input class="input" id="mileage" name="mileage" type="text" inputmode="numeric" autocomplete="off" placeholder="e.g. 31,872" data-number="mileage" aria-describedby="mileage-hint">
        <span class="input-affix__suffix" aria-hidden="true">km</span>
      </div>
      <p class="field__hint" id="mileage-hint">In kilometres. Leave empty if unknown.</p>
    </div>
    <div class="field">
      <label for="fuelType">Fuel type</label>
      <select class="select" id="fuelType" name="fuelType" required>
        <option value="">Choose fuel type</option>
        ${FUEL_TYPES.map((f) => `<option value="${f}">${f}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label for="transmission">Transmission</label>
      <input class="input" id="transmission" name="transmission" list="transmission-options" required maxlength="50" autocomplete="off" placeholder="e.g. 8-Speed Automatic">
      <datalist id="transmission-options">
        ${TRANSMISSION_SUGGESTIONS.map((t) => `<option value="${t}"></option>`).join("")}
      </datalist>
    </div>
  </div>
</section>

<section class="form-card" aria-labelledby="price-title">
  <div class="form-card__head">
    <h2 class="form-card__title" id="price-title">Price and seller</h2>
  </div>
  <div class="form-grid">
    <div class="field">
      <label for="price">Asking price</label>
      <div class="input-affix">
        <input class="input" id="price" name="price" type="text" inputmode="numeric" required autocomplete="off" placeholder="e.g. 2,190,000" data-number="price">
        <span class="input-affix__suffix" aria-hidden="true">THB</span>
      </div>
    </div>
    <fieldset class="field choice-field">
      <legend>Seller type</legend>
      <div class="choice-group">
        <label class="choice"><input type="radio" name="type" value="dealer" required><span>Dealer</span></label>
        <label class="choice"><input type="radio" name="type" value="private"><span>Private seller</span></label>
      </div>
    </fieldset>
    <div class="field">
      <label for="owner_name">Seller first name</label>
      <input class="input" id="owner_name" name="owner_name" required maxlength="100" autocomplete="off">
    </div>
    <div class="field">
      <label for="owner_surname">Seller surname <span class="field__optional">(optional)</span></label>
      <input class="input" id="owner_surname" name="owner_surname" maxlength="100" autocomplete="off">
    </div>
    <div class="field">
      <label for="phone_number">Phone number</label>
      <input class="input" id="phone_number" name="phone_number" type="tel" inputmode="tel" required autocomplete="off" placeholder="e.g. 081 234 5678" maxlength="20" aria-describedby="phone-hint">
      <p class="field__hint" id="phone-hint">Shown on the listing so buyers can call. 9 to 15 digits.</p>
    </div>
  </div>
</section>

<section class="form-card" aria-labelledby="about-title">
  <div class="form-card__head">
    <h2 class="form-card__title" id="about-title">Description <span class="field__optional">(optional)</span></h2>
  </div>
  <div class="field">
    <label class="sr-only" for="description">Description</label>
    <textarea class="textarea" id="description" name="description" maxlength="2000" aria-describedby="description-hint description-count" placeholder="Service history, accidents, options and anything a buyer should know."></textarea>
    <div class="field__meta">
      <p class="field__hint" id="description-hint">Plain text. Line breaks are kept.</p>
      <p class="field__hint" id="description-count" aria-live="polite">0 / 2,000</p>
    </div>
  </div>
</section>
`;

const LABELS = {
  image_1: "Photo 1",
  image_2: "Photo 2",
  image_3: "Photo 3",
  brand: "brand",
  name: "listing name",
  model: "model or trim",
  year: "year",
  mileage: "mileage",
  fuelType: "fuel type",
  transmission: "transmission",
  price: "asking price",
  type: "seller type",
  owner_name: "seller first name",
  owner_surname: "seller surname",
  phone_number: "phone number",
  description: "description",
};

const digitsOnly = (value) => String(value ?? "").replace(/\D/g, "");
const numberOrNull = (value) => (digitsOnly(value) ? Number(digitsOnly(value)) : null);
const textOrNull = (value) => (String(value ?? "").trim() ? String(value).trim() : null);

/** Formats a digits-only text input as 2,190,000 while typing, keeping the caret in place. */
function attachNumberFormatting(input) {
  input.addEventListener("input", () => {
    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = digitsOnly(input.value.slice(0, caret)).length;
    const digits = digitsOnly(input.value).replace(/^0+(?=\d)/, "").slice(0, 10);
    const formatted = digits ? formatNumber(Number(digits)) : "";
    input.value = formatted;
    let position = 0;
    let seen = 0;
    while (position < formatted.length && seen < digitsBeforeCaret) {
      if (/\d/.test(formatted[position])) seen += 1;
      position += 1;
    }
    input.setSelectionRange(position, position);
  });
}

export function createListingForm(form) {
  form.classList.add("listing-form");
  form.noValidate = true;
  form.insertAdjacentHTML("afterbegin", TEMPLATE);
  const fields = form.elements;

  // Brand suggestions: brands already listed + common brands.
  const brandList = form.querySelector("#brand-options");
  const addBrandOptions = (names) => {
    const existing = new Set([...brandList.options].map((o) => o.value));
    for (const name of names) if (!existing.has(name)) brandList.append(el("option", { value: name }));
  };
  addBrandOptions(BRAND_SUGGESTIONS);
  loadBrands().then((brands) => addBrandOptions(brands.map((b) => b.name)), () => {});

  // Live photo previews.
  for (const n of [1, 2, 3]) {
    const input = fields[`image_${n}`];
    const preview = form.querySelector(`#preview-image_${n}`);
    let timer;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => setImageSource(preview, input.value), 250);
    });
  }

  form.querySelectorAll("[data-number]").forEach(attachNumberFormatting);

  const description = fields.description;
  const counter = form.querySelector("#description-count");
  const updateCounter = () => {
    counter.textContent = `${formatNumber(description.value.length)} / 2,000`;
  };
  description.addEventListener("input", updateCounter);

  // Clear a field's error as soon as it is edited.
  form.addEventListener("input", (event) => clearError(event.target));
  form.addEventListener("change", (event) => clearError(event.target));

  function errorTarget(name) {
    const field = fields[name];
    if (!field) return null;
    return field instanceof RadioNodeList ? field[0] : field;
  }

  function fieldContainer(name) {
    return errorTarget(name)?.closest(".field");
  }

  function clearError(target) {
    const name = target?.name;
    if (!name) return;
    const container = fieldContainer(name);
    container?.querySelector(".field__error")?.remove();
    const input = errorTarget(name);
    if (input) {
      input.removeAttribute("aria-invalid");
      const describedBy = (input.getAttribute("aria-describedby") || "").split(" ").filter((id) => id && id !== `${name}-error`);
      if (describedBy.length) input.setAttribute("aria-describedby", describedBy.join(" "));
      else input.removeAttribute("aria-describedby");
    }
  }

  function showError(name, message) {
    const container = fieldContainer(name);
    const input = errorTarget(name);
    if (!container || !input) return;
    clearError(input);
    container.append(el("p", { class: "field__error", id: `${name}-error` }, icon("alert"), el("span", { text: message })));
    input.setAttribute("aria-invalid", "true");
    const describedBy = (input.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
    input.setAttribute("aria-describedby", [...describedBy, `${name}-error`].join(" "));
  }

  function clearAllErrors() {
    form.querySelectorAll(".field__error").forEach((node) => node.remove());
    form.querySelectorAll("[aria-invalid]").forEach((node) => node.removeAttribute("aria-invalid"));
    for (const name of Object.keys(LABELS)) clearError({ name });
  }

  /** Returns [{ name, message }] for every invalid field. */
  function validate() {
    const problems = [];
    const value = (name) => String(fields[name]?.value ?? "").trim();
    const require = (name) => {
      if (!value(name)) problems.push({ name, message: `Enter the ${LABELS[name]}.` });
      return Boolean(value(name));
    };

    for (const n of [1, 2, 3]) {
      const name = `image_${n}`;
      if (n === 1 && !value(name)) {
        problems.push({ name, message: "Add a link to the main photo." });
        continue;
      }
      if (value(name)) {
        try {
          const url = new URL(value(name));
          if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("protocol");
        } catch {
          problems.push({ name, message: `Enter a full link for ${LABELS[name]}, starting with https://.` });
        }
      }
    }
    for (const name of ["brand", "name", "model", "transmission", "owner_name"]) require(name);
    if (!value("fuelType")) problems.push({ name: "fuelType", message: "Choose a fuel type." });

    if (require("year")) {
      const year = Number(value("year"));
      if (!Number.isInteger(year) || year < 1950 || year > MAX_YEAR) {
        problems.push({ name: "year", message: `Enter a year from 1950 to ${MAX_YEAR}.` });
      }
    }
    if (require("price")) {
      const price = numberOrNull(value("price"));
      if (!price || price < 1 || price > 1_000_000_000) problems.push({ name: "price", message: "Enter a price from 1 to 1,000,000,000 THB." });
    }
    const mileage = numberOrNull(value("mileage"));
    if (mileage !== null && mileage > 2_000_000) problems.push({ name: "mileage", message: "Enter a mileage of 2,000,000 km or less." });

    if (!fields.type.value) problems.push({ name: "type", message: "Choose dealer or private seller." });

    if (require("phone_number")) {
      const phone = value("phone_number").replace(/[\s().-]/g, "");
      if (!/^\+?\d{9,15}$/.test(phone)) problems.push({ name: "phone_number", message: "Enter a phone number with 9 to 15 digits." });
    }
    return problems;
  }

  /** Shows the problems inline and focuses the first one. Returns true if the form is valid. */
  function check() {
    clearAllErrors();
    const problems = validate();
    for (const { name, message } of problems) showError(name, message);
    if (problems.length) errorTarget(problems[0].name)?.focus();
    return problems.length === 0;
  }

  /** The JSON body for POST/PUT /api/cars. */
  function payload() {
    const value = (name) => String(fields[name]?.value ?? "").trim();
    return {
      image_1: value("image_1"),
      image_2: textOrNull(value("image_2")),
      image_3: textOrNull(value("image_3")),
      brand: value("brand"),
      name: value("name"),
      model: value("model"),
      year: Number(value("year")),
      mileage: numberOrNull(value("mileage")),
      fuelType: value("fuelType"),
      transmission: value("transmission"),
      price: numberOrNull(value("price")),
      type: fields.type.value,
      owner_name: value("owner_name"),
      owner_surname: textOrNull(value("owner_surname")),
      phone_number: value("phone_number").replace(/[\s().-]/g, ""),
      description: textOrNull(fields.description.value),
    };
  }

  /** Loads an existing listing into the form. */
  function fill(car) {
    clearAllErrors();
    for (const n of [1, 2, 3]) {
      fields[`image_${n}`].value = car[`image_${n}`] ?? "";
      setImageSource(form.querySelector(`#preview-image_${n}`), car[`image_${n}`]);
    }
    for (const name of ["brand", "name", "model", "transmission", "owner_name", "owner_surname", "phone_number"]) {
      fields[name].value = car[name] ?? "";
    }
    fields.year.value = car.year ?? "";
    fields.price.value = formatNumber(car.price);
    fields.mileage.value = formatNumber(car.mileage);
    fields.description.value = car.description ?? "";
    updateCounter();

    // Keep values that are not in the fuel list instead of silently blanking them.
    const fuel = car.fuelType ?? "";
    if (fuel && ![...fields.fuelType.options].some((o) => o.value === fuel)) {
      fields.fuelType.append(el("option", { value: fuel, text: fuel }));
    }
    fields.fuelType.value = fuel;

    const type = String(car.type ?? "").toLowerCase();
    for (const radio of fields.type) radio.checked = radio.value === type;
  }

  function setDisabled(disabled) {
    form.querySelectorAll("input, select, textarea, button").forEach((node) => {
      node.disabled = disabled;
    });
  }

  return { check, payload, fill, showError, clearAllErrors, setDisabled, fields };
}
