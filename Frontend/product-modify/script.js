//product-modify/script.js

document.addEventListener("DOMContentLoaded", async () => {
  const carSelector = document.getElementById("carSelector");
  const form = document.getElementById("vehicle-form");
  const deleteBtn = document.getElementById("deleteBtn");
  let selectedCarId = null;

  // Fetch cars
  const response = await fetch("http://localhost:8080/api/cars");
  const cars = await response.json();

  cars.forEach(car => {
    const option = document.createElement("option");
    option.value = car.id;
    option.textContent = `${car.name} (${car.model})`;
    carSelector.appendChild(option);
  });

  // When car selected, load details
  carSelector.addEventListener("change", () => {
    selectedCarId = parseInt(carSelector.value);
    const car = cars.find(c => c.id === selectedCarId);

    if (car) {
      document.getElementById("url1").value = car.image_1;
      document.getElementById("img1").src = car.image_1;
      document.getElementById("url2").value = car.image_2;
      document.getElementById("img2").src = car.image_2;
      document.getElementById("url3").value = car.image_3;
      document.getElementById("img3").src = car.image_3;
      document.getElementById("type").value = car.type.charAt(0).toUpperCase() + car.type.slice(1).toLowerCase();
      document.getElementById("name").value = car.name;
      document.getElementById("model").value = car.model;
      document.getElementById("mileage").value = car.mileage;
      document.getElementById("fuelType").value = car.fuelType;
      document.getElementById("transmission").value = car.transmission;
      document.getElementById("year").value = car.year;
      document.getElementById("price").value = car.price;
      document.getElementById("description").value = car.description;
      document.getElementById("owner-name").value = car.owner_name || "";
      document.getElementById("owner-surname").value = car.owner_surname || "";
      document.getElementById("phone-number").value = car.phone_number || "";

      // ✅ Fix: Set brand dropdown
      document.getElementById("brand").value = car.brand;
    }
  });

  // ✅ Handle Save button
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedCarId) return alert("Please select a car to update.");

    const updatedData = {
      image_1: document.getElementById("url1").value,
      image_2: document.getElementById("url2").value,
      image_3: document.getElementById("url3").value,
      type: document.getElementById("type").value,
      brand: document.getElementById("brand").value,
      name: document.getElementById("name").value,
      model: document.getElementById("model").value,
      mileage: document.getElementById("mileage").value,
      fuelType: document.getElementById("fuelType").value,
      transmission: document.getElementById("transmission").value,
      year: parseInt(document.getElementById("year").value),
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      owner_name: document.getElementById("owner-name").value,
      owner_surname: document.getElementById("owner-surname").value,
      phone_number: document.getElementById("phone-number").value,
    };

    const res = await fetch(`http://localhost:8080/api/cars/${selectedCarId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
      alert("✅ Vehicle updated successfully!");
      location.reload();
    } else {
      alert("❌ Failed to update vehicle.");
    }
  });

  // ✅ Handle Delete button
  deleteBtn.addEventListener("click", async () => {
    if (!selectedCarId) return alert("Please select a car to delete.");
    const confirmed = confirm("Are you sure you want to delete this vehicle?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:8080/api/cars/${selectedCarId}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("🗑️ Vehicle deleted!");
      location.reload();
    } else {
      alert("❌ Failed to delete vehicle.");
    }
  });

  const storedId = parseInt(localStorage.getItem("modifyCarId"));
  if (storedId && !isNaN(storedId)) {
    const targetOption = [...carSelector.options].find(opt => parseInt(opt.value) === storedId);
    if (targetOption) {
      carSelector.value = targetOption.value;
      carSelector.dispatchEvent(new Event("change"));
    }
    localStorage.removeItem("modifyCarId");
  }

});