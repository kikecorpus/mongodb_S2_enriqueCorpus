const session = db.getMongo().startSession();

const inventory = session.getDatabase("IncautacionesDB").inventory;

session.startTransaction();



// ejercicios básicos
// 1. Encuentra todos los municipios que empiezan por “San”.
db.Municipio.find({ nombreMunicipio: /^San/ });

//2. Lista los municipios que terminan en “ito”.
db.Municipio.find({ nombreMunicipio: /ito$/ });

//3. Busca los municipios cuyo nombre contenga la palabra “Valle”.
db.Municipio.find({ nombreMunicipio: /Valle/ });

// 4. Devuelve los municipios cuyo nombre empiece por vocal.
db.Municipio.find({ nombreMunicipio: /^[AEIOUaeiou]/ });

// 5. Filtra los municipios que terminen en “al” o “el”.
db.Municipio.find({ nombreMunicipio: /(al|el)$/ });


// Ejercicios intermedios
//6. Encuentra los municipios cuyo nombre contenga dos vocales seguidas.

db.Municipio.find({ nombreMunicipio: /[aeiou]{2}/i });

//7. Obtén todos los municipios con nombres que contengan la letra “z”.
db.Municipio.find({ nombreMunicipio: /z/i });

//8. Lista los municipios que empiecen con “Santa” y tengan cualquier cosa después.

db.Municipio.find({ nombreMunicipio: /^Santa.*/ });

//9. Encuentra municipios cuyo nombre tenga exactamente 6 letras.

db.Municipio.find({ nombreMunicipio: /^.{6}$/ });

//10. Filtra los municipios cuyo nombre tenga 2 palabras.
db.Municipio.find({ nombreMunicipio: /^\S+\s+\S+/ });
// 11. Municipios cuyos nombres terminen en “ito” o “ita”
db.Municipio.find({ nombreMunicipio: /(ito|ita)$/ });

// 12. Municipios que contengan la sílaba “gua”
db.Municipio.find({ nombreMunicipio: /gua/i });

// 13. Municipios que empiecen por “Puerto” y terminen en “o”
db.Municipio.find({ nombreMunicipio: /^Puerto.*o$/ });

// 14. Municipios con nombres de más de 10 caracteres
db.Municipio.find({ nombreMunicipio: /^.{11,}$/ });

// 15. Municipios que no contengan vocales
db.Municipio.find({ nombreMunicipio: /^[^aeiouAEIOU]+$/ });

// 16. Total incautado en municipios que empiezan con “La”
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
  { $match: { "municipio.municipio": /^La/i } },
  {
    $group: {
      _id: "$municipio.municipio",
      totalIncautado: { $sum: "$cantidad" }
    }
  }
]);
 
// 17. Total de incautaciones en municipios cuyo nombre termine en “co”
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
  { $match: { "municipio.municipio": /co$/i } },
  {
    $group: {
      _id: "$municipio.municipio",
      totalIncautado: { $sum: "$cantidad" }
    }
  }
]);

// 18. Top 5 de municipios con más incautaciones que contengan la letra “y”
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
  { $match: { "municipio.municipio": /y/i } },
  {
    $group: {
      _id: "$municipio.municipio",
      totalIncautado: { $sum: "$cantidad" }
    }
  },
  { $sort: { totalIncautado: -1 } },
  { $limit: 5 }
]);

// 19. Municipios que empiecen por “San”, agrupados por año
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
  { $match: { "municipio.municipio": /^San/i } },
  {
    $addFields: {
      anio: {
        $year: {
          $dateFromString: { dateString: "$fecha", format: "%d/%m/%Y" }
        }
      }
    }
  },
  {
    $group: {
      _id: { municipio: "$municipio.municipio", anio: "$anio" },
      totalIncautado: { $sum: "$cantidad" }
    }
  },
  { $sort: { "_id.anio": 1 } }
]);

// 20. Departamentos con al menos un municipio terminado en “ito” o “ita”
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
  { $unwind: "$municipio" },
  {
    $lookup: {
      from: "Departamento",
      localField: "codigoDepartamento",
      foreignField: "codigoDepartamento",
      as: "departamento"
    }
  },
  { $unwind: "$departamento" },
  { $match: { "municipio.municipio": /(ito|ita)$/i } },
  {
    $group: {
      _id: "$departamento.departamento",
      totalIncautado: { $sum: "$cantidad" }
    }
  }
]);

session.commitTransaction();

session.endSession();