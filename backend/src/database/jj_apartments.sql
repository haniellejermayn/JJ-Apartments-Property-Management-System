-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema jj_apartments
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `jj_apartments` ;

-- -----------------------------------------------------
-- Schema jj_apartments
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `jj_apartments` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `jj_apartments` ;

-- -----------------------------------------------------
-- Table `jj_apartments`.`expenses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`expenses` ;


CREATE TABLE IF NOT EXISTS `jj_apartments`.`expenses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `amount` DECIMAL(10,2) NOT NULL,
  `reason` ENUM('Maintenance', 'Utilities', 'Supplies', 'Repair', 'Other') NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jj_apartments`.`tenants`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`tenants` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`tenants` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `last_name` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `middle_initial` VARCHAR(1) NULL DEFAULT NULL,
  `unit` VARCHAR(1) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jj_apartments`.`payments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`payments` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`payments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tenant_id` INT NOT NULL,
  `reason` ENUM('Monthly Due', 'Miscellaneous', 'Maintenance') NOT NULL,
  `mode_of_payment` ENUM('Cash', 'GCash', 'Bank', 'Others') NULL DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `due_date` DATE NULL DEFAULT NULL,
  `month_of_start` DATE NULL DEFAULT NULL,
  `month_of_end` DATE NULL DEFAULT NULL,
  `is_paid` TINYINT NOT NULL,
  `paid_at` DATE NULL,
  PRIMARY KEY (`id`),
  INDEX `tenant_id_idx` (`tenant_id` ASC) VISIBLE,
  CONSTRAINT `tenant_id`
    FOREIGN KEY (`tenant_id`)
    REFERENCES `jj_apartments`.`tenants` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jj_apartments`.`rates`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`rates` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`rates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` ENUM('Meralco', 'Manila Water') NOT NULL,
  `rate` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jj_apartments`.`utilities`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`utilities` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`utilities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` ENUM('Meralco', 'Manila Water') NOT NULL,
  `previous_reading` DECIMAL(10,2) NULL DEFAULT NULL,
  `current_reading` DECIMAL(10,2) NOT NULL,
  `total_meter` DECIMAL(10,2) NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `due_date` DATE NULL,
  `month_of_start` DATE NOT NULL,
  `month_of_end` DATE NOT NULL,
  `is_paid` TINYINT NOT NULL,
  `paid_at` DATE NULL,
  `tenants_id` INT NOT NULL,
  `rates_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_meralco_tenants1_idx` (`tenants_id` ASC) VISIBLE,
  INDEX `fk_utilities_rates1_idx` (`rates_id` ASC) VISIBLE,
  CONSTRAINT `fk_meralco_tenants1`
    FOREIGN KEY (`tenants_id`)
    REFERENCES `jj_apartments`.`tenants` (`id`),
  CONSTRAINT `fk_utilities_rates1`
    FOREIGN KEY (`rates_id`)
    REFERENCES `jj_apartments`.`rates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `jj_apartments`.`monthly_report`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`monthly_reports` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`monthly_reports` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `year` INT NOT NULL,
  `month` INT NOT NULL,
  `total_earnings` DECIMAL(10,2) NOT NULL,
  `total_expenses` DECIMAL(10,2) NOT NULL,
  `net_income` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jj_apartments`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`users` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `full_name` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(45) NOT NULL,
  `is_owner` TINYINT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
