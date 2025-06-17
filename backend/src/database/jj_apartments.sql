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
  `id` INT NOT NULL,
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
  `mode_of_payment` ENUM('Cash', 'GCash', 'Bank', 'Others') NULL DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `month_of_start` DATE NOT NULL,
  `month_of_end` DATE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `tenant_id_idx` (`tenant_id` ASC) VISIBLE,
  CONSTRAINT `tenant_id`
    FOREIGN KEY (`tenant_id`)
    REFERENCES `jj_apartments`.`tenants` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jj_apartments`.`meralco`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`meralco` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`meralco` (
  `id` INT NOT NULL,
  `previous_reading` DECIMAL(10,2) NULL,
  `current_reading` DECIMAL(10,2) NOT NULL,
  `total_kwh_meter` DECIMAL(10,2) NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `month_of_start` DATE NOT NULL,
  `month_of_end` DATE NOT NULL,
  `tenants_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_meralco_tenants1_idx` (`tenants_id` ASC) VISIBLE,
  CONSTRAINT `fk_meralco_tenants1`
    FOREIGN KEY (`tenants_id`)
    REFERENCES `jj_apartments`.`tenants` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jj_apartments`.`manila_water`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`manila_water` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`manila_water` (
  `id` INT NOT NULL,
  `previous_reading` DECIMAL(10,2) NULL,
  `current_reading` DECIMAL(10,2) NOT NULL,
  `total_cubic_meter` DECIMAL(10,2) NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `month_of_start` DATE NOT NULL,
  `month_of_end` DATE NOT NULL,
  `tenants_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_manila_water_tenants1_idx` (`tenants_id` ASC) VISIBLE,
  CONSTRAINT `fk_manila_water_tenants1`
    FOREIGN KEY (`tenants_id`)
    REFERENCES `jj_apartments`.`tenants` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jj_apartments`.`utility_bills`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`utility_bills` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`utility_bills` (
  `id` INT NOT NULL,
  `meralco_id` INT NOT NULL,
  `manila_water_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_utility_bills_meralco1_idx` (`meralco_id` ASC) VISIBLE,
  INDEX `fk_utility_bills_manila_water1_idx` (`manila_water_id` ASC) VISIBLE,
  CONSTRAINT `fk_utility_bills_meralco1`
    FOREIGN KEY (`meralco_id`)
    REFERENCES `jj_apartments`.`meralco` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_utility_bills_manila_water1`
    FOREIGN KEY (`manila_water_id`)
    REFERENCES `jj_apartments`.`manila_water` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jj_apartments`.`finances`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`finances` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`finances` (
  `id` INT NOT NULL,
  `expenses_id` INT NULL DEFAULT NULL,
  `payments_id` INT NOT NULL,
  `utility_bills_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `expenses_id_idx` (`expenses_id` ASC) VISIBLE,
  INDEX `payments_id_idx` (`payments_id` ASC) VISIBLE,
  INDEX `fk_finances_utility_bills1_idx` (`utility_bills_id` ASC) VISIBLE,
  CONSTRAINT `expenses_id`
    FOREIGN KEY (`expenses_id`)
    REFERENCES `jj_apartments`.`expenses` (`id`),
  CONSTRAINT `payments_id`
    FOREIGN KEY (`payments_id`)
    REFERENCES `jj_apartments`.`payments` (`id`),
  CONSTRAINT `fk_finances_utility_bills1`
    FOREIGN KEY (`utility_bills_id`)
    REFERENCES `jj_apartments`.`utility_bills` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jj_apartments`.`monthly_report`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jj_apartments`.`monthly_report` ;

CREATE TABLE IF NOT EXISTS `jj_apartments`.`monthly_report` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `finances_id` INT NOT NULL,
  `monthly_dues` DECIMAL(10,2) NOT NULL,
  `utility_bills` DECIMAL(10,2) NOT NULL,
  `miscellaneous` DECIMAL(10,2) NULL DEFAULT NULL,
  `maintenance` DECIMAL(10,2) NULL DEFAULT NULL,
  `year` INT NOT NULL,
  `month` INT NOT NULL,
  `total_earnings` DECIMAL(10,2) NOT NULL,
  `expenses` DECIMAL(10,2) NULL,
  `net_income` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `finances_id_idx` (`finances_id` ASC) VISIBLE,
  CONSTRAINT `finances_id`
    FOREIGN KEY (`finances_id`)
    REFERENCES `jj_apartments`.`finances` (`id`))
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
