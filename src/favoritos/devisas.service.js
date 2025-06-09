// divisas.service.js

const tasas = {
  USD: { EUR: 0.93, ARS: 900, USD: 1 },
  EUR: { USD: 1.08, ARS: 970, EUR: 1 },
  ARS: { USD: 0.0011, EUR: 0.00103, ARS: 1 },
};

export function convertirDivisa({ cantidad, de, a }) {
  if (!tasas[de] || !tasas[de][a]) {
    throw new Error(`No se puede convertir de ${de} a ${a}`);
  }

  const tasa = tasas[de][a];
  const resultado = cantidad * tasa;

  return { de, a, cantidad, tasa, resultado };
}
