use incautacionesDB;

db.Incautaciones.aggregate([{
    $group: {_id: "$COD_DEPTO",
            "departamento": {$first: "$DEPARTAMENTO"}
    }
},
{
    $project: {_id: 0, "codigoDepartamento": "$_id", "departamento": 1  }
},
{
    $out: "Departamento"
}
]);

db.Incautaciones.aggregate([{
    $group: {_id: "$COD_MUNI",
            "codigoDepartamento": {$first: "$COD_DEPTO"},
            "municipio": {$first: "$MUNICIPIO"}
}},
{
    $project: {_id: 0, 
                "codigoMunicipio": "$_id", 
                "codigoDepartamento": 1, 
                "municipio": 1  }
},
{
    $out: "Municipio"
}
]);

db.Incautaciones.aggregate([{
    $group: {_id: "$UNIDAD"
            
}},
{
    $project: {_id: 0, 
                "unidad": "$_id", 
              }
},
{
    $out: "Unidad"
}
]);


db.Incautaciones.aggregate([{
    $group: {_id:{ 
                    "fecha":"$FECHA HECHO",
                    "codigoDepartamento": "$COD_DEPTO",
                    "codigoMunicipio": "$COD_MUNI",
                    "cantidad":"$CANTIDAD",
                    "unidad": "$UNIDAD"   
                  }       
            
}},
{
    $project: {_id: 0, 
                "fecha":"$_id.fecha",
                "codigoDepartamento": "$_id.codigoDepartamento",
                "codigoMunicipio": "$_id.codigoMunicipio",
                "cantidad": "$_id.cantidad",
                "unidad": "$_id.unidad"
              }
},
{
    $out: "Incautacion"
}
]);


db.Departamento.createIndex({ codigoDepartamento: 1 }, { unique: true });
// Índice unico por municipio
db.Municipio.createIndex({ codigoMunicipio: 1 }, { unique: true });

// Indice compuesto para filtrar municipios por departamento
db.Municipio.createIndex({ codigoDepartamento: 1, codigoMunicipio: 1 });

//Indice Unidad
db.Unidad.createIndex({ unidad: 1 }, { unique: true });

// Para identificar incautaciones 
db.Incautacion.createIndex(
  {
    fecha: 1,
    codigoDepartamento: 1,
    codigoMunicipio: 1,
    unidad: 1
  },
  { unique: true }
);

// Para consultar por ubicación o fecha
db.Incautacion.createIndex({ codigoDepartamento: 1, codigoMunicipio: 1 });
db.Incautacion.createIndex({ fecha: 1 });
