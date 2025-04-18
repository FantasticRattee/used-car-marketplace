-- ✅ Create database
CREATE DATABASE IF NOT EXISTS USEDCAR;
USE USEDCAR;

-- ✅ Table 1: Administrator Information
CREATE TABLE administrators (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  address TEXT,
  age INT,
  email VARCHAR(100) UNIQUE
);

-- ✅ Table 2: Administrator Login Information
CREATE TABLE admin_logins (
  login_id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255),
  role ENUM('superadmin', 'editor', 'viewer') DEFAULT 'editor',
  login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES administrators(admin_id)
);

-- ✅ Table 3: Products (Cars)
CREATE TABLE cars (
  id INT PRIMARY KEY,
  image TEXT,
  image_1 TEXT,
  image_2 TEXT,
  image_3 TEXT,
  type ENUM('dealer', 'private'),
  name VARCHAR(100),
  model VARCHAR(100),
  mileage VARCHAR(50),
  fuelType VARCHAR(50),
  transmission VARCHAR(50),
  year INT,
  price VARCHAR(50),
  description TEXT
);

-- ✅ Example Insert (You need 10 rows for each table. Here is just 1 for each.)
INSERT INTO administrators (first_name, last_name, address, age, email)
VALUES ('John', 'Doe', '123 Main St', 35, 'john@example.com');

INSERT INTO admin_logins (admin_id, username, password, role)
VALUES (1, 'johndoe', 'hashedpassword123', 'superadmin');

-- Car 1
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
  1,
  'https://i.imgur.com/orGOeL3.jpeg',
  'https://i.imgur.com/orGOeL3.jpeg',
  'https://i.imgur.com/ELNsoME.jpeg',
  'https://i.imgur.com/HFMUwuA.jpeg',
  'dealer',
  'BMW 330 LI',
  'M Sport G28',
  '31,872 KM',
  'Petrol',
  'Automatic',
  2024,
  '2,190,000 THB',
  'BMW 330Li is a luxury sports sedan with aggressive M Sport styling. Includes adaptive suspension, Harman Kardon sound, and full safety suite.'
);

-- Car 2
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
    2,
    'https://i.imgur.com/YNURdBb.jpeg',
    'https://i.imgur.com/YNURdBb.jpeg',
    'https://i.imgur.com/tTwDXeh.jpeg',
    'https://i.imgur.com/jtIfXbi.jpeg',
    'private',
    'BMW 520d 2.0 G30',
    'M Sport LCI',
    '35,000 - 40,000 KM',
    'Diesel',
    'Automatic',
    '2024',
    '2,390,000 THB',
    'Experience refined performance with the BMW 520d 2.0 G30 M Sport LCI — a perfect blend of luxury, efficiency, and sportiness. This executive sedan features a bold M Sport design, spacious interior with premium finishes, and advanced technology for comfort and driving pleasure. Ideal for both daily commutes and long-distance cruising, the 520d offers excellent fuel economy without compromising on power.'
);

-- Car 3
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
    3,
    'https://i.imgur.com/1UxfcAo.jpeg',
    'https://i.imgur.com/1UxfcAo.jpeg',
    'https://i.imgur.com/XFtbytt.jpeg',
    'https://i.imgur.com/ugkeN9j.jpeg',
    'dealer',
    'BMW M5 G90',
    '4.4 V8 TwinPower Turbo xDrive',
    '1,200 KM',
    'Petrol Hybrid',
    '8-Speed Automatic',
    '2024',
    '9,900,000 THB',
    'Unleash raw power and precision with the BMW M5 G90 — the ultimate high-performance luxury sedan. Equipped with a 4.4L V8 TwinPower Turbo and xDrive all-wheel drive, it delivers mind-blowing acceleration and control. The aggressive styling, signature M design elements, and refined interior make the M5 G90 a true driver\'s car that commands attention on every road.'
);

-- Car 4
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
    4,
    'https://i.imgur.com/L6ts6Of.jpeg',
    'https://i.imgur.com/L6ts6Of.jpeg',
    'https://i.imgur.com/ewN1Asc.jpeg',
    'https://i.imgur.com/CMyt2kd.jpeg',
    'private',
    'Audi Q5',
    'Quattro Sport',
    '12,000 KM',
    'Petrol',
    'Automatic',
    '2023',
    '1,690,000 THB',
    'The Audi Q5 Quattro Sport blends luxury, versatility, and performance into one sleek SUV. With its legendary Quattro all-wheel-drive system, refined design, and smooth automatic transmission, it’s perfect for both city cruising and weekend getaways. Enjoy a spacious, tech-filled interior and a confident drive in every condition.'
);

-- Car 5
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
    5,
    'https://i.imgur.com/C4thvbl.jpeg',
    'https://i.imgur.com/C4thvbl.jpeg',
    'https://i.imgur.com/hoAZO5I.jpeg',
    'https://i.imgur.com/Vm2ssez.jpeg',
    'dealer',
    'Audi RS7 Sportback',
    '4.0 TFSI Quattro',
    '9,000 KM',
    'Petrol',
    '8-Speed Automatic',
    '2023',
    '9,490,000 THB',
    'The Audi RS7 Sportback is the perfect fusion of supercar performance and executive luxury. Powered by a 4.0L TFSI V8 engine with Quattro all-wheel drive, it delivers brutal acceleration with confident control. Its sleek coupe-like silhouette hides a spacious, tech-rich interior, making it as comfortable as it is aggressive.'
);

-- Car 6
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
    6,
    'https://i.imgur.com/OHNEZZG.jpeg',
    'https://i.imgur.com/OHNEZZG.jpeg',
    'https://i.imgur.com/qLBOtKj.jpeg',
    'https://i.imgur.com/dQiQLEY.jpeg',
    'dealer',
    'Mercedes Benz CLS 300d',
    'AMG Premium',
    '45,000 KM',
    'Diesel',
    'Automatic',
    '2021',
    '3,290,000 THB',
    'The Mercedes-Benz CLS 300d AMG Premium blends elegant coupe styling with diesel efficiency and AMG-inspired performance. Its dynamic design is matched by a refined interior, featuring advanced tech and premium materials. With AMG styling, smooth acceleration, and executive comfort, it’s the perfect balance of sport and sophistication.'
);

-- Car 7
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
    7,
    'https://i.imgur.com/dmYdit7.jpeg',
    'https://i.imgur.com/dmYdit7.jpeg',
    'https://i.imgur.com/rMQpLEx.jpeg',
    'https://i.imgur.com/Cg9tWUN.jpeg',
    'dealer',
    'Honda Civic 2.0 FL5 Type R',
    'Boost Blue Pearl',
    'xx,xxx KM',
    'Petrol',
    '6-Speed Manual',
    '2023',
    '3,650,000 THB',
    'The Honda Civic Type R FL5 in Boost Blue Pearl is a high-performance hatchback built for thrill-seekers. Powered by a turbocharged 2.0L engine and paired with a 6-speed manual transmission, it delivers razor-sharp handling and race-inspired dynamics. With aggressive styling, advanced aerodynamics, and a driver-focused cockpit, it’s engineered to dominate both track and street.'
);

-- Car 8
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
    8,
    'https://i.imgur.com/MxpbjYZ.jpeg',
    'https://i.imgur.com/LXO69dt.jpeg',
    'https://i.imgur.com/MxpbjYZ.jpeg',
    'https://i.imgur.com/IzrSAau.jpeg',
    'private',
    'Honda Accord 2.0 e:HEV RS',
    'G11 Hybrid',
    '5,000 KM',
    'Hybrid',
    'Automatic',
    '2024',
    '1,499,000 THB',
    'The Honda Accord G11 e:HEV RS is the ultimate blend of elegance and efficiency. Featuring a sleek fastback design and advanced hybrid technology, it delivers powerful performance with exceptional fuel economy. Inside, it offers premium comfort, cutting-edge infotainment, and a spacious cabin—perfect for business or family use. The RS trim adds a sporty edge with bold styling and enhanced driving dynamics.'
);

-- Car 9
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
    9,
    'https://i.imgur.com/gdwIkWm.jpeg',
    'https://i.imgur.com/gdwIkWm.jpeg',
    'https://i.imgur.com/zDmMfn0.jpeg',
    'https://i.imgur.com/uRfKODp.jpeg',
    'dealer',
    'Mercedes-Benz CLE53 3.0 AMG',
    'W236 4MATIC+ Coupe',
    '4xx KM',
    'Petrol',
    '9G-Tronic AWD',
    '2024',
    '4,690,000 THB',
    'The Mercedes-Benz CLE53 AMG is a stunning blend of coupe elegance and AMG performance. Powered by a 3.0L turbocharged inline-6 with EQ Boost, it delivers exhilarating acceleration and precise handling via the 4MATIC+ all-wheel-drive system. The sleek W236 design is paired with an aggressive AMG body kit and a luxurious interior full of high-tech features, making it a true driver''s machine that doesn’t compromise on comfort or style.'
);

-- Car 10
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
    10,
    'https://i.imgur.com/m1e2ygs.jpeg',
    'https://i.imgur.com/m1e2ygs.jpeg',
    'https://i.imgur.com/Yh0NX4w.jpeg',
    'https://i.imgur.com/fCgJHXH.jpeg',
    'private',
    'Mercedes-Benz CLS53 3.0',
    'W257 AMG 4MATIC+',
    '2,140 KM',
    'Petrol Hybrid',
    'Automatic',
    '2025',
    '4,590,000 THB',
    'The Mercedes-Benz CLS53 AMG blends coupe styling with four-door practicality and thrilling performance. Under the hood, a 3.0L turbocharged inline-6 engine with EQ Boost delivers powerful acceleration, matched with the confidence of 4MATIC+ all-wheel drive. Its elegant design, sporty AMG touches, and tech-forward cabin make the CLS53 a luxurious yet aggressive statement on the road.'
);

-- Car 11
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
  11,
  'https://i.imgur.com/rz9ENp0.jpeg',
  'https://i.imgur.com/rz9ENp0.jpeg',
  'https://i.imgur.com/IbaK5n4.jpeg',
  'https://i.imgur.com/g3FgEZq.jpeg',
  'dealer',
  'Toyota GR Supra 3.0',
  'RZ Coupe',
  '12,500 KM',
  'Petrol',
  '8-Speed Automatic',
  '2023',
  '4,290,000 THB',
  'The Toyota GR Supra MK5 is a modern sports icon, powered by a 3.0-liter turbocharged inline-6 that delivers sharp throttle response and exhilarating speed. Developed with performance in mind, the RZ Coupe features a rear-wheel-drive layout, precise handling, and aggressive styling. It\'s a perfect blend of Japanese engineering and German refinement, making it a favorite among driving enthusiasts.'
);

-- Car 12
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
  12,
  'https://i.imgur.com/TsTvtRi.jpeg',
  'https://i.imgur.com/TsTvtRi.jpeg',
  'https://i.imgur.com/F0IVHdV.jpeg',
  'https://i.imgur.com/zIxCfZ2.jpeg',
  'private',
  'Toyota GR Corolla 1.6 Turbo',
  'Circuit Edition',
  '8,000 KM',
  'Petrol',
  '6-Speed Manual',
  '2023',
  '3,390,000 THB',
  'The Toyota GR Corolla Circuit Edition is a rally-inspired hot hatch built for pure driving excitement. Under the hood is a 1.6-liter 3-cylinder turbocharged engine producing impressive power, paired with a 6-speed manual transmission and GR-FOUR all-wheel drive system. This limited-edition model features lightweight components, aggressive bodywork, and track-tuned performance, making it a true enthusiast\'s machine.'
);

-- Car 13
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
  13,
  'https://i.imgur.com/E3vZhUQ.jpeg',
  'https://i.imgur.com/E3vZhUQ.jpeg',
  'https://i.imgur.com/Q3iUeWN.jpeg',
  'https://i.imgur.com/4snAUPb.jpeg',
  'dealer',
  'Porsche Panamera 4 E-Hybrid',
  'Executive Sedan',
  '15,000 KM',
  'Hybrid',
  '8-Speed Automatic',
  '2022',
  '6,590,000 THB',
  'The Porsche Panamera 4 E-Hybrid blends luxury, performance, and efficiency in a sleek executive sedan. Powered by a turbocharged V6 paired with an electric motor, it delivers powerful acceleration with reduced emissions. Inside, the cabin features high-end materials, advanced tech, and rear-seat comfort. With adaptive air suspension and dynamic handling, it\'s perfect for those who demand performance without compromising comfort.'
);

-- Car 14
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
  14,
  'https://i.imgur.com/clKgWeV.jpeg',
  'https://i.imgur.com/clKgWeV.jpeg',
  'https://i.imgur.com/v8MBdpI.jpeg',
  'https://www.headlightmag.com/hlmwp/wp-content/uploads/2023/04/Porsche-Cayenne-Coupe-MY2024-07jpg-1.jpg',
  'private',
  'Porsche Cayenne Coupe',
  'E-Hybrid AWD',
  '22,000 KM',
  'Hybrid',
  '8-Speed Tiptronic',
  '2023',
  '7,190,000 THB',
  'The Porsche Cayenne Coupe E-Hybrid combines SUV practicality with Porsche performance. Its plug-in hybrid powertrain offers strong acceleration and improved efficiency, while the coupe design adds a sporty edge. Inside, it features luxurious materials, intuitive tech, and spacious seating. Perfect for drivers who want dynamic handling, daily comfort, and eco-conscious driving in one bold package.'
);

-- Car 15
INSERT INTO cars (id, image, image_1, image_2, image_3, type, name, model, mileage, fuelType, transmission, year, price, description)
VALUES (
  15,
  'https://i.imgur.com/HnQcRCW.jpeg',
  'https://i.imgur.com/HnQcRCW.jpeg',
  'https://images-porsche.imgix.net/-/media/D41AD8E7D55E45BDA5CFE8651F497A74_145CD2F719DF4CC88352C7DC0B71C560_CZ23V20OX0038-911-gt3-rs-side?w=2560&h=1440&q=45&crop=faces%2Centropy%2Cedges&auto=format',
  'https://www.headlightmag.com/hlmwp/wp-content/uploads/2022/08/Porsche-911-GT3-RS_Ext_02.jpg',
  'dealer',
  'Porsche 911 GT3 RS',
  '992 Generation',
  '4,800 KM',
  'Petrol',
  '7-Speed PDK',
  '2023',
  '19,800,000 THB',
  'The Porsche 911 GT3 RS (992 Generation) is a track-focused masterpiece engineered for peak performance. Powered by a naturally aspirated 4.0-liter flat-six, it delivers explosive speed, razor-sharp handling, and motorsport-inspired aerodynamics. Built for enthusiasts who demand precision and power, the GT3 RS features a lightweight chassis, aggressive styling, and advanced downforce systems—making it the ultimate expression of Porsche racing DNA.'
);


