const apiDolar = "https://mindicador.cl/api/dolar";
const apiEuro = "https://mindicador.cl/api/euro";
const resultado = document.getElementById("resultado");
const boton = document.getElementById("convertir");

async function getCurrencies() {
  try {
    const resDolar = await fetch(apiDolar);
    const dataDolar = await resDolar.json();
    const valorDolar = dataDolar.serie[0].valor;
    const resEuro = await fetch(apiEuro);
    const dataEuro = await resEuro.json();
    const valorEuro = dataEuro.serie[0].valor;
    return {
      dolar: valorDolar,
      euro: valorEuro,
    };
  } catch (error) {
    console.error("hubo un error: ", error);
  }
}
boton.addEventListener("click", async function () {
  const valores = await getCurrencies();
  const valorDolar = valores.dolar;
  const valorEuro = valores.euro;

  const numero = document.getElementById("numeroInput").value;
  const moneda = document.getElementById("monedaSelect").value;

  if (moneda === "dolar") {
    let valorTotalDolar = numero * valorDolar;
    resultado.innerText = "Resultado: $" + valorTotalDolar;
  } else if (moneda === "euro") {
    let valorTotalEuro = numero * valorEuro;
    resultado.innerText = "Resultado: $" + valorTotalEuro;
  }
});
async function getMonedas() {
  const endpoint = "https://api.gael.cloud/general/public/monedas";
  const res = await fetch(endpoint);
  const monedas = await res.json();
  return monedas;
}
function prepararConfiguracionParaLaGrafica(monedas) {
  // Creamos las variables necesarias para el objeto de configuración
  const tipoDeGrafica = "line";
  const nombresDeLasMonedas = monedas.map((moneda) => moneda.Codigo);
  const titulo = "Monedas";
  const colorDeLinea = "red";
  const valores = monedas.map((moneda) => {
    const valor = moneda.Valor.replace(",", ".");
    return Number(valor);
  });
  // Creamos el objeto de configuración usando las variables anteriores
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: nombresDeLasMonedas,
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          data: valores,
        },
      ],
    },
  };
  return config;
}
async function renderGrafica() {
  const monedas = await getMonedas();
  const config = prepararConfiguracionParaLaGrafica(monedas);
  const chartDOM = document.getElementById("myChart");
  new Chart(chartDOM, config);
}
renderGrafica();
