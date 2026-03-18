import { dictionaries } from './dictionaries';

export type AnalisisLetra = {
  letra: string;
  valor_simple: number;
  valor_multiplicado: number;
  posicion: number;
};

export type NumberResult = {
  valor: number;
  original: number;
  es_especial: boolean;
};

export type AnalysisResult = {
  detalles: AnalisisLetra[];
  total_simple: number;
  total_simple_simplificado: NumberResult;
  total_multiplicado: number;
  total_multiplicado_simplificado: NumberResult;
};

// Familias numerológicas baseadas en el sistema PHP
export const familiasNumericas = {
  1: [1, 10, 19],
  2: [2, 11, 20],
  3: [3, 12, 21],
  4: [4, 13, 22],
  5: [5, 14],
  6: [6, 15],
  7: [7, 16],
  8: [8, 17],
  9: [9, 18],
} as Record<number, number[]>;

export function determinarVersionCastellano(fechaNacimiento: string): string {
  const anioNacimiento = new Date(fechaNacimiento).getFullYear();
  return anioNacimiento < 1995 ? 'castellano_pre1995' : 'castellano_post1995';
}

export function simplificarNumero(numero: number): NumberResult {
  const original = numero;

  if (numero === 11 || numero === 22) {
    const sumStr = String(numero);
    const suma = Array.from(sumStr).reduce((acc, char) => acc + parseInt(char), 0);
    return {
      valor: suma, // 11 -> 2, 22 -> 4
      original: numero,
      es_especial: true,
    };
  }

  if (original >= 10 && original <= 22) {
    const sumStr = String(original);
    const suma = Array.from(sumStr).reduce((acc, char) => acc + parseInt(char), 0);
    return {
      valor: suma,
      original: original,
      es_especial: true,
    };
  }

  let actual = numero;
  while (actual > 9) {
    const sumStr = String(actual);
    actual = Array.from(sumStr).reduce((acc, char) => acc + parseInt(char), 0);

    if (actual === 11 || actual === 22) {
      return {
        valor: actual,
        original: original,
        es_especial: (original >= 10 && original <= 22),
      };
    }
  }

  return {
    valor: actual,
    original: original,
    es_especial: (original >= 10 && original <= 22),
  };
}

export function analizarNombre(nombre: string, idioma: string): AnalysisResult {
  if (!nombre || nombre.trim() === '') {
    return {
      detalles: [],
      total_simple: 0,
      total_simple_simplificado: { valor: 0, original: 0, es_especial: false },
      total_multiplicado: 0,
      total_multiplicado_simplificado: { valor: 0, original: 0, es_especial: false },
    };
  }

  nombre = nombre.toLowerCase();
  
  // Si envuelve a castellano como genérico lo transfiere a post1995 por defecto (igual que en php)
  let dictKey = idioma === 'castellano' ? 'castellano_post1995' : idioma;
  const valoresLetras = dictionaries[dictKey] || dictionaries['castellano_post1995'];

  const analisis: AnalisisLetra[] = [];
  let total_simple = 0;
  let total_multiplicado = 0;
  let i = 0;

  while (i < nombre.length) {
    const letra = nombre.charAt(i);
    const letraDoble = (i < nombre.length - 1) ? nombre.substring(i, i + 2) : '';

    if (valoresLetras[letraDoble]) {
      const vals = valoresLetras[letraDoble];
      analisis.push({
        letra: letraDoble,
        valor_simple: vals.simple,
        valor_multiplicado: vals.multiplicado,
        posicion: i + 1,
      });
      total_simple += vals.simple;
      total_multiplicado += vals.multiplicado;
      i += 2;
    } else if (valoresLetras[letra]) {
      const vals = valoresLetras[letra];
      analisis.push({
        letra: letra,
        valor_simple: vals.simple,
        valor_multiplicado: vals.multiplicado,
        posicion: i + 1,
      });
      total_simple += vals.simple;
      total_multiplicado += vals.multiplicado;
      i++;
    } else {
      i++;
    }
  }

  return {
    detalles: analisis,
    total_simple,
    total_simple_simplificado: simplificarNumero(total_simple),
    total_multiplicado,
    total_multiplicado_simplificado: simplificarNumero(total_multiplicado),
  };
}

export function analizarFecha(fecha: string) {
  const [anioStr, mesStr, diaStr] = fecha.split('-');
  const dia = parseInt(diaStr);
  const mes = parseInt(mesStr);
  let anio = parseInt(anioStr);

  let anio_reducido = anio;
  if (anio_reducido > 99) {
    const anio_str = String(anio_reducido);
    anio_reducido = Array.from(anio_str).reduce((acc, char) => acc + parseInt(char), 0);
  }

  const suma_dia = simplificarNumero(dia);
  const suma_mes = simplificarNumero(mes);
  const suma_anio = simplificarNumero(anio_reducido);

  const suma_total = suma_dia.valor + suma_mes.valor + suma_anio.valor;
  const total = simplificarNumero(suma_total);

  return {
    dia: {
      valor: suma_dia.valor,
      original: suma_dia.original,
      es_especial: suma_dia.es_especial,
    },
    mes: {
      valor: suma_mes.valor,
      original: suma_mes.original,
      es_especial: suma_mes.es_especial,
    },
    anio: {
      valor: suma_anio.valor,
      original: anio_reducido,
      es_especial: (anio_reducido >= 10 && anio_reducido <= 22),
    },
    total,
  };
}

export function obtenerFamilia(numero: number): number {
  for (const [base, miembros] of Object.entries(familiasNumericas)) {
    if (miembros.includes(numero)) {
      return parseInt(base);
    }
  }
  return numero;
}

export function sumarDigitosRecursivoSteps(num: number): number[] {
  let pasos = [];
  let actual = num;
  pasos.unshift(actual);
  while (actual > 9) {
    actual = String(actual).split('').reduce((a, b) => a + parseInt(b), 0);
    pasos.unshift(actual);
    if ((actual === 11 || actual === 22) && !pasos.includes(actual)) {
      pasos.unshift(actual);
    }
  }
  return pasos.filter(n => n <= 22).reverse();
}

export function sumarDigitos(num: number): number {
  return String(num).split('').reduce((a, b) => a + parseInt(b), 0);
}

export const interpretaciones: Record<number, string> = {
  1: "El número 1 representa liderazgo e independencia.",
  2: "El número 2 representa cooperación y diplomacia.",
  3: "El número 3 representa creatividad y expresión.",
  4: "El número 4 representa estabilidad y practicidad.",
  5: "El número 5 representa libertad y cambio.",
  6: "El número 6 representa responsabilidad y armonía.",
  7: "El número 7 representa análisis y sabiduría.",
  8: "El número 8 representa poder y abundancia.",
  9: "El número 9 representa humanitarismo y compasión.",
  11: "El número maestro 11 representa intuición elevada.",
  22: "El número maestro 22 representa el constructor maestro."
};

export function obtenerInterpretacion(valorBase: number): string {
    return interpretaciones[valorBase] || "Este número requiere interpretación especializada.";
}
