import { analizarNombre, analizarFecha } from './src/lib/numerology/calculator.ts';

console.log('Mirko:', JSON.stringify(analizarNombre('Mirko', 'castellano'), null, 2));
console.log('Dominguez:', JSON.stringify(analizarNombre('Dominguez', 'castellano'), null, 2));
console.log('Guillen:', JSON.stringify(analizarNombre('Guillen', 'castellano'), null, 2));
console.log('Fecha:', JSON.stringify(analizarFecha('1992-11-23'), null, 2));
