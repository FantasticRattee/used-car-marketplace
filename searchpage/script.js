
document.addEventListener('DOMContentLoaded', function () {
  const brands = [
    { name: "Audi", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/de855507fc4a625b8daa690e08f7aeca8bfbb03d" },
    { name: "BMW", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/e8ad0641098bbea9d3f78cc96b7f8f1359fd12ce" },
    { name: "Porsche", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/7e1f9cf389e036a833487650fc3e0020fe451b96" },
    { name: "Mercedes Benz", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/117f27dd1639365d5b2d7b99a4309366c7b9a807" },
    { name: "Toyota", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/beac503c5660eb442aa656eca3405498eef6d3e4" },
    { name: "Honda", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/48a02aa3fb6fced44d88452000933f29987048ec" }
  ];

  const brandModels = {
    "Audi": ["A4", "A6", "Q5"],
    "BMW": ["330", "520", "X5"],
    "Porche": ["911", "Cayenne", "Macan", "Panamera"],
    "Mercedes Benz": ["C-Class", "GLE", "CLS"],
    "Toyota": ["Yaris", "Altis", "Fortuner"],
    "Honda": ["Civic", "Accord", "City"]
  };

  // Show brand cards
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

  // Handle dynamic model updates
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');

  brandSelect.addEventListener('change', () => {
    const selectedBrand = brandSelect.value;
    const models = brandModels[selectedBrand] || [];
    modelSelect.innerHTML = `<option value="">Select Model</option>` + models.map(m => `<option value="${m}">${m}</option>`).join('');
  });

  const searchForm = document.getElementById('search-form');
  // Optional: prevent form from reloading
  searchForm.addEventListener('submit', function (event) {
    // Build query string from form values
    const keyword = document.getElementById("searchKeyword").value;
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
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
    const keyword = this.value.toLowerCase();
    console.log("Searching:", keyword);
    // You can now filter carData based on title, rating, etc.
  });

});