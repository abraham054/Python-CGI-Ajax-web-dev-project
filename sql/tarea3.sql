-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema tarea2
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema tarea2
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS tarea3 DEFAULT CHARACTER SET utf8 ;
USE tarea3 ;

-- -----------------------------------------------------
-- Table `tarea2`.`region`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tarea3.`region` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tarea2`.`comuna`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tarea3.`comuna` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NOT NULL,
  `region_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_comuna_region1`
    FOREIGN KEY (`region_id`)
    REFERENCES tarea3.`region` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `tarea2`.`avistamiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tarea3.`avistamiento` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comuna_id` INT NOT NULL,
  `dia_hora` DATETIME NOT NULL,
  `sector` VARCHAR(200) NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `celular` VARCHAR(15) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_domicilio_comuna1`
    FOREIGN KEY (`comuna_id`)
    REFERENCES tarea3.`comuna` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `tarea2`.`detalle_avistamiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tarea3.`detalle_avistamiento` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dia_hora` DATETIME NOT NULL,
  `tipo` ENUM('no sé', 'insecto', 'arácnido', 'miriápodo') NOT NULL,
  `estado` ENUM('no sé', 'vivo', 'muerto') NOT NULL,
  `avistamiento_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_detalle_avistamiento_avistamiento1`
    FOREIGN KEY (`avistamiento_id`)
    REFERENCES tarea3.`avistamiento` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `tarea2`.`foto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tarea3.`foto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ruta_archivo` VARCHAR(300) NOT NULL,
  `nombre_archivo` VARCHAR(300) NOT NULL,
  `detalle_avistamiento_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_foto_detalle_avistamiento1`
    FOREIGN KEY (`detalle_avistamiento_id`)
    REFERENCES tarea3.`detalle_avistamiento` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
