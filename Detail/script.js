//Detail/script.js

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const carId = parseInt(params.get("id"));

  if (!carId) {
    document.body.innerHTML = "<h1 style='color:white;'>Car not found.</h1>";
    return;
  }

  try {
    const res = await fetch("/api/cars");
    const cars = await res.json();
    const car = cars.find(c => c.id === carId);

    if (!car) {
      document.body.innerHTML = "<h1 style='color:white;'>Car not found.</h1>";
      return;
    }

    // Main title & price
    document.querySelector(".car-title").textContent = car.name + " " + car.model;
    document.querySelector(".price-tag").textContent =
  `${Number(car.price.toString().replace(/[^0-9]/g, "")).toLocaleString()} THB`;

    const descEl = document.querySelector(".car-details");
    if (descEl) {
      descEl.textContent = car.description || "No details available.";
    }

    // Main image
    const mainImage = document.querySelector(".main-image");
    if (mainImage && car.image_1) mainImage.src = car.image_1;

    // Side images
    const sideImages = document.querySelectorAll(".side-image");
    if (sideImages.length >= 2) {
      if (car.image_2) sideImages[0].src = car.image_2;
      if (car.image_3) sideImages[1].src = car.image_3;
    }

    // ✅ Make side images clickable and swap with main
    sideImages.forEach((sideImg) => {
      sideImg.addEventListener("click", () => {
        const tempSrc = mainImage.src;
        mainImage.src = sideImg.src;
        sideImg.src = tempSrc;
      });
    });

  } catch (err) {
    console.error("❌ Failed to load detail:", err);
    document.body.innerHTML = "<h1 style='color:white;'>Error loading car details.</h1>";
  }
});
