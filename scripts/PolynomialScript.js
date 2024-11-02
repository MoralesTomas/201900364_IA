const fileInput = document.querySelector("#polynomial--file");
const degreeInput = document.querySelector("#polynomial-degree");
const fitButton = document.querySelector("#polynomial--btn-fit");
const predictButton = document.querySelector("#polynomial--btn-predict");
const mseButton = document.querySelector("#polynomial--btn-mse");
const r2Button = document.querySelector("#polynomial--btn-r2");

const fitResultDisplay = document.querySelector("#poly-fit-result");
const predictResultDisplay = document.querySelector("#poly-predict-result");
const mseResultDisplay = document.querySelector("#poly-mse-result");
const r2ResultDisplay = document.querySelector("#poly-r2-result");

let polinoxValues = [];
let polinoyValues = [];
let polyModel = new PolynomialRegression();
let polinoypredictions = [];

const loadCSVFile = async (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const content = event.target.result;
      const rows = content.split("\n").slice(1);
      const xArray = [];
      const yArray = [];

      rows.forEach((row) => {
        const [x, y] = row.split(",").map(Number);
        if (!isNaN(x) && !isNaN(y)) {
          xArray.push(x);
          yArray.push(y);
        }
      });

      resolve({ xVals: xArray, yVals: yArray });
    };
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
};

const polinofitModel = async () => {
  if (!fileInput.files.length || !degreeInput.value) {
    fitResultDisplay.textContent = "Selecciona un archivo CSV y el grado del polinomio.";
    return;
  }

  const degree = parseInt(degreeInput.value);
  const data = await loadCSVFile(fileInput.files[0]);
  polinoxValues = data.xVals;
  polinoyValues = data.yVals;

  polyModel.fit(polinoxValues, polinoyValues, degree);

  predictButton.disabled = false;
  fitResultDisplay.textContent = "Modelo ajustado correctamente.";
};

const polinopredictModel = () => {
  polinoypredictions = polyModel.predict(polinoxValues);

  mseButton.disabled = false;
  r2Button.disabled = false;

  renderChart();
  predictResultDisplay.textContent = "Predicciones completadas.";
};

const polinocalculateMSE = () => {
  const mse = polyModel.getError();
  mseResultDisplay.textContent = `MSE del modelo: ${mse.toFixed(4)}`;
};

const polinocalculateR2 = () => {
  const r2 = polyModel.getError();
  r2ResultDisplay.textContent = `Coeficiente R2: ${r2.toFixed(4)}`;
};

let polinochartInstance;

const renderChart = () => {
  const lineData = polinoxValues.map((x, idx) => ({
    x,
    y: polinoypredictions[idx],
  }));
  const pointData = polinoxValues.map((x, idx) => ({
    x,
    y: polinoyValues[idx],
  }));

  const ctx = document.querySelector("#polynomial--canva").getContext("2d");

  if (polinochartInstance) {
    polinochartInstance.destroy();
  }

  polinochartInstance = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Regresión Polinomial",
          data: lineData,
          type: "line",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
        {
          label: "Datos Originales",
          data: pointData,
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

fitButton.addEventListener("click", polinofitModel);
predictButton.addEventListener("click", polinopredictModel);
mseButton.addEventListener("click", polinocalculateMSE);
r2Button.addEventListener("click", polinocalculateR2);
