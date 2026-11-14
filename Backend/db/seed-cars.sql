-- ONE2CAR demo listings (15 cars). Seller names and phone numbers are fictional.
-- `npm run seed` inserts these only when the cars table is empty, so re-running it
-- never duplicates or overwrites listings.
--
-- price is the asking price in THB; mileage is km (NULL = not listed by the seller).
-- Car 2 was listed as "35,000 - 40,000 KM" and is stored at the upper bound.
-- Cars 7 and 9 were listed with masked mileage ("xx,xxx KM", "4xx KM") and are stored as NULL.

INSERT INTO cars
  (brand, name, model, year, price, mileage, fuelType, transmission, type,
   image_1, image_2, image_3, description, owner_name, owner_surname, phone_number)
VALUES
  ('BMW', 'BMW 330 LI', 'M Sport G28', 2024, 2190000, 31872, 'Petrol', 'Automatic', 'dealer',
   'https://i.imgur.com/orGOeL3.jpeg', 'https://i.imgur.com/ELNsoME.jpeg', 'https://i.imgur.com/HFMUwuA.jpeg',
   'BMW 330Li is a luxury sports sedan with aggressive M Sport styling. Includes adaptive suspension, Harman Kardon sound, and full safety suite.',
   'John', 'Smith', '0812345670'),

  ('BMW', 'BMW 520d 2.0 G30', 'M Sport LCI', 2024, 2390000, 40000, 'Diesel', 'Automatic', 'private',
   'https://i.imgur.com/YNURdBb.jpeg', 'https://i.imgur.com/tTwDXeh.jpeg', 'https://i.imgur.com/jtIfXbi.jpeg',
   'Experience refined performance with the BMW 520d 2.0 G30 M Sport LCI — a perfect blend of luxury, efficiency, and sportiness.',
   'Sophie', 'Lindgren', '0912345671'),

  ('BMW', 'BMW M5 G90', '4.4 V8 TwinPower Turbo xDrive', 2024, 9900000, 1200, 'Petrol Hybrid', '8-Speed Automatic', 'dealer',
   'https://i.imgur.com/1UxfcAo.jpeg', 'https://i.imgur.com/XFtbytt.jpeg', 'https://i.imgur.com/ugkeN9j.jpeg',
   'The ultimate high-performance luxury sedan. Raw power and German engineering in perfect harmony.',
   'Markus', 'Schmidt', '0812345672'),

  ('Audi', 'Audi Q5', 'Quattro Sport', 2023, 1690000, 12000, 'Petrol', 'Automatic', 'private',
   'https://i.imgur.com/L6ts6Of.jpeg', 'https://i.imgur.com/ewN1Asc.jpeg', 'https://i.imgur.com/CMyt2kd.jpeg',
   'Versatile and refined, the Audi Q5 offers comfort, power, and legendary Quattro performance.',
   'Anna', 'Bauer', '0923456783'),

  ('Audi', 'Audi RS7 Sportback', '4.0 TFSI Quattro', 2023, 9490000, 9000, 'Petrol', '8-Speed Automatic', 'dealer',
   'https://i.imgur.com/C4thvbl.jpeg', 'https://i.imgur.com/hoAZO5I.jpeg', 'https://i.imgur.com/Vm2ssez.jpeg',
   'Executive luxury meets supercar performance in the RS7 Sportback. Brutally fast and stunningly refined.',
   'Lucas', 'Hoffman', '0834567894'),

  ('Mercedes-Benz', 'Mercedes-Benz CLS 300d', 'AMG Premium', 2021, 3290000, 45000, 'Diesel', 'Automatic', 'dealer',
   'https://i.imgur.com/OHNEZZG.jpeg', 'https://i.imgur.com/qLBOtKj.jpeg', 'https://i.imgur.com/dQiQLEY.jpeg',
   'A coupe-like luxury sedan with sporty AMG styling and diesel efficiency.',
   'Emily', 'Weber', '0845678915'),

  ('Honda', 'Honda Civic 2.0 FL5 Type R', 'Boost Blue Pearl', 2023, 3650000, NULL, 'Petrol', '6-Speed Manual', 'dealer',
   'https://i.imgur.com/dmYdit7.jpeg', 'https://i.imgur.com/rMQpLEx.jpeg', 'https://i.imgur.com/Cg9tWUN.jpeg',
   'Built for speed and precision, the Type R is the king of hot hatches.',
   'Takeshi', 'Nakamura', '0956789126'),

  ('Honda', 'Honda Accord 2.0 e:HEV RS', 'G11 Hybrid', 2024, 1499000, 5000, 'Hybrid', 'Automatic', 'private',
   'https://i.imgur.com/MxpbjYZ.jpeg', 'https://i.imgur.com/LXO69dt.jpeg', 'https://i.imgur.com/IzrSAau.jpeg',
   'Elegant, smart, and fuel-efficient. The Accord e:HEV RS is a premium hybrid sedan.',
   'Napat', 'Wongsawat', '0867891237'),

  ('Mercedes-Benz', 'Mercedes-Benz CLE53 3.0 AMG', 'W236 4MATIC+ Coupe', 2024, 4690000, NULL, 'Petrol', '9G-Tronic AWD', 'dealer',
   'https://i.imgur.com/gdwIkWm.jpeg', 'https://i.imgur.com/zDmMfn0.jpeg', 'https://i.imgur.com/uRfKODp.jpeg',
   'The Mercedes-Benz CLE53 AMG is a stunning blend of coupe elegance and AMG performance. Powered by a 3.0L turbocharged inline-6 with EQ Boost.',
   'Sarun', 'Theerathada', '0834567890'),

  ('Mercedes-Benz', 'Mercedes-Benz CLS53 3.0', 'W257 AMG 4MATIC+', 2025, 4590000, 2140, 'Petrol Hybrid', 'Automatic', 'private',
   'https://i.imgur.com/m1e2ygs.jpeg', 'https://i.imgur.com/Yh0NX4w.jpeg', 'https://i.imgur.com/fCgJHXH.jpeg',
   'The Mercedes-Benz CLS53 AMG blends coupe styling with four-door practicality and thrilling performance.',
   'Pongsakorn', 'Boonmee', '0861234567'),

  ('Toyota', 'Toyota GR Supra 3.0', 'RZ Coupe', 2023, 4290000, 12500, 'Petrol', '8-Speed Automatic', 'dealer',
   'https://i.imgur.com/rz9ENp0.jpeg', 'https://i.imgur.com/IbaK5n4.jpeg', 'https://i.imgur.com/g3FgEZq.jpeg',
   'The Toyota GR Supra MK5 is a modern sports icon, powered by a 3.0-liter turbocharged inline-6.',
   'Thanapol', 'Suwan', '0853339876'),

  ('Toyota', 'Toyota GR Corolla 1.6 Turbo', 'Circuit Edition', 2023, 3390000, 8000, 'Petrol', '6-Speed Manual', 'private',
   'https://i.imgur.com/TsTvtRi.jpeg', 'https://i.imgur.com/F0IVHdV.jpeg', 'https://i.imgur.com/zIxCfZ2.jpeg',
   'The Toyota GR Corolla Circuit Edition is a rally-inspired hot hatch built for pure driving excitement.',
   'Natchanon', 'Chaisiri', '0912345678'),

  ('Porsche', 'Porsche Panamera 4 E-Hybrid', 'Executive Sedan', 2022, 6590000, 15000, 'Hybrid', '8-Speed Automatic', 'dealer',
   'https://i.imgur.com/E3vZhUQ.jpeg', 'https://i.imgur.com/Q3iUeWN.jpeg', 'https://i.imgur.com/4snAUPb.jpeg',
   'The Porsche Panamera 4 E-Hybrid blends luxury, performance, and efficiency in a sleek executive sedan.',
   'Teerapong', 'Jantarasamee', '0927654321'),

  ('Porsche', 'Porsche Cayenne Coupe', 'E-Hybrid AWD', 2023, 7190000, 22000, 'Hybrid', '8-Speed Tiptronic', 'private',
   'https://i.imgur.com/clKgWeV.jpeg', 'https://i.imgur.com/v8MBdpI.jpeg',
   'https://www.headlightmag.com/hlmwp/wp-content/uploads/2023/04/Porsche-Cayenne-Coupe-MY2024-07jpg-1.jpg',
   'The Porsche Cayenne Coupe E-Hybrid combines SUV practicality with Porsche performance.',
   'Arthit', 'Phromchanya', '0801112233'),

  ('Porsche', 'Porsche 911 GT3 RS', '992 Generation', 2023, 19800000, 4800, 'Petrol', '7-Speed PDK', 'dealer',
   'https://i.imgur.com/HnQcRCW.jpeg',
   'https://images-porsche.imgix.net/-/media/D41AD8E7D55E45BDA5CFE8651F497A74_145CD2F719DF4CC88352C7DC0B71C560_CZ23V20OX0038-911-gt3-rs-side?w=2560&h=1440&q=45&crop=faces%2Centropy%2Cedges&auto=format',
   'https://www.headlightmag.com/hlmwp/wp-content/uploads/2022/08/Porsche-911-GT3-RS_Ext_02.jpg',
   'The Porsche 911 GT3 RS (992 Generation) is a track-focused masterpiece engineered for peak performance.',
   'Krit', 'Maneerat', '0892223344');
