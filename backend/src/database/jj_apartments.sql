-- Create and use database
CREATE SCHEMA IF NOT EXISTS `jj_apartments` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `jj_apartments` ;


-- Disable checks tutilitiesemporarily (for safe table creation with foreign keys)
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';


-- Dropping of tables 
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS utilities;
DROP TABLE IF EXISTS rates;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS monthly_reports;


-- -------------------------
-- Table: users
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX username_UNIQUE (username ASC)
) ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `jj_apartments`.`units`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jj_apartments`.`units` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `unit_number` VARCHAR(1) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `num_occupants` INT NULL,
  `contact_number` VARCHAR(15) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

INSERT INTO units (unit_number, name, description, price, num_occupants, contact_number)
VALUES 
('A', 'Maple Residences', 'Studio Apartment', 12000.00, 1, '09171234567'),
('B', 'Maple Residences', '1 Bedroom', 15000.00, 2, '09181234567'),
('C', 'Palm Grove Towers', '2 Bedroom', 18000.00, 3, '09192233445'),
('D', 'Palm Grove Towers', 'Studio Apartment', 12500.00, 1, '09201234567'),
('E', 'Sunrise Villas', '1 Bedroom', 15500.00, 2, '09179998888');

-- INSERT INTO `jj_apartments`.`units` (`unit_number`, `num_occupants`) 
-- VALUES
-- ('D', 1),
-- ('A', 0),
-- ('M', 2),
-- ('K', 0),
-- ('R', 3),
-- ('C', 0),
-- ('B', 1),
-- ('F', 0),
-- ('H', 4),
-- ( 'P', 0),
-- ( 'G', 1),
-- ( 'E', 0),
-- ('L', 2),
-- ('S', 0),
-- ('T', 1),
-- ('J', 0),
-- ('Q', 1),
-- ('N', 0),
-- ('U', 2),
-- ('V', 0);

SELECT * FROM units;
-- -------------------------
-- Table: tenants
-- -------------------------
CREATE TABLE IF NOT EXISTS `jj_apartments`.`tenants` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `last_name` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `middle_initial` VARCHAR(1) NULL DEFAULT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(15) NOT NULL,
  `units_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE,
  INDEX `fk_tenants_units1_idx` (`units_id` ASC) VISIBLE,
  CONSTRAINT `fk_tenants_units1`
    FOREIGN KEY (`units_id`)
    REFERENCES `jj_apartments`.`units` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB;
INSERT INTO `jj_apartments`.`tenants` 
(`last_name`, `first_name`, `middle_initial`, `email`, `phone_number`, `units_id`) 
VALUES
('Dela Cruz', 'Juan', 'R', 'juan.delacruz@example.com', '09171234567', 1),
('Santos', 'Maria', 'L', 'maria.santos@example.com', '09181234567', 3),
('Reyes', 'Carlos', 'T', 'carlos.reyes@example.com', '09192234567', 5),
('Cruz', 'Angela', 'M', 'angela.cruz@example.com', '09201234567', 7),
('Gomez', 'Joseph', 'P', 'joseph.gomez@example.com', '09211234567', 9),
('Torres', 'Anna', 'S', 'anna.torres@example.com', '09221234567', 11),
('Lopez', 'Daniel', 'V', 'daniel.lopez@example.com', '09231234567', 13),
('Garcia', 'Leah', 'C', 'leah.garcia@example.com', '09241234567', 15),
('Navarro', 'Miguel', 'D', 'miguel.navarro@example.com', '09251234567', 17),
('Ramos', 'Patricia', 'E', 'patricia.ramos@example.com', '09261234567', 19);

SELECT * FROM tenants;


-- -------------------------
-- Table: payments
-- -------------------------
CREATE TABLE IF NOT EXISTS payments (
  id INT NOT NULL AUTO_INCREMENT,
  units_id INT NULL,
  mode_of_payment VARCHAR(45) NULL DEFAULT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NULL DEFAULT NULL,
  month_of_start DATE NULL DEFAULT NULL,
  month_of_end DATE NULL DEFAULT NULL,
  is_paid TINYINT NOT NULL,
  paid_at DATE NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX units_id_idx (units_id ASC),
  CONSTRAINT units_id FOREIGN KEY (units_id) REFERENCES units (id) ON DELETE SET NULL
) ENGINE = InnoDB;

INSERT INTO payments (units_id, mode_of_payment, amount, due_date, month_of_start, month_of_end, is_paid, paid_at)
VALUES 
  (2, 'GCash',         11500.00, '2025-08-01', '2025-08-01', '2025-08-31', TRUE,  '2025-07-28'),
  (3, 'Bank Transfer', 1800.00,  '2025-08-03', '2025-08-01', '2025-08-31', FALSE, NULL),
  (5, 'Cash',          2200.00,  '2025-08-05', '2025-08-01', '2025-08-31', TRUE,  '2025-08-01'),
  (1, 'Online Payment',11000.00, '2025-08-02', '2025-08-01', '2025-08-31', FALSE, NULL),
  (4, 'Cash',          950.00,   '2025-08-06', '2025-08-01', '2025-08-31', TRUE,  '2025-08-06');

-- -------------------------
-- Table: rates
-- -------------------------
CREATE TABLE IF NOT EXISTS rates (
  id INT NOT NULL AUTO_INCREMENT,
  type VARCHAR(45) NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB;

INSERT INTO rates (type, rate, date) VALUES
('Meralco', 15.02, '2025-07-17'),
('Manila Water', 50, '2025-07-17');


-- -------------------------
-- Table: utilities
-- -------------------------
CREATE TABLE IF NOT EXISTS utilities (
  id INT NOT NULL AUTO_INCREMENT,
  type VARCHAR(45) NOT NULL,
  previous_reading DECIMAL(10,2) NULL DEFAULT NULL,
  current_reading DECIMAL(10,2) NOT NULL,
  total_meter DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  due_date DATE NULL DEFAULT NULL,
  month_of_start DATE NOT NULL,
  month_of_end DATE NOT NULL,
  is_paid TINYINT NULL,
  paid_at DATE NULL DEFAULT NULL,
  units_id INT NULL,
  rates_id INT NULL,
  PRIMARY KEY (id),
  INDEX fk_utilities_units1_idx (units_id ASC),
  INDEX fk_utilities_rates1_idx (rates_id ASC),
  CONSTRAINT fk_utilities_units1 FOREIGN KEY (units_id) REFERENCES units (id) ON DELETE SET NULL,
  CONSTRAINT fk_utilities_rates1 FOREIGN KEY (rates_id) REFERENCES rates (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- Insert Meralco Utility
INSERT INTO utilities (
  type, previous_reading, current_reading, total_meter, total_amount, 
  due_date, month_of_start, month_of_end, is_paid, paid_at, 
  units_id, rates_id
) VALUES 
('Meralco', 120.0, 145.0, 25.0, 625.00, '2025-07-25', '2025-06-01', '2025-06-30', false, NULL, 1, 1),
('Meralco', 100.0, 122.5, 22.5, 562.50, '2025-07-20', '2025-06-01', '2025-06-30', true, '2025-07-10', 2, 1);

-- Insert Manila Water Utility
INSERT INTO utilities (
  type, previous_reading, current_reading, total_meter, total_amount, 
  due_date, month_of_start, month_of_end, is_paid, paid_at, 
  units_id, rates_id
) VALUES 
('Manila Water', 30.0, 45.0, 15.0, 300.00, '2025-07-22', '2025-06-01', '2025-06-30', false, NULL, 1, 2),
('Manila Water', 28.0, 40.0, 12.0, 240.00, '2025-07-18', '2025-06-01', '2025-06-30', true, '2025-07-08', 2, 2);

-- -------------------------
-- Table: expenses
-- -------------------------
CREATE TABLE IF NOT EXISTS expenses (
  id INT NOT NULL AUTO_INCREMENT,
  units_id INT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason VARCHAR(45) NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (id),
  INDEX `fk_expenses_units1_idx` (`units_id` ASC) VISIBLE,
  CONSTRAINT `fk_expenses_units1`
    FOREIGN KEY (`units_id`)
    REFERENCES `jj_apartments`.`units` (`id`)
    ON DELETE SET NULL
) ENGINE = InnoDB;

INSERT INTO expenses (units_id, amount, reason, date)
VALUES 
  (1, 1500.00, 'Utility Bills', '2025-07-01'),
  (3, 2200.00, 'Maintenance',   '2025-07-03'),
  (4, 800.00,  'Miscellaneous', '2025-07-04'),
  (2, 1750.00, 'Utility Bills', '2025-07-08'),
  (6, 950.00,  'Miscellaneous', '2025-07-12'),
  (2, 3000.00, 'Maintenance',   '2025-07-15');

-- -------------------------
-- Table: monthly_reports
-- -------------------------
CREATE TABLE IF NOT EXISTS monthly_reports (
  id INT NOT NULL AUTO_INCREMENT,
  year INT NOT NULL,
  month INT NOT NULL,
  total_earnings DECIMAL(10,2) NOT NULL,
  total_expenses DECIMAL(10,2) NOT NULL,
  net_income DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_year_month (year, month)
) ENGINE = InnoDB;

INSERT INTO monthly_reports(year, month, total_earnings, total_expenses, net_income)
VALUES
(2025, 6, 514136.30, 20000, 494136.3),
(2025, 7, 514136.30, 20000, 494136.3);

SELECT * FROM monthly_reports;



-- Restore original SQL modes and checks
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;
