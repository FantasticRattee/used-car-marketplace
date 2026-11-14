import { initPage, initSearchForm, loadBrands, el, brandTile, skeletons, stateBlock } from "/shared/app.js";

initPage();

const brandGrid = document.getElementById("brand-grid");
brandGrid.append(...skeletons(6, "skeleton--tile"));

initSearchForm(document.getElementById("search-form"));

try {
  const brands = await loadBrands();
  brandGrid.replaceChildren(...brands.map((brand) => el("li", {}, brandTile(brand))));
  if (!brands.length) {
    brandGrid.replaceWith(stateBlock({ title: "No brands yet", text: "Brands appear here once cars are listed." }));
  }
} catch (err) {
  brandGrid.replaceWith(stateBlock({ title: "Brands could not load", text: err.message, tone: "error" }));
} finally {
  brandGrid.removeAttribute("aria-busy");
}
