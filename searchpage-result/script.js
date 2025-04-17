// ✅ Add: Car data
const carData = [
  {
    id: 1, // ✅ Add ID
    image: "https://i.imgur.com/orGOeL3.jpeg",
    type: "dealer",
    name: "BMW 330 LI",
    model: "M Sport G28",
    specs: {
      mileage: "31,872 KM",
      fuelType: "Petrol",
      transmission: "Automatic",
      year: "2024",
    },
    price: "2,190,000 THB",
  },

  {
    id: 2, // ✅ Add: 520d
    image: "https://i.imgur.com/YNURdBb.jpeg",
    type: "private",
    name: "BMW 520d 2.0 G30",
    model: "M Sport LCI",
    specs: {
      mileage: "35,000 - 40,000 KM",
      fuelType: "Diesel",
      transmission: "Automatic",
      year: "2024",
    },
    price: "2,390,000 THB",
  },

  {
    id: 3, // ✅ Add: M5 G90
    image: "https://i.imgur.com/1UxfcAo.jpeg",
    type: "dealer",
    name: "BMW M5 G90",
    model: "4.4 V8 TwinPower Turbo xDrive",
    specs: {
      mileage: "1,200 KM",
      fuelType: "Petrol Hybrid",
      transmission: "8-Speed Automatic",
      year: "2024",
    },
    price: "9,900,000 THB",
  },

  {
    id: 4,
    image: "https://i.imgur.com/L6ts6Of.jpeg",
    type: "private",
    name: "Audi Q5",
    model: "Quattro Sport",
    specs: {
      mileage: "12,000 KM",
      fuelType: "Petrol",
      transmission: "Automatic",
      year: "2023",
    },
    price: "1,690,000 THB",
  },

  {
    id: 5,
    image: "https://i.imgur.com/C4thvbl.jpeg", 
    type: "dealer",
    name: "Audi RS7 Sportback",
    model: "4.0 TFSI Quattro",
    specs: {
      mileage: "9,000 KM",
      fuelType: "Petrol",
      transmission: "8-Speed Automatic",
      year: "2023",
    },
    price: "9,490,000 THB",
  },

  {
    id: 6,
    image: "https://i.imgur.com/OHNEZZG.jpeg",
    type: "dealer",
    name: "Mercedes Benz CLS 300d",
    model: "AMG Premium",
    specs: {
      mileage: "45,000 KM",
      fuelType: "Diesel",
      transmission: "Automatic",
      year: "2021",
    },
    price: "3,290,000 THB",
  },
  {
    id: 7, // ✅ Add: Type R
    image: "https://i.imgur.com/dmYdit7.jpeg",
    type: "dealer",
    name: "Honda Civic 2.0 FL5 Type R",
    model: "Boost Blue Pearl",
    specs: {
      mileage: "xx,xxx KM",
      fuelType: "Petrol",
      transmission: "6-Speed Manual",
      year: "2023",
    },
    price: "3,650,000 THB",
  },

  {
    id: 8, // ✅ Add: Accord G11
    image: "https://i.imgur.com/MxpbjYZ.jpeg",
    type: "private",
    name: "Honda Accord 2.0 e:HEV RS",
    model: "G11 Hybrid",
    specs: {
      mileage: "5,000 KM",
      fuelType: "Hybrid",
      transmission: "Automatic",
      year: "2024",
    },
    price: "1,499,000 THB",
  },

  {
    id: 9, // ✅ Add: CLE53
    image: "https://i.imgur.com/gdwIkWm.jpeg",
    type: "dealer",
    name: "Mercedes-Benz CLE53 3.0 AMG",
    model: "W236 4MATIC+ Coupe",
    specs: {
      mileage: "4xx KM",
      fuelType: "Petrol",
      transmission: "9G-Tronic AWD",
      year: "2024",
    },
    price: "4,690,000 THB",
  },

  {
    id: 10, // ✅ Add: CLS53
    image: "https://i.imgur.com/m1e2ygs.jpeg",
    type: "private",
    name: "Mercedes-Benz CLS53 3.0",
    model: "W257 AMG 4MATIC+",
    specs: {
      mileage: "2,140 KM",
      fuelType: "Petrol Hybrid",
      transmission: "Automatic",
      year: "2025",
    },
    price: "4,590,000 THB",
  },

  {
    id: 11, // ✅ Add: GR Supra
    image: "https://i.imgur.com/rz9ENp0.jpeg",
    type: "dealer",
    name: "Toyota GR Supra 3.0",
    model: "RZ Coupe",
    specs: {
      mileage: "12,500 KM",
      fuelType: "Petrol",
      transmission: "8-Speed Automatic",
      year: "2023",
    },
    price: "4,290,000 THB",
  },
  
  {
    id: 12, // ✅ Add: GR Corolla
    image: "https://i.imgur.com/TsTvtRi.jpeg",
    type: "private",
    name: "Toyota GR Corolla 1.6 Turbo",
    model: "Circuit Edition",
    specs: {
      mileage: "8,000 KM",
      fuelType: "Petrol",
      transmission: "6-Speed Manual",
      year: "2023",
    },
    price: "3,390,000 THB",
  },

  {
    id: 13, // ✅ Add: Panamera
    image: "https://i.imgur.com/E3vZhUQ.jpeg",
    type: "dealer",
    name: "Porsche Panamera 4 E-Hybrid",
    model: "Executive Sedan",
    specs: {
      mileage: "15,000 KM",
      fuelType: "Hybrid",
      transmission: "8-Speed Automatic",
      year: "2022",
    },
    price: "6,590,000 THB",
  },
  
  {
    id: 14, // ✅ Add: Cayenne
    image: "https://i.imgur.com/clKgWeV.jpeg",
    type: "private",
    name: "Porsche Cayenne Coupe",
    model: "E-Hybrid AWD",
    specs: {
      mileage: "22,000 KM",
      fuelType: "Hybrid",
      transmission: "8-Speed Tiptronic",
      year: "2023",
    },
    price: "7,190,000 THB",
  },
  
  {
    id: 15, // ✅ Add: GT3 RS
    image: "https://i.imgur.com/HnQcRCW.jpeg",
    type: "dealer",
    name: "Porsche 911 GT3 RS",
    model: "992 Generation",
    specs: {
      mileage: "4,800 KM",
      fuelType: "Petrol",
      transmission: "7-Speed PDK",
      year: "2023",
    },
    price: "19,800,000 THB",
  }
];


// ✅ Add: Extract search params
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    keyword: params.get("keyword")?.toLowerCase() || "",
    brand: params.get("brand")?.toLowerCase() || "",
    model: params.get("model")?.toLowerCase() || "",
    sellerType: params.get("sellerType")?.toLowerCase() || "",
  };
}

// ✅ Add: Card generator
function createCarCard(car) {
  const card = document.createElement("article");
  card.className = "car-card";
  card.style.cursor = "pointer";

  card.addEventListener("click", () => {
    window.location.href = `/detail?id=${car.id}`;
  });

  const imageContainer = document.createElement("div");
  imageContainer.className = "car-image-container";

  const image = document.createElement("img");
  image.src = car.image;
  image.className = "car-image";
  image.alt = `${car.name} ${car.model}`;

  const badge = document.createElement("div");
  badge.className = `car-badge ${car.type === "dealer" ? "dealer-badge" : "home-badge"}`;
  badge.textContent = car.type.toUpperCase() + " CAR";

  imageContainer.appendChild(image);
  imageContainer.appendChild(badge);

  const details = document.createElement("div");
  details.className = "car-details";

  const name = document.createElement("h2");
  name.className = "car-name";
  name.textContent = car.name;

  const model = document.createElement("p");
  model.className = "car-model";
  model.textContent = car.model;

  const specs = document.createElement("div");
  specs.className = "car-specs";

  const specItems = [
    { icon: "ti ti-gauge", value: car.specs.mileage },
    { icon: "ti ti-gas-station", value: car.specs.fuelType },
    { icon: "ti ti-manual-gearbox", value: car.specs.transmission },
    { icon: "ti ti-calendar", value: car.specs.year },
  ];

  specItems.forEach((item) => {
    const specItem = document.createElement("div");
    specItem.className = "spec-item";

    const icon = document.createElement("i");
    icon.className = item.icon;

    const value = document.createElement("span");
    value.textContent = item.value;

    specItem.appendChild(icon);
    specItem.appendChild(value);
    specs.appendChild(specItem);
  });

  const price = document.createElement("div");
  price.className = "car-price";
  price.textContent = car.price;

  const buttons = document.createElement("div");
  buttons.className = "car-buttons";

  const callButton = document.createElement("img");
  callButton.src = "https://cdn.builder.io/api/v1/image/assets/TEMP/dd483acca22299aabf69e45840220e3701aa2d84";
  callButton.className = "contact-button";
  callButton.alt = "Call";

  const lineButton = document.createElement("img");
  lineButton.src = "https://cdn.builder.io/api/v1/image/assets/TEMP/e3d82424d065c20ac0dd2144591b9f0fb80c7b0b";
  lineButton.className = "contact-button";
  lineButton.alt = "Line";

  buttons.appendChild(callButton);
  buttons.appendChild(lineButton);

  details.appendChild(name);
  details.appendChild(model);
  details.appendChild(specs);
  details.appendChild(price);
  details.appendChild(buttons);

  card.appendChild(imageContainer);
  card.appendChild(details);

  return card;
}

// ✅ Add: DOM logic
document.addEventListener("DOMContentLoaded", () => {
  const { keyword, brand, model, sellerType } = getQueryParams();
  const container = document.getElementById("car-container");

  const filtered = carData.filter((car) => {
    const carName = car.name.toLowerCase();
    const carModel = car.model.toLowerCase();
    const matchesKeyword = keyword === "" || carName.includes(keyword) || carModel.includes(keyword);

    const normalize = (str) => str.replace(/[-\s]/g, "").toLowerCase();
    const matchesBrand = brand === "" || normalize(carName).includes(normalize(brand));

    const matchesModel = model === "" || carModel.includes(model);
    const matchesSeller = sellerType === "" || car.type === sellerType;
    return matchesKeyword && matchesBrand && matchesModel && matchesSeller;
  });

  if (filtered.length === 0) {
    container.textContent = "No results found.";
    container.style.color = "white";
    return;
  }

  filtered.forEach((car) => {
    container.appendChild(createCarCard(car));
  });
});
