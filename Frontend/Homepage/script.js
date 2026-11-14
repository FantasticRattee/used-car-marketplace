import {
  initPage,
  initSearchForm,
  api,
  loadBrands,
  el,
  carCard,
  brandTile,
  carImage,
  carTitle,
  pricePlate,
  plural,
  skeletons,
  stateBlock,
} from "/shared/app.js";

initPage();

const featured = document.getElementById("featured");
const brandGrid = document.getElementById("brand-grid");
const latest = document.getElementById("latest");
const latestGrid = document.getElementById("latest-grid");
const seeAll = document.getElementById("see-all");
const lede = document.getElementById("hero-lede");

brandGrid.append(...skeletons(6, "skeleton--tile"));
latestGrid.append(...skeletons(6, "skeleton--card"));

initSearchForm(document.getElementById("hero-search"), { values: { keyword: "", brand: "", model: "", sellerType: "", sort: "" } });

function renderFeatured(car) {
  const title = carTitle(car);
  const link = el(
    "a",
    { class: "featured", href: `/detail?id=${encodeURIComponent(car.id)}` },
    el("div", { class: "featured__media" }, carImage(car.image_1, `${title}${car.model ? `, ${car.model}` : ""}`, { loading: "eager", fetchpriority: "high" })),
    el(
      "div",
      { class: "featured__caption" },
      el("div", {}, el("p", { class: "featured__label", text: "Newest listing" }), el("p", { class: "featured__title", text: title })),
      pricePlate(car.price)
    )
  );
  featured.replaceWith(link);
}

try {
  const [cars, brands] = await Promise.all([api("/api/cars"), loadBrands()]);

  if (cars.length) {
    renderFeatured(cars[0]);
    lede.textContent = `${plural(cars.length, "used car")} from dealers and private sellers. Compare price, mileage and specs, then call the seller directly.`;
  } else {
    featured.remove();
  }

  brandGrid.replaceChildren(...brands.map((brand) => el("li", {}, brandTile(brand))));
  brandGrid.removeAttribute("aria-busy");

  seeAll.textContent = `See all ${plural(cars.length, "car")}`;
  if (cars.length) {
    // The newest car is already featured in the hero, so the grid starts with the next six.
    const rest = cars.length > 1 ? cars.slice(1, 7) : cars;
    latestGrid.replaceChildren(...rest.map((car) => el("li", {}, carCard(car))));
  } else {
    latest.replaceChildren(
      stateBlock({ title: "No cars listed yet", text: "Listings added by an admin appear here first." })
    );
  }
  latest.removeAttribute("aria-busy");
} catch (err) {
  featured.remove();
  brandGrid.replaceChildren();
  brandGrid.removeAttribute("aria-busy");
  latest.removeAttribute("aria-busy");
  latest.replaceChildren(
    stateBlock({
      title: "Listings could not load",
      text: err.message,
      tone: "error",
      actions: [el("button", { class: "btn btn--dark", type: "button", onclick: () => location.reload() }, "Try again")],
    })
  );
}
