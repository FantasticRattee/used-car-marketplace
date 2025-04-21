//searchpage/script.js


document.addEventListener('DOMContentLoaded', function () {
  const brandGrid = document.getElementById('brandGrid');
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const searchInput = document.getElementById('searchKeyword');
  const sellerTypeSelect = document.getElementById('sellerType');

  // ✅ Static brand cards
  const staticBrands = [
    { name: "Audi", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/de855507fc4a625b8daa690e08f7aeca8bfbb03d" },
    { name: "BMW", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/e8ad0641098bbea9d3f78cc96b7f8f1359fd12ce" },
    { name: "Porsche", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/7e1f9cf389e036a833487650fc3e0020fe451b96" },
    { name: "Mercedes Benz", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/117f27dd1639365d5b2d7b99a4309366c7b9a807" },
    { name: "Toyota", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/beac503c5660eb442aa656eca3405498eef6d3e4" },
    { name: "Honda", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/48a02aa3fb6fced44d88452000933f29987048ec" }
  ];

  staticBrands.forEach(brand => {
    const card = document.createElement('div');
    card.className = 'brand-card';
    card.innerHTML = `
      <img src="${brand.imageUrl}" alt="${brand.name}" />
      <div class="brand-name">${brand.name}</div>
    `;
    brandGrid.appendChild(card);
  });

  // ✅ Dynamic Brand Dropdown from DB
  fetch('/api/brands')
    .then(res => res.json())
    .then(data => {
      data.forEach(b => {
        const option = document.createElement("option");
        option.value = b.name;
        option.textContent = b.name;
        brandSelect.appendChild(option);
      });
    })
    .catch(err => console.error("❌ Failed to fetch brand list:", err));

  // ✅ Auto-fill model dropdown on brand change
  brandSelect.addEventListener('change', async () => {
    const selectedBrand = brandSelect.value.trim().split(" ")[0];
    modelSelect.innerHTML = `<option value="">Select Model</option>`;

    if (!selectedBrand) return;

    try {
      const res = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}`);
      const models = await res.json();
      models.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        modelSelect.appendChild(opt);
      });
    } catch (err) {
      console.error("❌ Model fetch failed:", err);
    }
  });

  // ✅ Submit search form with cleaned-up params
  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const keyword = searchInput.value.trim();
    const brand = brandSelect.value;
    const model = modelSelect.value;
    const sellerType = sellerTypeSelect.value;

    const query = new URLSearchParams();
    if (keyword) query.set("keyword", keyword);
    if (brand) query.set("brand", brand);
    if (model) query.set("model", model);
    if (sellerType) query.set("sellerType", sellerType);

    window.location.href = `/search-result?${query.toString()}`;
  });

  // ✅ Log typing for debug
  searchInput.addEventListener('input', function () {
    console.log("Searching:", this.value.toLowerCase());
  });
});