import {
  initPage,
  initSearchForm,
  currentSearchValues,
  searchUrl,
  rememberSearch,
  api,
  el,
  icon,
  carCard,
  plural,
  skeletons,
  stateBlock,
  sellerTypeLabel,
} from "/shared/app.js";

initPage();

const values = currentSearchValues();
const title = document.getElementById("results-title");
const count = document.getElementById("results-count");
const activeFilters = document.getElementById("active-filters");
const results = document.getElementById("results");
const grid = document.getElementById("results-grid");

grid.append(...skeletons(6, "skeleton--card"));
rememberSearch();
initSearchForm(document.getElementById("filter-form"), { values, autoApply: true });

const heading = values.brand ? `${values.model ? `${values.brand} ${values.model}` : values.brand} for sale` : "Used cars for sale";
title.textContent = heading;
document.title = `${heading} | ONE2CAR`;

// Chips for each active filter; each one links to the same search without it.
const FILTER_LABELS = {
  keyword: (v) => `"${v}"`,
  brand: (v) => v,
  model: (v) => v,
  sellerType: (v) => sellerTypeLabel(v),
};
const active = Object.keys(FILTER_LABELS).filter((key) => values[key]);
if (active.length) {
  const list = el(
    "ul",
    { class: "chips", "aria-label": "Active filters" },
    active.map((key) => {
      const without = { ...values, [key]: "" };
      if (key === "brand") without.model = "";
      return el(
        "li",
        {},
        el(
          "a",
          { class: "chip", href: searchUrl(without), "aria-label": `Remove filter ${FILTER_LABELS[key](values[key])}` },
          FILTER_LABELS[key](values[key]),
          icon("close")
        )
      );
    })
  );
  activeFilters.append(list, el("a", { class: "section__link", href: searchUrl({ sort: values.sort }), text: "Clear all" }));
}

const params = new URLSearchParams();
if (values.keyword) params.set("q", values.keyword);
if (values.brand) params.set("brand", values.brand);
if (values.model) params.set("model", values.model);
if (values.sellerType) params.set("type", values.sellerType);
if (values.sort) params.set("sort", values.sort);

try {
  const cars = await api(`/api/cars${params.toString() ? `?${params}` : ""}`);
  count.textContent = active.length ? `${plural(cars.length, "car")} match` : `${plural(cars.length, "car")} for sale`;
  if (cars.length) {
    grid.replaceChildren(...cars.map((car) => el("li", {}, carCard(car, { headingLevel: "h2" }))));
  } else {
    results.replaceChildren(
      stateBlock({
        title: "No cars match these filters",
        text: "Remove a filter or try a shorter keyword. Brand and model must match exactly; keywords match any part of the name, model or description.",
        actions: [
          el("a", { class: "btn btn--dark", href: searchUrl({}) }, "Show all cars"),
          el("a", { class: "btn btn--secondary", href: "/search" }, "Change search"),
        ],
      })
    );
  }
} catch (err) {
  count.textContent = "Listings could not load";
  results.replaceChildren(
    stateBlock({
      title: "Listings could not load",
      text: err.message,
      tone: "error",
      actions: [el("button", { class: "btn btn--dark", type: "button", onclick: () => location.reload() }, "Try again")],
    })
  );
} finally {
  results.removeAttribute("aria-busy");
}
