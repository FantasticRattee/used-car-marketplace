document.addEventListener("DOMContentLoaded", function () {
  // 🖼️ Auto-preview image URLs
  ["url1", "url2", "url3"].forEach((id, index) => {
    const input = document.getElementById(id);
    const img = document.getElementById(`img${index + 1}`);
    input.addEventListener("input", () => {
      img.src = input.value || "https://via.placeholder.com/150";
    });
  });

  // 📤 Submit form
  const form = document.getElementById("vehicle-form");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      image: document.getElementById("url1").value,
      image_1: document.getElementById("url2").value,
      image_2: document.getElementById("url3").value,
      image_3: "", // optional
      type: document.getElementById("type").value,
      name: document.getElementById("name").value,
      model: document.getElementById("model").value,
      mileage: document.getElementById("mileage").value,
      fuelType: document.getElementById("fuelType").value,
      transmission: document.getElementById("transmission").value,
      year: document.getElementById("year").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value
    };

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log("✅ Saved:", result);
      alert("🚗 Vehicle added successfully!");
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      alert("Failed to add vehicle.");
    }
  });
});