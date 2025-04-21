//searchpage/script.js

document.addEventListener('DOMContentLoaded', function () {
  const brands = [
    { name: "Audi", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/de855507fc4a625b8daa690e08f7aeca8bfbb03d" },
    { name: "BMW", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/e8ad0641098bbea9d3f78cc96b7f8f1359fd12ce" },
    { name: "Porsche", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/7e1f9cf389e036a833487650fc3e0020fe451b96" },
    { name: "Mercedes Benz", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/117f27dd1639365d5b2d7b99a4309366c7b9a807" },
    { name: "Toyota", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/beac503c5660eb442aa656eca3405498eef6d3e4" },
    { name: "Honda", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/48a02aa3fb6fced44d88452000933f29987048ec" }
  ];

  // Show brand cards (still hardcoded)
  const brandGrid = document.getElementById('brandGrid');
  brands.forEach(brand => {
    const card = document.createElement('div');
    card.className = 'brand-card';
    card.innerHTML = `
      <img src="${brand.imageUrl}" alt="${brand.name}" />
      <div class="brand-name">${brand.name}</div>
    `;
    brandGrid.appendChild(card);
  });

  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');

  // ✅ Populate brand dropdown from DB (doesn't affect card grid)
  fetch('/api/brands')
    .then(res => res.json())
    .then(data => {
      data.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand.name;
        option.textContent = brand.name;
        brandSelect.appendChild(option);
      });
    })
    .catch(err => console.error("❌ Failed to fetch brand list:", err));

  brandSelect.addEventListener('change', async () => {
    const selectedBrand = brandSelect.value.trim().split(" ")[0];

    if (!selectedBrand) {
      modelSelect.innerHTML = `<option value="">Select Model</option>`;
      return;
    }

    try {
      const response = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}`);
      const models = await response.json();

      modelSelect.innerHTML = `<option value="">Select Model</option>` +
        models.map(model => `<option value="${model}">${model}</option>`).join('');
    } catch (error) {
      console.error("Failed to fetch models:", error);
      modelSelect.innerHTML = `<option value="">Select Model</option>`;
    }
  });

  document.getElementById('search-form').addEventListener('submit', function () {
    const keyword = document.getElementById("searchKeyword").value;
    const brand = brandSelect.value;
    const model = modelSelect.value;
    const sellerType = document.getElementById("sellerType").value;

    const query = new URLSearchParams({
      keyword,
      brand,
      model,
      sellerType,
    });

    window.location.href = `/search-result?${query.toString()}`;
  });

  document.getElementById('searchKeyword').addEventListener('input', function () {
    console.log("Searching:", this.value.toLowerCase());
  });
});