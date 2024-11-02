const resultR2 = document.querySelector("#r2-result");
const resultFit = document.querySelector("#fit-result");
const resultMSE = document.querySelector("#mse-result");
const resultPredict = document.querySelector("#predict-result");

const btnR2 = document.querySelector("#linear--btn-r2");
const btnFit = document.querySelector("#linear--btn-fit");
const btnPredict = document.querySelector("#linear--btn-predict");
const inputFile = document.querySelector("#linear--file");
const btnMSE = document.querySelector("#linear--btn-mse");

let xValues = [];
let yValues = [];
let modelInstance = new LinearRegression();
let predictions = [];

const loadCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split("\n").slice(1);
      const xData = [];
      const yData = [];

      rows.forEach((row) => {
        const [x, y] = row.split(",").map(Number);
        if (!isNaN(x) && !isNaN(y)) {
          xData.push(x);
          yData.push(y);
        }
      });

      resolve({ xValues: xData, yValues: yData });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const fitModel = async () => {
  if (!inputFile.files.length) {
    resultFit.textContent = "Selecciona un archivo CSV, por favor.";
    return;
  }

  const data = await loadCSV(inputFile.files[0]);
  xValues = data.xValues;
  yValues = data.yValues;

  modelInstance.fit(xValues, yValues);

  btnPredict.disabled = false;
  resultFit.textContent = "Modelo ajustado exitosamente.";
};

const predictValues = () => {
  predictions = modelInstance.predict(xValues);

  btnMSE.disabled = false;
  btnR2.disabled = false;

  drawChart();
  resultPredict.textContent = "Predicciones realizadas.";
};

const calculateMSE = () => {
  const mse = modelInstance.mserror(yValues, predictions);
  resultMSE.textContent = `El MSE del modelo es: ${mse.toFixed(4)}`;
};

const calculateR2 = () => {
  const r2 = modelInstance.coeficientR2(yValues, predictions);
  resultR2.textContent = `El Coeficiente R2 del modelo es: ${r2.toFixed(4)}`;
};

let chartInstance;

const drawChart = () => {
  const lineData = xValues.map((x, i) => ({ x, y: predictions[i] }));
  const originalData = xValues.map((x, i) => ({ x, y: yValues[i] }));

  const ctx = document.querySelector("#linear--canva").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Línea de Regresión",
          data: lineData,
          type: "line",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
        {
          label: "Datos Originales",
          data: originalData,
          backgroundColor: "rgba(255, 99, 132, 1)",
          pointRadius: 5,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
};

btnFit.addEventListener("click", fitModel);
btnPredict.addEventListener("click", predictValues);
btnMSE.addEventListener("click", calculateMSE);
btnR2.addEventListener("click", calculateR2);
