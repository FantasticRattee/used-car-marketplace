-- ONE2CAR database schema.
-- Safe to run more than once: it only creates missing tables and never drops data.
--
-- `npm run seed` runs this file for you inside the database named by DB_NAME.
-- To run it by hand, pick the database first:
--   CREATE DATABASE IF NOT EXISTS one2car CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--   USE one2car;

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(50)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL COMMENT 'scrypt$N$r$p$salt$key, created by seed.js',
  role          ENUM('admin', 'viewer') NOT NULL DEFAULT 'viewer',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64)     NOT NULL COMMENT 'SHA-256 of the bearer token; the token itself is never stored',
  user_id    INT UNSIGNED NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME     NOT NULL COMMENT 'UTC',
  PRIMARY KEY (token_hash),
  KEY idx_sessions_expires_at (expires_at),
  KEY idx_sessions_user_id (user_id),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES admin_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cars (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  brand         VARCHAR(100)  NOT NULL,
  name          VARCHAR(150)  NOT NULL,
  model         VARCHAR(150)  NOT NULL,
  year          SMALLINT UNSIGNED NOT NULL,
  price         INT UNSIGNED  NOT NULL COMMENT 'Asking price in THB',
  mileage       INT UNSIGNED  NULL     COMMENT 'Odometer in km; NULL when the seller did not list it',
  fuelType      VARCHAR(50)   NOT NULL,
  transmission  VARCHAR(50)   NOT NULL,
  type          ENUM('dealer', 'private') NOT NULL COMMENT 'Seller type',
  image_1       VARCHAR(2048) NOT NULL COMMENT 'Main photo (cards and listing page)',
  image_2       VARCHAR(2048) NULL,
  image_3       VARCHAR(2048) NULL,
  description   TEXT          NULL,
  owner_name    VARCHAR(100)  NOT NULL,
  owner_surname VARCHAR(100)  NULL,
  phone_number  VARCHAR(20)   NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cars_brand_model (brand, model),
  KEY idx_cars_type (type),
  KEY idx_cars_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
