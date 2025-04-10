// Car data
const carData = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8474d84d3770d9f25e108081f8be87d998da340c?placeholderIfAbsent=true",
      title: "2024 BMW 330Li 2.0 G28 M Sport Sedan - AT",
      price: "2,190,000 THB",
      mileage: "31,872 KM"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/9975ea9b5bc7440307fc468df75380af13a8d476?placeholderIfAbsent=true",
      title: "2025 Mercedes-Benz CLS53 3.0 W257 (ปี 18-24) AMG 4MATIC+ 4WD Sedan",
      price: "4,590,000 THB",
      mileage: "2,140 KM"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/c8ced450e175d09839887ecec44f7dc93d0f124e?placeholderIfAbsent=true",
      title: "2024 Honda Accord 2.0 (ปี 23-29) e:HEV RS Sedan",
      price: "1,499,000 THB",
      mileage: "31,872 KM"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/6f0e9de0739423708bdbe42963950899d55394db?placeholderIfAbsent=true",
      title: "2024 BMW 520d 2.0 G30 (��ี 17-22) M Sport Sedan",
      price: "2,190,000 THB",
      mileage: "31,872 KM"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/37b28dbdc7a6f902f2ea5a0784444329d50c74d6?placeholderIfAbsent=true",
      title: "2024 Mercedes-Benz CLE53 3.0 W236 (ปี 24-31) AMG 4MATIC+ 4WD Coupe",
      price: "4,690,000 THB",
      mileage: "0 KM"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/94d54d119c753a0cba2a46e442e2a845de48a14b?placeholderIfAbsent=true",
      title: "2023 Honda Civic 2.0 FL5 (ปี 23-28) Type R Hatchback",
      price: "3,650,000 THB",
      mileage: "0 KM"
    }
  ];
  
  // Function to create a car card
  function createCarCard(car) {
    return `
      <article class="car-card">
        <div class="car-card-content">
          <img
            src="${car.image}"
            alt="${car.title}"
            class="car-image"
          />
          <h3 class="car-title">${car.title}</h3>
          <p class="car-price">${car.price}</p>
          <p class="car-mileage">${car.mileage}</p>
        </div>
        <div class="car-actions">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a136039a3f1e73af0706c817280168356ca97e3a?placeholderIfAbsent=true"
            alt="Action 1"
            class="action-button"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/98cdcd364e609ace6b4a4aff6b23b28321310c33?placeholderIfAbsent=true"
            alt="Action 2"
            class="action-button"
          />
        </div>
      </article>
    `;
  }
  
  // Populate car grid when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    const carGridElement = document.getElementById('carGrid');
    
    if (carGridElement) {
      const carCardsHTML = carData.map(car => createCarCard(car)).join('');
      carGridElement.innerHTML = carCardsHTML;
    }
  
    // Add event listeners to form elements
    const brandSelect = document.getElementById('brand');
    const modelSelect = document.getElementById('model');
    const sellerTypeSelect = document.getElementById('sellerType');
    
    // Event listeners for the selects (could be expanded for filtering functionality)
    if (brandSelect) {
      brandSelect.addEventListener('change', function() {
        console.log('Brand selected:', this.value);
      });
    }
    
    if (modelSelect) {
      modelSelect.addEventListener('change', function() {
        console.log('Model selected:', this.value);
      });
    }
    
    if (sellerTypeSelect) {
      sellerTypeSelect.addEventListener('change', function() {
        console.log('Seller type selected:', this.value);
      });
    }
  });
  