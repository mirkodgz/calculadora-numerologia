const { analizarNombre, analizarFecha } = require('./src/lib/numerology/calculator');

console.log(JSON.stringify(analizarNombre('Mirko', 'castellano'), null, 2));
console.log(JSON.stringify(analizarNombre('Dominguez', 'castellano'), null, 2));
console.log(JSON.stringify(analizarNombre('Guillen', 'castellano'), null, 2));
console.log(JSON.stringify(analizarFecha('1992-11-23'), null, 2));
