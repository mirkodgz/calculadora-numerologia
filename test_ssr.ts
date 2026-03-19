import { verifyNumerologyToken } from './src/lib/jwt';
import { analizarNombre, analizarFecha, obtenerFamilia, sumarDigitos, sumarDigitosRecursivoSteps, obtenerInterpretacion } from './src/lib/numerology/calculator';

const payload = {
  "nombre": "Mirko",
  "apellido": "Dominguez",
  "segundo_apellido": "Guillen",
  "fecha_nacimiento": "1992-11-23",
  "idioma": "castellano",
  "email": "mirkodgzguillen@gmail.com",
  "iat": 1773871777,
  "exp": 1776463777
};

try {
    const analisisNombre = analizarNombre(payload.nombre, payload.idioma);
    const analisisApellido = analizarNombre(payload.apellido, payload.idioma);
    // Asegurarse de lidiar con strings vacios del segundo apellido
    const hasApellido2 = payload.segundo_apellido && payload.segundo_apellido.trim().length > 0;
    const analisisApellido2 = hasApellido2 
        ? analizarNombre(payload.segundo_apellido, payload.idioma) 
        : { total_simple: 0, total_multiplicado: 0 };
        
    const analisisFecha = analizarFecha(payload.fecha_nacimiento);

    const formatResult = (num: any) => {
      if (!num || isNaN(num)) return "0";
      // Reverse is needed because sumarDigitosRecursivoSteps returns [22, 13, 4] for 4-13-22
      const steps = sumarDigitosRecursivoSteps(num);
      return steps.join('-');
    };

    const getCompoundVal = (block: any) => {
        if (block.original === 11 || block.original === 22) return block.original;
        return block.valor;
    };
    
    const getKabVal = (analisis: any) => {
        const val = analisis.total_multiplicado_simplificado;
        if (val.original >= 10 && val.original <= 22) return val.original;
        if (val.valor === 11 || val.valor === 22) return val.valor;
        return val.valor;
    };

    const getSimpleVal = (analisis: any) => {
        const val = analisis.total_simple_simplificado;
        if (val.original >= 10 && val.original <= 22) return val.original;
        if (val.valor === 11 || val.valor === 22) return val.valor;
        return val.valor;
    }

    const valorKabNombre = getKabVal(analisisNombre);
    const valorKabApellido = getKabVal(analisisApellido);
    const valorKabApellido2 = hasApellido2 ? getKabVal(analisisApellido2) : 0;

    const valorSimpleNombre = getSimpleVal(analisisNombre);
    const valorSimpleApellido = getSimpleVal(analisisApellido);
    const valorSimpleApellido2 = hasApellido2 ? getSimpleVal(analisisApellido2) : 0;

    const diaV = getCompoundVal(analisisFecha.dia); // 5
    const mesV = getCompoundVal(analisisFecha.mes); // 11
    const anioV = getCompoundVal(analisisFecha.anio); // 3
    
    // Cálculos compuestos exactos
    const valCaracterEsencial = valorKabNombre + valorKabApellido + valorKabApellido2; 
    const valCaminoVida = diaV + mesV + anioV; 
    const valMisionAdolescencia = valorSimpleNombre + valorSimpleApellido;
    const valCrisisCorto = diaV + mesV;
    const valCrisisLargo = mesV + anioV;

    const caminoFinal = sumarDigitosRecursivoSteps(valCaminoVida);
    const caminoValParaEsencia = caminoFinal.length > 1 ? caminoFinal[1] : caminoFinal[0]; 

    const carEsencialFinal = sumarDigitosRecursivoSteps(valCaracterEsencial);
    const carEsencialVal = carEsencialFinal.length > 1 ? carEsencialFinal[1] : carEsencialFinal[0]; 

    const vC = valCaracterEsencial > 9 && valCaracterEsencial !== 11 && valCaracterEsencial !== 22 ? sumarDigitosRecursivoSteps(valCaracterEsencial)[0] : valCaracterEsencial;
    const vV = valCaminoVida > 9 && valCaminoVida !== 11 && valCaminoVida !== 22 ? sumarDigitosRecursivoSteps(valCaminoVida)[0] : valCaminoVida;

    const valEsencia = vC + vV; // 6 + 10 = 16

    
    const calcValAndInterp = (compoundVal: number) => {
        let finalValToReduce = compoundVal;
        if (compoundVal > 9 && compoundVal !== 11 && compoundVal !== 22) {
             finalValToReduce = sumarDigitosRecursivoSteps(compoundVal)[0];
        }
        const valToInterpret = (finalValToReduce == 11 || finalValToReduce == 22) ? finalValToReduce : sumarDigitosRecursivoSteps(finalValToReduce)[0];
        
        return {
           familia: obtenerFamilia(valToInterpret),
           desc: obtenerInterpretacion(valToInterpret)
        };
    };
    
    const almaV = analisisFecha.dia.valor === 11 || analisisFecha.dia.valor === 22 ? analisisFecha.dia.valor : analisisFecha.dia.original;
    const almaInfo = calcValAndInterp(almaV);
    const carInfo = calcValAndInterp(valCaracterEsencial);
    const esenciaInfo = calcValAndInterp(valEsencia);
    const caminoInfo = calcValAndInterp(valCaminoVida);
    const misionInfo = calcValAndInterp(valMisionAdolescencia);
    const misionInfInfo = calcValAndInterp(valorSimpleApellido + valorSimpleApellido2);
    const cortoInfo = calcValAndInterp(valCrisisCorto);
    const largoInfo = calcValAndInterp(valCrisisLargo);
    
    // For base blocks (dia, mes, etc.), it's just the simplified value unless 11/22
    const getBaseInfo = (val: any) => {
      let famObj = calcValAndInterp(val);
      return famObj;
    };

    console.log("SUCCESS!");
} catch (e) {
    console.error(e);
}
console.log(JSON.stringify(resultados, null, 2));
