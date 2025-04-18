// document.addEventListener("DOMContentLoaded", () => {
//   const car = JSON.parse(localStorage.getItem("selectedCar"));
//   if (!car) {
//     document.body.innerHTML = "<h1 style='color:white'>Car not found</h1>";
//     return;
//   }

//   // Update title
//   document.querySelector(".car-title").textContent = car.name + " " + car.model;

//   // Update description
//   document.querySelector(".car-details").textContent = `
//     🔧 ${car.specs.year} | 🛣️ ${car.specs.mileage} | ⚡ ${car.specs.fuelType} | ⚙️ ${car.specs.transmission}
//   `;

//   // Update price
//   document.querySelector(".price-tag").textContent = car.price;

//   // Update images
//   document.querySelector(".main-image").src = car.image;
// });


// ✅ Add: Car data
const carData = [
    {
      id: 1, // ✅ 330Li
      image: "https://i.imgur.com/orGOeL3.jpeg",
      images: [
        "https://i.imgur.com/orGOeL3.jpeg",
        "https://i.imgur.com/ELNsoME.jpeg",
        "https://i.imgur.com/HFMUwuA.jpeg"
      ],
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
      description: `BMW 330Li is a luxury sports sedan with aggressive M Sport styling.\n\nIncludes adaptive suspension, Harman Kardon sound, and full safety suite.`
    },
    
  
    {
      id: 2, // ✅ Add: 520d
      image: "https://i.imgur.com/YNURdBb.jpeg",
      images: [
        "https://i.imgur.com/YNURdBb.jpeg",
        "https://i.imgur.com/tTwDXeh.jpeg",
        "https://i.imgur.com/jtIfXbi.jpeg"
      ],
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
      description: `Experience refined performance with the BMW 520d 2.0 G30 M Sport LCI — a perfect blend of luxury, 
      efficiency, and sportiness. This executive sedan features a bold M Sport design, spacious interior with premium finishes, 
      and advanced technology for comfort and driving pleasure. Ideal for both daily commutes and long-distance cruising, the 520d offers excellent fuel economy without compromising on power.`
    },
  
    {
      id: 3, // ✅ Add: M5 G90
      image: "https://i.imgur.com/1UxfcAo.jpeg",
      images: [
        "https://i.imgur.com/1UxfcAo.jpeg",
        "https://i.imgur.com/XFtbytt.jpeg",
        "https://i.imgur.com/ugkeN9j.jpeg"
      ],
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
      description: `Unleash raw power and precision with the BMW M5 G90 — 
      the ultimate high-performance luxury sedan. Equipped with a 4.4L V8 TwinPower Turbo and xDrive all-wheel drive, 
      it delivers mind-blowing acceleration and control. The aggressive styling, signature M design elements, and refined interior make the M5 G90 a true driver's car that commands attention on every road.`
    },
  
    // Audi
    {
      id: 4,
      image: "https://i.imgur.com/L6ts6Of.jpeg",
      images: [
        "https://i.imgur.com/L6ts6Of.jpeg",
        "https://i.imgur.com/ewN1Asc.jpeg",
        "https://i.imgur.com/CMyt2kd.jpeg"
      ],
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
      description: `The Audi Q5 Quattro Sport blends luxury, versatility, and performance into one sleek SUV. With its legendary Quattro all-wheel-drive system, 
      refined design, and smooth automatic transmission, it’s perfect for both city cruising and weekend getaways. Enjoy a spacious, tech-filled interior and a confident drive in every condition.`
    },
  
    // audi rs7
    {
      id: 5,
      image: "https://i.imgur.com/C4thvbl.jpeg",
      images: [
        "https://i.imgur.com/C4thvbl.jpeg",
        "https://i.imgur.com/hoAZO5I.jpeg",
        "https://i.imgur.com/Vm2ssez.jpeg"
      ],
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
      description: `The Audi RS7 Sportback is the perfect fusion of supercar performance and executive luxury. 
      Powered by a 4.0L TFSI V8 engine with Quattro all-wheel drive, it delivers brutal acceleration with confident control. 
      Its sleek coupe-like silhouette hides a spacious, tech-rich interior, making it as comfortable as it is aggressive.`
    },


  // benz cls 300d
    {
      id: 6,
      image: "https://i.imgur.com/OHNEZZG.jpeg",
      images: [
        "https://i.imgur.com/OHNEZZG.jpeg",
        "https://i.imgur.com/qLBOtKj.jpeg",
        "https://i.imgur.com/dQiQLEY.jpeg"
      ],
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
      description: `The Mercedes-Benz CLS 300d AMG Premium blends elegant coupe styling with diesel efficiency and AMG-inspired performance. 
      Its dynamic design is matched by a refined interior, featuring advanced tech and premium materials. With AMG styling, smooth acceleration, and executive comfort, 
      it’s the perfect balance of sport and sophistication.`
    },
    {
      id: 7, // ✅ Add: Type R
      image: "https://i.imgur.com/dmYdit7.jpeg",
      images: [
        "https://i.imgur.com/dmYdit7.jpeg",
        "https://i.imgur.com/rMQpLEx.jpeg",
        "https://i.imgur.com/Cg9tWUN.jpeg"
      ],
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
      description: `The Honda Civic Type R FL5 in Boost Blue Pearl is a high-performance hatchback built for thrill-seekers. 
      Powered by a turbocharged 2.0L engine and paired with a 6-speed manual transmission, it delivers razor-sharp handling and race-inspired dynamics. 
      With aggressive styling, advanced aerodynamics, and a driver-focused cockpit, it’s engineered to dominate both track and street.`
    },
  
    {
      id: 8, // ✅ Add: Accord G11
      image: "https://i.imgur.com/MxpbjYZ.jpeg",
      images: [
        "https://i.imgur.com/LXO69dt.jpeg",
        "https://i.imgur.com/MxpbjYZ.jpeg",
        "https://i.imgur.com/IzrSAau.jpeg"
      ],
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
      description: `The Honda Accord G11 e:HEV RS is the ultimate blend of elegance and efficiency. 
      Featuring a sleek fastback design and advanced hybrid technology, it delivers powerful performance with exceptional fuel economy. Inside, it offers premium comfort, cutting-edge infotainment, 
      and a spacious cabin—perfect for business or family use. The RS trim adds a sporty edge with bold styling and enhanced driving dynamics.`
    },
  
    { //cle53
        id: 9,
        image: "https://i.imgur.com/gdwIkWm.jpeg",
        images: [
            "https://i.imgur.com/gdwIkWm.jpeg",
            "https://i.imgur.com/zDmMfn0.jpeg",
            "https://i.imgur.com/uRfKODp.jpeg"
        ],
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
        description: `The Mercedes-Benz CLE53 AMG is a stunning blend of coupe elegance and AMG performance. 
        Powered by a 3.0L turbocharged inline-6 with EQ Boost, it delivers exhilarating acceleration and precise handling via the 4MATIC+ all-wheel-drive system. 
        The sleek W236 design is paired with an aggressive AMG body kit and a luxurious interior full of high-tech features, making it a true driver's machine that doesn’t compromise on comfort or style.`
    },

    {
        id: 10,
        image: "https://i.imgur.com/m1e2ygs.jpeg",
        images: [
            "https://i.imgur.com/m1e2ygs.jpeg",
            "https://i.imgur.com/Yh0NX4w.jpeg",
            "https://i.imgur.com/fCgJHXH.jpeg"
        ],
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
        description: `The Mercedes-Benz CLS53 AMG blends coupe styling with four-door practicality and thrilling performance. Under the hood, 
        a 3.0L turbocharged inline-6 engine with EQ Boost delivers powerful acceleration, matched with the confidence of 4MATIC+ all-wheel drive. 
        Its elegant design, sporty AMG touches, and tech-forward cabin make the CLS53 a luxurious yet aggressive statement on the road.`
    },

    {
        id: 11,
        image: "https://i.imgur.com/rz9ENp0.jpeg",
        images: [
            "https://i.imgur.com/rz9ENp0.jpeg",
            "https://i.imgur.com/IbaK5n4.jpeg",
            "https://i.imgur.com/g3FgEZq.jpeg"
        ],
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
        description: `The Toyota GR Supra MK5 is a modern sports icon, powered by a 3.0-liter turbocharged inline-6 that delivers sharp throttle response and exhilarating speed. 
        Developed with performance in mind, the RZ Coupe features a rear-wheel-drive layout, precise handling, and aggressive styling. It's a perfect blend of Japanese engineering and German refinement, 
        making it a favorite among driving enthusiasts.`
    },

    {
        id: 12,
        image: "https://i.imgur.com/TsTvtRi.jpeg",
        images: [
            "https://i.imgur.com/TsTvtRi.jpeg",
            "https://i.imgur.com/F0IVHdV.jpeg",
            "https://i.imgur.com/zIxCfZ2.jpeg"
        ],
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
        description: `The Toyota GR Corolla Circuit Edition is a rally-inspired hot hatch built for pure driving excitement. 
        Under the hood is a 1.6-liter 3-cylinder turbocharged engine producing impressive power, paired with a 6-speed manual transmission and GR-FOUR all-wheel drive system. 
        This limited-edition model features lightweight components, aggressive bodywork, and track-tuned performance, making it a true enthusiast's machine.`
    },

    {
        id: 13,
        image: "https://i.imgur.com/E3vZhUQ.jpeg",
        images: [
            "https://i.imgur.com/E3vZhUQ.jpeg",
            "https://i.imgur.com/Q3iUeWN.jpeg",
            "https://i.imgur.com/4snAUPb.jpeg"
        ],
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
        description: `The Porsche Panamera 4 E-Hybrid blends luxury, performance, and efficiency in a sleek executive sedan. 
        Powered by a turbocharged V6 paired with an electric motor, it delivers powerful acceleration with reduced emissions. 
        Inside, the cabin features high-end materials, advanced tech, and rear-seat comfort. 
        With adaptive air suspension and dynamic handling, it's perfect for those who demand performance without compromising comfort.`
    },

    {
        id: 14,
        image: "https://i.imgur.com/clKgWeV.jpeg",
        images: [
            "https://i.imgur.com/clKgWeV.jpeg",
            "https://i.imgur.com/v8MBdpI.jpeg",
            "https://www.headlightmag.com/hlmwp/wp-content/uploads/2023/04/Porsche-Cayenne-Coupe-MY2024-07jpg-1.jpg"
        ],
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
        description: `The Porsche Cayenne Coupe E-Hybrid combines SUV practicality with Porsche performance. 
        Its plug-in hybrid powertrain offers strong acceleration and improved efficiency, while the coupe design adds a sporty edge. 
        Inside, it features luxurious materials, intuitive tech, and spacious seating. Perfect for drivers who want dynamic handling, 
        daily comfort, and eco-conscious driving in one bold package.`
    },

    {
        id: 15,
        image: "https://i.imgur.com/HnQcRCW.jpeg",
        images: [
            "https://i.imgur.com/HnQcRCW.jpeg",
            "https://images-porsche.imgix.net/-/media/D41AD8E7D55E45BDA5CFE8651F497A74_145CD2F719DF4CC88352C7DC0B71C560_CZ23V20OX0038-911-gt3-rs-side?w=2560&h=1440&q=45&crop=faces%2Centropy%2Cedges&auto=format",
            "https://www.headlightmag.com/hlmwp/wp-content/uploads/2022/08/Porsche-911-GT3-RS_Ext_02.jpg"
        ],
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
        description: `The Porsche 911 GT3 RS (992 Generation) is a track-focused masterpiece engineered for peak performance. 
        Powered by a naturally aspirated 4.0-liter flat-six, it delivers explosive speed, razor-sharp handling, and motorsport-inspired aerodynamics. 
        Built for enthusiasts who demand precision and power, the GT3 RS features a lightweight chassis, aggressive styling, 
        and advanced downforce systems—making it the ultimate expression of Porsche racing DNA.`
        }
  ];




const params = new URLSearchParams(window.location.search);
const carId = parseInt(params.get("id")); // Use ID for better accuracy

const car = carData.find(c => c.id === carId);

if (car) {
  // Main title & price
  document.querySelector(".car-title").textContent = car.name + " " + car.model;
  document.querySelector(".price-tag").textContent = car.price;

  const descEl = document.querySelector(".car-details");
if (descEl) {
    descEl.textContent = car.description || "No details available.";
}

  // Main image
  const mainImage = document.querySelector(".main-image");
  if (car.images?.[0]) mainImage.src = car.images[0];

  // Side images
  const sideImages = document.querySelectorAll(".side-image");
  if (sideImages.length >= 2) {
    if (car.images?.[1]) sideImages[0].src = car.images[1];
    if (car.images?.[2]) sideImages[1].src = car.images[2];
  }
}



// ✅ Make side images clickable and swap with main
const mainImage = document.querySelector(".main-image");
const sideImages = document.querySelectorAll(".side-image");

sideImages.forEach((sideImg) => {
  sideImg.addEventListener("click", () => {
    const tempSrc = mainImage.src;
    mainImage.src = sideImg.src;
    sideImg.src = tempSrc;
  });
});



vehicleForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = {
    image: document.getElementById("url1").value,
    image_1: document.getElementById("url2").value,
    image_2: document.getElementById("url3").value,
    image_3: "", // optional or can use url1 as duplicate
    type: document.getElementById("type").value || "dealer", // or "private"
    name: document.getElementById("name").value,
    model: document.getElementById("model").value,
    mileage: document.getElementById("mileage").value,
    fuelType: document.getElementById("fuelType").value,
    transmission: document.getElementById("transmission").value,
    year: document.getElementById("year").value,
    price: document.getElementById("price").value,
    description: document.getElementById("details").value
  };

  fetch("/api/cars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Car added:", data);
      alert("Car saved successfully!");
    })
    .catch(err => {
      console.error("❌ Error saving car:", err);
      alert("Failed to save car.");
    });
});
