const apiDolar = "https://mindicador.cl/api/dolar";
const apiEuro = "https://mindicador.cl/api/euro";
const resultado = document.getElementById("resultado");
const boton = document.getElementById("convertir");
let chartDolar; 
let chartEuro; 

function sortByDateAscending(data) {
  return data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

async function getCurrencies() {
  try {
    const resDolar = await fetch(apiDolar);
    const dataDolar = await resDolar.json();
    const valorDolar = dataDolar.serie[0].valor;
    const HistorialDolar = sortByDateAscending(dataDolar.serie.slice(0, 10));

    const resEuro = await fetch(apiEuro);
    const dataEuro = await resEuro.json();
    const valorEuro = dataEuro.serie[0].valor;
    const HistorialEuro = sortByDateAscending(dataEuro.serie.slice(0, 10));

    return {
      dolar: valorDolar,
      euro: valorEuro,
      HistorialEuro,
      HistorialDolar
    };
  } catch (error) {
    console.error("Hubo un error: ", error);
  }
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear().toString().slice(2); 
  return `${day}/${month}/${year}`;
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
    renderGrafica(valores.HistorialDolar, null);
  } else if (moneda === "euro") {
    let valorTotalEuro = numero * valorEuro;
    resultado.innerText = "Resultado: $" + valorTotalEuro;
    renderGrafica(null, valores.HistorialEuro);
  }
});

function renderGrafica(historialDolar, historialEuro) {
  if (chartDolar) {
    chartDolar.destroy();
  }
  if (chartEuro) {
    chartEuro.destroy();
  }

  const chartDOM = document.getElementById("myChart");
  const ctx = chartDOM.getContext("2d");

  if (historialDolar) {
    chartDolar = new Chart(ctx, {
      type: 'line',
      data: {
        labels: historialDolar.map((entry) => formatDate(entry.fecha)),
        datasets: [{
          label: 'Dólar',
          data: historialDolar.map((entry) => entry.valor),
          backgroundColor: 'red'
        }]
      }
    });
  } else if (historialEuro) {
    chartEuro = new Chart(ctx, {
      type: 'line',
      data: {
        labels: historialEuro.map((entry) => formatDate(entry.fecha)), 
        datasets: [{
          label: 'Euro',
          data: historialEuro.map((entry) => entry.valor),
          backgroundColor: 'blue'
        }]
      }
    });
  }
}
