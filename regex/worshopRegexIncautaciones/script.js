use incautacionesDB;

//ejercicio 1
// ¿Cuántos municipios comienzan con "La" y cuál es la cantidad total incautada en ellos?

db.Incautacion.aggregate([
    {
        $lookup: { 
            from: "Municipio",
            localField: "codigoMunicipio",
            foreignField: "codigoMunicipio",
            as: "municipio"
        }
    },
    {
        $project: {
            "cantidad": 1,
            "municipio": {$filter: {
                input: "$municipio",
                as: "municipio",
                cond: {$regexMatch: { input: "$$municipio.municipio", 
                    regex: "^La",
                    options: "i"
                        }
                    }
                }
            }
        }
    },
    { 
        $match: { "municipio.0": { $exists: true } } 
    },
    {   
        $group: {
            _id: null,
            "totalMunicipio":{$sum : 1},
            "TotalCantidad": {$sum: "$cantidad"}
        }  
    }

]);

//Ejercicio 2
//Top 5 departamentos donde los municipios terminan en "al" y la cantidad incautada.
db.Incautacion.aggregate([
    {
        $lookup: { 
            from: "Municipio",
            localField: "codigoMunicipio",
            foreignField: "codigoMunicipio",
            as: "municipio"
        }
    },
    {
        $project: {
            "cantidad": 1,
            "municipio": {$filter: {
                input: "$municipio",
                as: "municipio",
                cond: {$regexMatch: { input: "$$municipio.municipio", 
                    regex: "al$",
                    options: "i"
                        }
                    }
                }
            }
        }
    },
    { 
        $match: { "municipio.0": { $exists: true } } 
    },
    {   
        $group: {
            _id: null,
            "totalMunicipio":{$sum : 1},
            "TotalCantidad": {$sum: "$cantidad"}
        }  
    }

]);
  

//Ejercicio 3
//Por cada año, muestra los 3 municipios con más incautaciones, pero únicamente si su nombre contiene la letra "z".

db.Incautacion.aggregate([
    {
        $lookup: { 
            from: "Municipio",
            localField: "codigoMunicipio",
            foreignField: "codigoMunicipio",
            as: "municipio"
        }
    },

    {$unwind: "$municipio"},

    {
        $match: { 
            "municipio.municipio": {$regex: "z", $options: "i"}
        }
    },
    {
        $addFields: {
        fechaISO: {
            $dateFromString: {
            dateString: "$fecha",
            format: "%d/%m/%Y" 
            }
        }
        }
    },
    {
        $group: {
        _id: {
            anio: { $year: "$fechaISO"},municipio: "$municipio.municipio"
        },
        totalIncautaciones: { $sum: 1}
        }
    },
    {
    $sort: {
      "_id.anio": 1,
      totalIncautaciones: -1
    }
  },
  {
    $group: {
      _id: "$_id.anio",
      topMunicipios: {
        $push: {
          municipio: "$_id.municipio",
          totalIncautaciones: "$totalIncautaciones"
        }
      }
    }
  },
      {
    $project: {
      _id: 1,
      top3: { $slice: ["$topMunicipios", 3] }
    }
  }, {
    $sort: { _id: 1 }
  }
]);

//Ejercicio 4
//¿Qué unidad de medida aparece en registros de municipios que empiecen por "Santa"?

db.Incautacion.aggregate([
    {
        $lookup: { 
            from: "Municipio",
            localField: "codigoMunicipio",
            foreignField: "codigoMunicipio",
            as: "municipio"
        }
    },
    {
        $unwind: "$municipio"
    },
    {
        $match: { "municipio.municipio" : {$regex: "Santa", $options:  "i"} }
    },
    {
        $project: {
            _id: 0,
            "municipio": "$municipio.municipio",
            "unidad": 1
        }
    }
   ]);

   //Ejercicio 5
//¿Cuál es la cantidad promedio de incautaciones en los municipios-- cuyo nombre contiene "Valle"--?

db.Incautacion.aggregate([
    {
        $lookup: { 
            from: "Municipio",
            localField: "codigoMunicipio",
            foreignField: "codigoMunicipio",
            as: "municipio"
        }
    },
    {
        $unwind: "$municipio"
    },
    {
        $match: { "municipio.municipio" : {$regex: "Valle", $options:  "i"} }
    },
    {
        $group: {_id: "$municipio.municipio",
                promedioDelMuni: {$avg: "$cantidad"}
        }
    },
    {
        $project: { 
            _id: 0,
            promedioDelMuni: 1,
            municipio: "$municipio.municipio"

        }
    }

]);

// Ejercicio 6
//¿Cuántos registros hay en municipios cuyo nombre contenga exactamente 7 letras?

db.Incautacion.aggregate([
    {
        $lookup: { 
            from: "Municipio",
            localField: "codigoMunicipio",
            foreignField: "codigoMunicipio",
            as: "municipio"
        }
    },
    {
        $unwind: "$municipio"
    },
    {
        $match: { "municipio.municipio" : {$regex: "^.......$", $options:  "i"} }
    },
    {
        $group: {
            _id: null,
            cantidadMuni: {$sum: 1}
        }
    }
]);


    //### Ejercicio 7
//¿Cuáles son los 10 municipios-- con mayor cantidad incautada en 2020?
db.Incautacion.aggregate([
    {
        $lookup: { 
            from: "Municipio",
            localField: "codigoMunicipio",
            foreignField: "codigoMunicipio",
            as: "municipio"
        }
    },
     {
        $unwind: "$municipio"
    },
     {
        $addFields: {
        fechaISO: { $dateFromString: {
            dateString: "$fecha",
            format: "%d/%m/%Y" 
            }
        }
        }
    },
    {
        $group: {
            _id: {anio: {$year: "$fechaISO"},  municipio: "$municipio.municipio" },
            cantidadIncautacion: {$sum: "$cantidad"}
        }
    },
    {
        $match: { "_id.anio": 2020}
    },
    {
        $sort: { "cantidadIncautacion": -1}
    },
    {
        $limit: 10
    },
    {
        $project: {
            _id: 0,
            anio: "$_id.anio",
            municipio: "$_id.municipio",
            cantidadIncautacion: 1
        }
    }
]);

//Ejercicio 8
//Por cada departamento, muestra el municipio con más cantidad incautada.

db.Incautacion.aggregate([
    {$limit: 1000},
    {
        $lookup: { 
            from: "Municipio",
            localField: "codigoMunicipio",
            foreignField: "codigoMunicipio",
            as: "municipio"
        }
    },
    {
        $lookup: { 
            from: "Departamento",
            localField: "codigoDepartamento",
            foreignField: "codigoDepartamento",
            as: "departamento"
        }
    },
    {
        $unwind: "$municipio"
    },
    {
        $unwind: "$departamento"
    },
    {
        $group: {
            _id:{
                departamento: "$departamento.departamento",
                municipio:"$municipio.municipio"
            },
            cantidad: {$sum: "$cantidad"} 
        }
    },
    {
        $sort: {"cantidad" : -1}
    },
      {
    $group: {
      _id: "$_id.departamento",
      municipio: { $first: "$_id.municipio" },
      cantidad: { $first: "$cantidad" }
    }
  },
  {
    $project: {
      _id: 0,
      departamento: "$_id",
      municipio: 1,
      cantidad: 1
    }
  }
]);

//Ejercicio 9
//Muestra la evolución mensual de incautaciones en Antioquia.
db.Incautacion.aggregate([
 {
        $lookup: { 
            from: "Departamento",
            localField: "codigoDepartamento",
            foreignField: "codigoDepartamento",
            as: "departamento"
        }
    },
     {
        $unwind: "$departamento"
    },
    {
        $addFields: { 
            fechaISO:{
                $dateFromString: {
                 dateString: "$fecha",
                format:"%d/%m/%Y"
                }
            }
        }
    },
    {
        $match:{ "departamento.departamento": {$regex: "^antioquia$", $options:"i"}}
    },
    {
        $group: {
            _id: {
                mes: {$month: "$fechaISO"},
                anio: { $year: "$fechaISO" }
            },
            cantidad: {$sum: "$cantidad"}
        }
    },
    {
    $sort: { "_id.anio": 1, "_id.mes": 1 }
    },
    {
    $project: {
      _id: 0,
      anio: "$_id.anio",
      mes: "$_id.mes",
      cantidad: 1
        }
    }

])

//Ejercicio 10
//¿Cuáles son los 5 años con menor cantidad incautada en todo el país?
db.Incautacion.aggregate([
    {
        $addFields: { 
            fechaISO:{
                $dateFromString: {
                 dateString: "$fecha",
                format:"%d/%m/%Y"
                }
            }
        }
    },
    {
        $group: {
            _id: {anio: {$year: "$fechaISO"}},
            cantidad: {$sum: "$cantidad"}
        }
    },
    {
        $sort: {"cantidad": -1}
    },
    {$limit: 5}
])

//Ejercicio 12
//Identifica los municipios que nunca superaron 1 kilogramo de incautación en todos sus registros.
db.Incautacion.aggregate([
  {
    $lookup: {
      from: "Municipio",
      localField: "codigoMunicipio",
      foreignField: "codigoMunicipio",
      as: "municipio"
    }
  },
  { $unwind: "$municipio" },
  {
    $group: {
      _id: "$municipio.municipio",
      totalIncautado: { $sum: "$cantidad" },
    }
  },
  {
    $match: {
      totalIncautado: { $lte: 1 } 
    }
  },
  { $sort: { totalIncautado: 1 } }
])


//Ejercicio 13
//Encuentra los municipios cuyo nombre empieza por "Puerto" y determina el total incautado en cada año.

db.Incautacion.aggregate([
{
        $addFields: { 
            fechaISO:{
                $dateFromString: {
                 dateString: "$fecha",
                format:"%d/%m/%Y"
                }
            }
        }
},
  {
    $lookup: {
      from: "Municipio",
      localField: "codigoMunicipio",
      foreignField: "codigoMunicipio",
      as: "municipio"
    }
  },
  {
    $unwind: "$municipio"
  },
  {
    $match: { "municipio.municipio":{ $regex: "^Puerto" , $options: "i"}}
  },
  {
    $group: { 
        _id: {anio: {$year: "$fechaISO"}, municipio: "$municipio.municipio"},
        cantidad: {$sum: "$cantidad"}
    }
  }
])

//Ejercicio 14
//¿Cuál es el mes con más incautaciones en toda la historia para municipios que terminen en "ito" o "ita"?

db.Incautacion.aggregate([
  {
    $addFields: { 
      fechaISO: {
        $dateFromString: {
          dateString: "$fecha",
          format: "%d/%m/%Y"
        }
      }
    }
  },
  {
    $lookup: {
      from: "Municipio",
      localField: "codigoMunicipio",
      foreignField: "codigoMunicipio",
      as: "municipio"
    }
  },
  { $unwind: "$municipio" },
  {
    $match: {
      "municipio.municipio": { $regex: "(ito|ita)$", $options: "i" } 
    }
  },
  {
    $group: {
      _id: {
        anio: { $year: "$fechaISO" },
        mes: { $month: "$fechaISO" }
      },
      totalIncautado: { $sum: "$cantidad" } 
    }
  },
  {
    $sort: { totalIncautado: -1 }
  },
  {
    $limit: 1 
  },
  {
    $project: {
      _id: 0,
      anio: "$_id.anio",
      mes: "$_id.mes",
      totalIncautado: 1
    }
  }
])

//Ejercicio 15
//Construye un ranking de los 5 departamentos con mayor variación de incautaciones entre el primer y el último año registrado.

db.Incautacion.aggregate([
    {
    $addFields: {
      fechaISO: {
        $dateFromString: {
          dateString: "$fecha",
          format: "%d/%m/%Y"
        }
      }
    }
  },
    {
        $lookup: { 
            from: "Departamento",
            localField: "codigoDepartamento",
            foreignField: "codigoDepartamento",
            as: "departamento"
        }
    },
    {$unwind: "$departamento"},
    {
        $group:{
            _id: { anio: {$year: "$fechaISO"}, 
            departamento: "$departamento.departamento"},
            totalAnual: {$sum: "$cantidad"},

        }
    },
{
    $group: {
      _id: "$_id.departamento",
      datosPorAnio: {
        $push: { anio: "$_id.anio", total: "$totalAnual" }
      },
      primerAnio: { $min: "$_id.anio" },
      ultimoAnio: { $max: "$_id.anio" }
    }
  },
{
    $project: {
      _id: 1,
      primerAnio: 1,
      ultimoAnio: 1,
      datosPorAnio: 1,
      incautacionPrimerAnio: {
        $first: {
          $filter: {
            input: "$datosPorAnio",
            as: "d",
            cond: { $eq: ["$$d.anio", "$primerAnio"] }
          }
        }
      },
      incautacionUltimoAnio: {
        $first: {
          $filter: {
            input: "$datosPorAnio",
            as: "d",
            cond: { $eq: ["$$d.anio", "$ultimoAnio"] }
          }
        }
      }
    }
  },
  {
    $addFields: {
      variacion: {
        $subtract: [
          "$incautacionUltimoAnio.total",
          "$incautacionPrimerAnio.total"
        ]
      }
    }
  },
   { $sort: { variacion: -1 } },
    { $limit: 5 },
     {
    $project: {
      _id: 0,
      departamento: "$_id",
      primerAnio: 1,
      ultimoAnio: 1,
      variacion: 1
    }
  }
    ]
)

  


    