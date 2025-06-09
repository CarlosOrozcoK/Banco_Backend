// divisas.service.js

const BASE_URL = 'https://api.exchangerate.host';

/**
 * Convierte una cantidad de una moneda a otra usando tasas reales de cambio.
 * @param {Object} params
 * @param {number} params.cantidad - Monto a convertir
 * @param {string} params.de - Moneda origen (ej: 'USD')
 * @param {string} params.a - Moneda destino (ej: 'JPY')
 * @returns {Promise<Object>} Resultado con tasa y valor convertido
 */
export async function convertirDivisa({ cantidad, de, a }) {
  if (typeof cantidad !== 'number' || cantidad <= 0) {
    throw new Error('La cantidad debe ser un número positivo.');
  }

  if (!de || !a || typeof de !== 'string' || typeof a !== 'string') {
    throw new Error('Las monedas de origen y destino deben ser códigos ISO válidos.');
  }

  const url = `${BASE_URL}/convert?from=${de.toUpperCase()}&to=${a.toUpperCase()}&amount=${cantidad}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error al conectar con el servicio de divisas (status: ${res.status})`);
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(`Conversión fallida de ${de} a ${a}.`);
    }

    return {
      de: data.query.from,
      a: data.query.to,
      cantidad: data.query.amount,
      tasa: data.info.rate,
      resultado: data.result,
    };

  } catch (error) {
    throw new Error(`Error en la conversión de divisas: ${error.message}`);
  }
}
