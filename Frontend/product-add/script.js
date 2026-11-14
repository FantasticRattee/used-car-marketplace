import { initPage, ensureAdmin, handleAuthError, api, toast, flash } from "/shared/app.js";
import { createListingForm } from "/shared/listing-form.js";

initPage();

const form = document.getElementById("listing-form");
const publish = document.getElementById("publish");

if (await ensureAdmin()) {
  const listing = createListingForm(form);
  form.hidden = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!listing.check()) {
      toast("Some fields need attention. They are marked in red.", { type: "error" });
      return;
    }

    publish.disabled = true;
    publish.textContent = "Publishing…";
    try {
      const result = await api("/api/cars", { method: "POST", body: listing.payload(), auth: true });
      flash("Listing published.");
      location.href = `/detail?id=${encodeURIComponent(result.id)}`;
    } catch (err) {
      if (handleAuthError(err)) return;
      if (err.field) listing.showError(err.field, err.message);
      toast(err.message, { type: "error" });
      publish.disabled = false;
      publish.textContent = "Publish listing";
    }
  });
}
