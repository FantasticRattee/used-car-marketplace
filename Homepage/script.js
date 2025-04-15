// ✅ Car models for dropdown population
const carModels = {
  bmw: ["330", "520"],
  mercedes: ["CLS53", "CLE53"],
  honda: ["Accord", "Civic"],
  toyota: ["Supra", "GR Corolla"],
  audi: ["A3", "Q5"],
  porsche: ["911", "Cayenne", "Panamera"],
};

// ✅ Car data to display in Explore Our Cars
const carData = [
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8474d84d3770d9f25e108081f8be87d998da340c?placeholderIfAbsent=true",
    title: "2024 BMW 330Li 2.0 G28 M Sport Sedan - AT",
    price: "2,190,000 THB",
    mileage: "31,872 KM",
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/9975ea9b5bc7440307fc468df75380af13a8d476?placeholderIfAbsent=true",
    title: "2025 Mercedes-Benz CLS53 3.0 W257 AMG 4MATIC+",
    price: "4,590,000 THB",
    mileage: "2,140 KM",
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/c8ced450e175d09839887ecec44f7dc93d0f124e?placeholderIfAbsent=true",
    title: "2024 Honda Accord 2.0 e:HEV RS Sedan",
    price: "1,499,000 THB",
    mileage: "31,872 KM",
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/6f0e9de0739423708bdbe42963950899d55394db?placeholderIfAbsent=true",
    title: "2024 BMW 520d 2.0 G30 M Sport Sedan",
    price: "2,190,000 THB",
    mileage: "31,872 KM",
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/37b28dbdc7a6f902f2ea5a0784444329d50c74d6?placeholderIfAbsent=true",
    title: "2024 Mercedes-Benz CLE53 AMG 4MATIC+ Coupe",
    price: "4,690,000 THB",
    mileage: "0 KM",
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/94d54d119c753a0cba2a46e442e2a845de48a14b?placeholderIfAbsent=true",
    title: "2023 Honda Civic 2.0 FL5 Type R Hatchback",
    price: "3,650,000 THB",
    mileage: "0 KM",
  },
];

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
  // ✅ Render all cars in Explore section
  const carGrid = document.getElementById("carGrid");
  if (carGrid) {
    carGrid.innerHTML = carData.map(createCarCard).join("");
  }

  // ✅ Populate model dropdown based on brand
  const brandSelect = document.getElementById("brand");
  const modelSelect = document.getElementById("model");

  if (brandSelect && modelSelect) {
    brandSelect.addEventListener("change", () => {
      const selectedBrand = brandSelect.value.toLowerCase();
      const models = carModels[selectedBrand] || [];
      modelSelect.innerHTML = `<option value="">Select Model</option>`;
      models.forEach((model) => {
        const opt = document.createElement("option");
        opt.value = model.toLowerCase();
        opt.textContent = model;
        modelSelect.appendChild(opt);
      });
    });
  }

  // ✅ Redirect search form to result page
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault(); // ✅ Fix: prevent default form behavior
      const brand = brandSelect?.value || "";
      const model = modelSelect?.value || "";
      const sellerType = document.getElementById("sellerType")?.value || "";

      const query = new URLSearchParams({ brand, model, sellerType });
      window.location.href = `/searchpage-result?${query.toString()}`;
    });
  }
});