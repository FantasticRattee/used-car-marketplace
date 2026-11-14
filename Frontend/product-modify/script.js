import {
  initPage,
  ensureAdmin,
  handleAuthError,
  api,
  el,
  icon,
  toast,
  flash,
  carTitle,
  stateBlock,
} from "/shared/app.js";
import { createListingForm } from "/shared/listing-form.js";

initPage();

const pickerBox = document.getElementById("picker");
const picker = document.getElementById("car-picker");
const form = document.getElementById("listing-form");
const emptyState = document.getElementById("empty-state");
const saveButton = document.getElementById("save");
const deleteButton = document.getElementById("delete");
const viewLink = document.getElementById("view-listing");
const dialog = document.getElementById("delete-dialog");
const dialogTitle = document.getElementById("delete-title");

const optionLabel = (car) => `${carTitle(car)}${car.model ? ` (${car.model})` : ""}, #${car.id}`;

let listing;
let currentCar = null;

function showEmpty(options) {
  form.hidden = true;
  emptyState.replaceChildren(stateBlock(options));
}

async function loadCar(id) {
  currentCar = null;
  if (!id) {
    history.replaceState(null, "", "/product-modify");
    showEmpty({ title: "Choose a listing to edit", text: "Use the list above. The form fills in with the listing's current details." });
    return;
  }
  history.replaceState(null, "", `/product-modify?id=${encodeURIComponent(id)}`);
  listing.setDisabled(true);
  try {
    const car = await api(`/api/cars/${encodeURIComponent(id)}`);
    currentCar = car;
    listing.fill(car);
    listing.setDisabled(false);
    viewLink.href = `/detail?id=${encodeURIComponent(car.id)}`;
    dialogTitle.textContent = `Delete ${carTitle(car)}?`;
    emptyState.replaceChildren();
    form.hidden = false;
  } catch (err) {
    if (err.status === 404) {
      picker.value = "";
      showEmpty({ title: "That listing no longer exists", text: "It may have been deleted. Choose another listing above." });
    } else {
      showEmpty({ title: "The listing could not load", text: err.message, tone: "error" });
    }
  }
}

if (await ensureAdmin()) {
  listing = createListingForm(form);
  pickerBox.hidden = false;

  try {
    const cars = await api("/api/cars?sort=newest");
    picker.append(...cars.map((car) => el("option", { value: car.id, text: optionLabel(car) })));
    if (!cars.length) {
      showEmpty({
        title: "There are no listings yet",
        text: "Add the first car and it will show up here.",
        actions: [el("a", { class: "btn btn--primary", href: "/product-add" }, icon("plus"), "Add a listing")],
      });
    }
  } catch (err) {
    showEmpty({ title: "Listings could not load", text: err.message, tone: "error" });
  }

  const requested = new URLSearchParams(location.search).get("id") ?? "";
  if (/^\d{1,10}$/.test(requested)) {
    picker.value = requested;
    await loadCar(requested);
  } else if (picker.options.length > 1) {
    await loadCar("");
  }

  picker.addEventListener("change", () => loadCar(picker.value));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentCar) return;
    if (!listing.check()) {
      toast("Some fields need attention. They are marked in red.", { type: "error" });
      return;
    }
    saveButton.disabled = true;
    saveButton.textContent = "Saving…";
    try {
      const { car } = await api(`/api/cars/${currentCar.id}`, { method: "PUT", body: listing.payload(), auth: true });
      currentCar = car;
      listing.fill(car);
      const option = [...picker.options].find((o) => o.value === String(car.id));
      if (option) option.textContent = optionLabel(car);
      dialogTitle.textContent = `Delete ${carTitle(car)}?`;
      toast("Changes saved.");
    } catch (err) {
      if (!handleAuthError(err)) {
        if (err.field) listing.showError(err.field, err.message);
        toast(err.message, { type: "error" });
      }
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = "Save changes";
    }
  });

  deleteButton.addEventListener("click", () => {
    if (!currentCar) return;
    dialog.returnValue = ""; // Escape must never reuse an earlier "confirm".
    dialog.showModal();
  });

  dialog.addEventListener("close", async () => {
    if (dialog.returnValue !== "confirm" || !currentCar) return;
    deleteButton.disabled = true;
    try {
      await api(`/api/cars/${currentCar.id}`, { method: "DELETE", auth: true });
      flash(`Deleted ${carTitle(currentCar)}.`);
      location.href = "/product-modify";
    } catch (err) {
      if (!handleAuthError(err)) toast(err.message, { type: "error" });
      deleteButton.disabled = false;
    }
  });
}
