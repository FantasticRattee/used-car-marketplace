-- ✅ Create database
-- 🔄 Reset and create the database
DROP DATABASE IF EXISTS USEDCAR;
CREATE DATABASE USEDCAR;
USE USEDCAR;
-- select * from cars;

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

-- ✅ Table 3: Cars (Products)
CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY, -- ✅ Auto-increment is now included
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
  description TEXT,
  owner_name VARCHAR(100),
  owner_surname VARCHAR(100),
  phone_number VARCHAR(20)
);



-- ✅ Example Insert (You need 10 rows for each table. Here is just 1 for each.)
INSERT INTO administrators (first_name, last_name, address, age, email)
VALUES ('John', 'Doe', '123 Main St', 35, 'john@example.com');

INSERT INTO admin_logins (admin_id, username, password, role)
VALUES (1, 'johndoe', 'usedcar', 'superadmin');



-- ALTER TABLE cars AUTO_INCREMENT = 16;
-- Step 1: Get the max id

-- SELECT MAX(id) + 1 AS next_id FROM cars;
-- ALTER TABLE cars AUTO_INCREMENT = (SELECT MAX(id) + 1 FROM cars);






-- SELECT * FROM cars ORDER BY id DESC;





-- SHOW CREATE TABLE cars;



-- SHOW CREATE TABLE cars;
-- SELECT MAX(id) FROM cars;

-- DELETE FROM cars WHERE id = 1003;
-- DELETE FROM cars WHERE id IN (17, 18, 19);