-- Crear la base de datos
CREATE DATABASE incautacionesDB;
USE incautacionesDB;


-- Tabla Departamento
CREATE TABLE Departamento (
    idDepartamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
);


-- Tabla Municipio
CREATE TABLE Municipio (
    idMunicipio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    idDepartamento INT NOT NULL,
    FOREIGN KEY (idDepartamento) REFERENCES Departamento(idDepartamento)
);


-- Tabla Unidad (unidad de medida: Kg, libras, etc.)
CREATE TABLE Unidad (
    idUnidad INT AUTO_INCREMENT PRIMARY KEY,
    unidad VARCHAR(45) NOT NULL
);


-- Tabla Incautación
CREATE TABLE Incautacion (
    idIncautacion INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    cantidad DECIMAL(12,2) NOT NULL,
    idMunicipio INT NOT NULL,
    idUnidad INT NOT NULL,
    FOREIGN KEY (idMunicipio) REFERENCES Municipio(idMunicipio),
    FOREIGN KEY (idUnidad) REFERENCES Unidad(idUnidad)
);

CREATE TABLE incautaciones (
    FECHA_HECHO VARCHAR(10),
    COD_DEPTO INT,
    DEPARTAMENTO VARCHAR(100),
    COD_MUNI INT,w
    MUNICIPIO VARCHAR(100),
    CANTIDAD DECIMAL(18,3),
    UNIDAD VARCHAR(50)
);

SELECT COUNT(*) AS total_registros
FROM incautaciones;


 