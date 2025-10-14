INSERT INTO Departamento(nombre)
SELECT DISTINCT DEPARTAMENTO
FROM incautaciones
WHERE DEPARTAMENTO IS NOT NULL;


INSERT INTO Municipio(nombre, idDepartamento)
SELECT DISTINCT i.MUNICIPIO, d.idDepartamento
FROM incautaciones i
JOIN Departamento d ON i.DEPARTAMENTO = d.nombre
WHERE i.MUNICIPIO IS NOT NULL;


INSERT INTO Unidad(unidad)
SELECT DISTINCT UNIDAD
FROM incautaciones
WHERE UNIDAD IS NOT NULL;

INSERT INTO Incautacion(fecha, cantidad, idMunicipio, idUnidad)
SELECT 
    STR_TO_DATE(FECHA_HECHO, '%d/%m/%Y'), -- formato correcto
    CANTIDAD,
    m.idMunicipio,
    u.idUnidad
FROM incautaciones i
JOIN Municipio m ON i.MUNICIPIO = m.nombre
JOIN Unidad u ON i.UNIDAD = u.unidad;

SELECT COUNT(*) AS total_registros
FROM incautacion;


