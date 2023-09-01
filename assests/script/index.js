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
