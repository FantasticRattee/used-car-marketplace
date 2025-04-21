//seachpage-result/script.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("car-container");
  container.innerHTML = "";

  const { keyword, brand, model, sellerType } = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );

  fetch("/api/cars")
    .then((res) => res.json())
    .then((cars) => {
      const filtered = cars.filter((car) => {
        const name = (car.name || "").toLowerCase();
        const modelName = (car.model || "").toLowerCase();
        const brandName = (car.brand || "").toLowerCase();
        const type = (car.type || "").toLowerCase();
        const description = (car.description || "").toLowerCase();

        const keywordLower = (keyword || "").toLowerCase();
        const modelFilter = (model || "").toLowerCase();
        const brandFilter = (brand || "").toLowerCase();
        const sellerFilter = (sellerType || "").toLowerCase();

        const matchKeyword =
          !keywordLower ||
          name.includes(keywordLower) ||
          modelName.includes(keywordLower) ||
          description.includes(keywordLower);

        const matchBrand =
          !brandFilter ||
          brandName === brandFilter ||
          name.includes(brandFilter); // ✅ Loosen brand match

        const matchModel = !modelFilter || modelName === modelFilter;
        const matchSeller = !sellerFilter || type === sellerFilter;

        return matchKeyword && matchBrand && matchModel && matchSeller;
      });

      if (filtered.length === 0) {
        container.textContent = "No results found.";
        container.style.color = "white";
        return;
      }

      filtered.forEach((car) => {
        const card = document.createElement("article");
        card.className = "car-card";
        card.style.cursor = "pointer";
        card.innerHTML = `
          <div class="car-image-container">
            <img src="${car.image || car.image_1}" class="car-image" alt="${car.name} ${car.model}">
            <div class="car-badge ${car.type.toLowerCase() === "dealer" ? "dealer-badge" : "home-badge"}">${car.type.toUpperCase()} CAR</div>
          </div>
          <div class="car-details">
            <h2 class="car-name">${car.name}</h2>
            <p class="car-model">${car.model}</p>
            <div class="car-specs">
              <div class="spec-item"><i class="ti ti-gauge"></i><span>${car.mileage}</span></div>
              <div class="spec-item"><i class="ti ti-gas-station"></i><span>${car.fuelType}</span></div>
              <div class="spec-item"><i class="ti ti-manual-gearbox"></i><span>${car.transmission}</span></div>
              <div class="spec-item"><i class="ti ti-calendar"></i><span>${car.year}</span></div>
            </div>
            <div class="car-price">${Number(car.price.toString().replace(/[^0-9]/g, "")).toLocaleString()} THB</div>
            <div class="car-buttons">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd483acca22299aabf69e45840220e3701aa2d84" class="contact-button" alt="Call">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e3d82424d065c20ac0dd2144591b9f0fb80c7b0b" class="contact-button" alt="Line">
            </div>
          </div>
        `;
        card.addEventListener("click", () => {
          window.location.href = `/detail?id=${car.id}`;
        });
        container.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("❌ Error fetching cars:", err);
      container.textContent = "Error loading cars.";
    });
});