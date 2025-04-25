document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const carId = parseInt(params.get("id"));

  if (!carId) {
    document.body.innerHTML = "<h1 style='color:white;'>Car not found.</h1>";
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/api/cars");
    const cars = await res.json();
    const car = cars.find(c => c.id === carId);

    if (!car) {
      document.body.innerHTML = "<h1 style='color:white;'>Car not found.</h1>";
      return;
    }

    // ✅ Main title & price
    document.querySelector(".car-title").textContent = `${car.name} ${car.model}`;
    document.querySelector(".price-tag").textContent =
      `Price : ${Number(car.price.toString().replace(/[^0-9]/g, "")).toLocaleString()} THB`;

    // ✅ Description
    const descEl = document.querySelector(".car-details");
    if (descEl) {
      descEl.textContent = car.description || "No details available.";
    }

    // ✅ Main image
    const mainImage = document.querySelector(".main-image");
    if (mainImage && car.image_1) mainImage.src = car.image_1;

    // ✅ Side images
    const sideImages = document.querySelectorAll(".side-image");
    if (sideImages.length >= 2) {
      if (car.image_2) sideImages[0].src = car.image_2;
      if (car.image_3) sideImages[1].src = car.image_3;
    }

    // ✅ Swap side and main images on click
    sideImages.forEach((sideImg) => {
      sideImg.addEventListener("click", () => {
        const tempSrc = mainImage.src;
        mainImage.src = sideImg.src;
        sideImg.src = tempSrc;
      });
    });

    // ✅ Phone number
    const phoneDiv = document.querySelector("#phoneNumber");
    if (phoneDiv) {
      const raw = (car.phone_number || "").toString().replace(/\D/g, "");
      if (raw.length === 10) {
        const formatted = `Phone number : ${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`;
        phoneDiv.textContent = formatted;
      } else {
        phoneDiv.textContent = "Phone number : Not available";
      }
    }

    // ✅ Handle Edit button visibility and logic
    const editLink = document.querySelector(".edit-car-link");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");

    if (editLink) {
      if (isLoggedIn && role === "superadmin") {
        editLink.style.display = "inline-block";
        editLink.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.setItem("modifyCarId", car.id);
          window.location.href = "/product-modify";
        });
      } else {
        editLink.style.display = "none";
      }
    }

  } catch (err) {
    console.error("❌ Failed to load detail:", err);
    document.body.innerHTML = "<h1 style='color:white;'>Error loading car details.</h1>";
  }
});