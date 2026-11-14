import {
  initPage,
  api,
  el,
  icon,
  isAdmin,
  carImage,
  setImageSource,
  safeImageUrl,
  carTitle,
  pricePlate,
  sellerTag,
  sellerTypeLabel,
  formatMileage,
  formatPhone,
  lastSearch,
  stateBlock,
} from "/shared/app.js";

initPage();

const root = document.getElementById("listing");
const back = document.getElementById("back-link");

const previous = lastSearch();
back.replaceChildren(icon("chevronLeft"), previous ? "Back to results" : "Back to all cars");
if (previous) back.href = previous;

function showState(options) {
  root.replaceChildren(el("div", { class: "detail" }, stateBlock(options)));
  root.removeAttribute("aria-busy");
}

function gallery(car, title) {
  const photos = [car.image_1, car.image_2, car.image_3].filter((url) => safeImageUrl(url));
  if (!photos.length) photos.push(null);

  const main = carImage(photos[0], `${title}, photo 1 of ${photos.length}`, { loading: "eager", fetchpriority: "high" });
  const container = el("div", { class: "gallery" }, el("div", { class: "gallery__main" }, main));

  if (photos.length > 1) {
    const buttons = photos.map((url, index) =>
      el(
        "button",
        {
          class: "gallery__thumb",
          type: "button",
          "aria-pressed": index === 0 ? "true" : "false",
          "aria-label": `Show photo ${index + 1} of ${photos.length}`,
          onclick: () => {
            setImageSource(main, url);
            main.alt = `${title}, photo ${index + 1} of ${photos.length}`;
            buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
          },
        },
        carImage(url, "")
      )
    );
    container.append(el("ul", { class: "gallery__thumbs" }, buttons.map((button) => el("li", {}, button))));
  }
  return container;
}

function specTable(car) {
  const rows = [
    ["Year", car.year],
    ["Mileage", formatMileage(car.mileage)],
    ["Fuel type", car.fuelType],
    ["Transmission", car.transmission],
    ["Brand", car.brand],
    ["Seller", sellerTypeLabel(car.type)],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");
  return el(
    "dl",
    { class: "spec-table" },
    rows.map(([label, value]) => el("div", {}, el("dt", { text: label }), el("dd", { text: value })))
  );
}

function sellerBlock(car) {
  const fullName = [car.owner_name, car.owner_surname].filter(Boolean).join(" ") || "Seller";
  const initials = fullName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const digits = String(car.phone_number ?? "").replace(/[^\d+]/g, "");

  const block = el(
    "div",
    { class: "seller" },
    el(
      "div",
      { class: "seller__who" },
      el("span", { class: "seller__avatar", "aria-hidden": "true", text: initials }),
      el("div", {}, el("p", { class: "seller__name", text: fullName }), el("p", { class: "seller__type", text: sellerTypeLabel(car.type) }))
    )
  );
  if (digits.replace(/\D/g, "").length >= 9) {
    block.append(
      el("a", { class: "btn btn--dark btn--block", href: `tel:${digits}` }, icon("phone"), `Call ${formatPhone(digits)}`)
    );
  } else {
    block.append(el("p", { class: "seller__note", text: "The seller did not list a phone number." }));
  }
  return block;
}

function render(car) {
  const title = carTitle(car);
  document.title = `${title} | ONE2CAR`;

  const summary = el(
    "section",
    { class: "summary", "aria-labelledby": "car-title" },
    sellerTag(car.type) ? el("div", {}, sellerTag(car.type)) : null,
    el("h1", { class: "summary__title", id: "car-title", text: title }),
    car.model ? el("p", { class: "summary__model", text: car.model }) : null,
    el("div", { class: "summary__price" }, pricePlate(car.price, "plate--lg")),
    specTable(car),
    sellerBlock(car),
    isAdmin()
      ? el("a", { class: "btn btn--secondary btn--block", href: `/product-modify?id=${encodeURIComponent(car.id)}` }, icon("edit"), "Edit listing")
      : null
  );

  const about = el(
    "section",
    { class: "about", "aria-labelledby": "about-title" },
    el("h2", { class: "about__title", id: "about-title", text: "About this car" }),
    el("p", { class: "about__text", text: car.description || "The seller has not added a description yet." })
  );

  root.replaceChildren(el("div", { class: "detail" }, gallery(car, title), summary, about));
  root.removeAttribute("aria-busy");
}

const id = new URLSearchParams(location.search).get("id") ?? "";

if (!/^\d{1,10}$/.test(id)) {
  showState({
    title: "Listing not found",
    text: "This link does not point to a listing. Open a car from the search results instead.",
    actions: [el("a", { class: "btn btn--dark", href: "/search-result" }, "Browse all cars")],
  });
} else {
  try {
    render(await api(`/api/cars/${id}`));
  } catch (err) {
    if (err.status === 404) {
      showState({
        title: "This listing is no longer available",
        text: "The car may have been sold or removed by an admin.",
        actions: [el("a", { class: "btn btn--dark", href: "/search-result" }, "Browse all cars")],
      });
    } else {
      showState({
        title: "This listing could not load",
        text: err.message,
        tone: "error",
        actions: [el("button", { class: "btn btn--dark", type: "button", onclick: () => location.reload() }, "Try again")],
      });
    }
  }
}
