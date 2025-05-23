export const validarCedulaEcuatoriana = (cedula) => {
  if (cedula.length !== 10) return false;
  const digitos = cedula.substring(0, 9).split("").map(Number);
  const digitoVerificador = parseInt(cedula.charAt(9), 10);
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let multiplicador = i % 2 === 0 ? 2 : 1;
    let resultado = digitos[i] * multiplicador;
    suma += resultado > 9 ? resultado - 9 : resultado;
  }

  let modulo = suma % 10;
  let resultadoEsperado = modulo === 0 ? 0 : 10 - modulo;
  return resultadoEsperado === digitoVerificador;
};
