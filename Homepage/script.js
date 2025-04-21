// ✅ Render static cars for Explore section
function createCarCard(car) {
  return `
    <article class="car-card">
      <div class="car-card-content">
        <img src="${car.image}" alt="${car.title}" class="car-image" />
        <h3 class="car-title">${car.title}</h3>
        <p class="car-price">${car.price}</p>
        <p class="car-mileage">${car.mileage}</p>
      </div>
      <div class="car-actions">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a136039a3f1e73af0706c817280168356ca97e3a?placeholderIfAbsent=true" alt="Call" class="action-button" />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/98cdcd364e609ace6b4a4aff6b23b28321310c33?placeholderIfAbsent=true" alt="Line" class="action-button" />
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Re-check login timeout
  const loginTime = parseInt(localStorage.getItem("loginTime"), 10);
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 mins
  const expired = isNaN(loginTime) || now - loginTime > timeout;

  if (expired) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("loginTime");
  }

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  // ✅ Control Edit Car button
  const editBtn = document.getElementById("editBtn");
  if (editBtn) {
    if (isLoggedIn && role === "superadmin") {
      editBtn.addEventListener("click", () => {
        window.location.href = "/product-add";
      });
    } else {
      editBtn.style.opacity = 0.5;
      editBtn.style.pointerEvents = "auto";
      editBtn.title = "Only superadmin can access this feature";
      editBtn.addEventListener("click", () => {
        alert("⚠️ Please login as superadmin to access this feature.");
      });
    }
  }

  // ✅ Load car cards
  const carGrid = document.getElementById("carGrid");
  if (carGrid) {
    fetch("/api/cars")
      .then(res => res.json())
      .then(data => {
        const cards = data.map(car => createCarCard({
          image: car.image || car.image_1,
          title: `${car.year} ${car.name} ${car.model}`,
          price: `${car.price} THB`,
          mileage: `${car.mileage} KM`
        })).join("");
        carGrid.innerHTML = cards;
      })
      .catch(err => console.error("❌ Failed to fetch car grid:", err));
  }

  // ✅ Handle brand dropdown
  const brandSelect = document.getElementById("brand");
  const modelSelect = document.getElementById("model");

  if (brandSelect && modelSelect) {
    brandSelect.addEventListener("change", async () => {
      const selectedBrand = brandSelect.value;
      if (!selectedBrand) {
        modelSelect.innerHTML = `<option value="">Select Model</option>`;
        return;
      }

      try {
        const response = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}`);
        const models = await response.json();
        modelSelect.innerHTML = `<option value="">Select Model</option>` +
          models.map(model => `<option value="${model}">${model}</option>`).join("");
      } catch (error) {
        console.error("Failed to fetch models:", error);
        modelSelect.innerHTML = `<option value="">Select Model</option>`;
      }
    });
  }

  // ✅ Redirect search form
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const brand = brandSelect?.value || "";
      const model = modelSelect?.value || "";
      const sellerType = document.getElementById("sellerType")?.value || "";
      const query = new URLSearchParams({ brand, model, sellerType });
      window.location.href = `/searchpage-result?${query.toString()}`;
    });
  }
});