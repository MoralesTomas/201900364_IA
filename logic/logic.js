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



// ==================================== DIV==================================
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





// ==================================== DIV==================================


let trainDataset = [];
let predictionDataset = [];

const parseCSVFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const records = content.trim().split("\n").map(line => line.split(","));
            resolve(records);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};

const uploadTrainData = async () => {
    const file = document.getElementById("training-file").files[0];
    if (!file) {
        alert("Selecciona un archivo CSV de datos de entrenamiento.");
        return;
    }
    trainDataset = await parseCSVFile(file);
};

const uploadPredictionData = async () => {
    const file = document.getElementById("predict-file").files[0];
    if (file) {
        predictionDataset = await parseCSVFile(file);
    }
};

const createModelAndPredict = () => {
    if (trainDataset.length === 0) {
        alert("Carga los datos de entrenamiento antes de generar el modelo.");
        return;
    }

    const decisionTree = new DecisionTreeID3(trainDataset);
    const treeRoot = decisionTree.train(decisionTree.dataset);

    let predictedOutcome = null;
    if (predictionDataset.length > 0) {
        const features = trainDataset[0].slice(0, -1);
        predictedOutcome = decisionTree.predict([features, predictionDataset[0]], treeRoot);
    }

    return {
        graphStructure: decisionTree.generateDotString(treeRoot),
        predictionResult: predictedOutcome
    };
};

// INTERACCION DIRECTA CON DOM
document.getElementById('predict').onclick = async () => {
    await uploadPredictionData();
    const treeContainer = document.getElementById("treed");
    const { graphStructure, predictionResult } = createModelAndPredict();

    if (predictionResult != null) {
        const labels = trainDataset[0];
        document.getElementById('prediction').innerText = `${labels[labels.length - 1]}: ${predictionResult.value}`;
    } else {
        document.getElementById('prediction').innerText = "No hay predicción disponible.";
    }

    const parsedGraph = vis.network.convertDot(graphStructure);
    const networkData = {
        nodes: parsedGraph.nodes,
        edges: parsedGraph.edges
    };

    const networkOptions = {
        layout: {
            hierarchical: {
                levelSeparation: 100,
                nodeSpacing: 100,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed'
            }
        }
    };

    new vis.Network(treeContainer, networkData, networkOptions);
};

document.getElementById('btngenerate').onclick = async () => {
    await uploadTrainData();
    const treeContainer = document.getElementById("treed");
    const { graphStructure, predictionResult } = createModelAndPredict();

    if (predictionResult != null) {
        const labels = trainDataset[0];
        document.getElementById('prediction').innerText = `${labels[labels.length - 1]}: ${predictionResult.value}`;
    } else {
        document.getElementById('prediction').innerText = "No hay predicción disponible.";
    }

    const parsedGraph = vis.network.convertDot(graphStructure);
    const networkData = {
        nodes: parsedGraph.nodes,
        edges: parsedGraph.edges
    };

    const networkOptions = {
        layout: {
            hierarchical: {
                levelSeparation: 100,
                nodeSpacing: 100,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed'
            }
        }
    };

    new vis.Network(treeContainer, networkData, networkOptions);
};


// ==================================== DIV==================================

let neuralConfig = [];
let trainingDataset = [];
let NeuralNpredictionDataset = [];

const neuralNparseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const fileData = event.target.result;
      const rows = fileData
        .trim()
        .split("\n")
        .map((line) => line.split(",").map(Number));
      resolve(rows);
    };
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
};

document
  .getElementById("network-config-file")
  .addEventListener("change", async (event) => {
    neuralConfig = (await neuralNparseCSVFile(event.target.files[0]))[0];
    console.log("Configuración cargada:", neuralConfig);
  });

document
  .getElementById("training-data-file")
  .addEventListener("change", async (event) => {
    trainingDataset = await neuralNparseCSVFile(event.target.files[0]);
    console.log("Datos de entrenamiento cargados:", trainingDataset);
  });

document
  .getElementById("prediction-data-file")
  .addEventListener("change", async (event) => {
    NeuralNpredictionDataset = await neuralNparseCSVFile(event.target.files[0]);
    console.log("Datos de predicción cargados:", NeuralNpredictionDataset);
  });

document.getElementById("train-and-predict-btn").onclick = function () {
  if (
    neuralConfig.length === 0 ||
    trainingDataset.length === 0 ||
    NeuralNpredictionDataset.length === 0
  ) {
    alert("Falta que se carguen archivos CSV para poder continuar con el entrenamiento y predicción.");
    return;
  }

  let neuralNet = new NeuralNetwork(neuralConfig);

  trainingDataset.forEach((entry) => {
    const inputValues = entry.slice(0, neuralConfig[0]); // Entradas basadas en la configuración
    const targetValues = entry.slice(neuralConfig[0]); // Valores esperados
    neuralNet.Entrenar(inputValues, targetValues);
  });

  let resultPredictions = NeuralNpredictionDataset.map((inputs) => neuralNet.Predecir(inputs));

  document.getElementById("nnresultado").innerHTML = resultPredictions
    .map(
      (pred, index) =>
        `Predicción ${index + 1}: [${pred.map((value) => value.toFixed(2)).join(", ")}]`
    )
    .join("<br>");
};


// ==================================== DIV==================================

let dataset = [];
let numClusters = 3;
let maxIterations = 100;
let scatterPlot; // INSTANCIA DE LA GRAFICA

const kMeansloadCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const fileData = event.target.result;
      const rows = fileData
        .trim()
        .split("\n")
        .map((line) => line.split(",").map(Number));
      resolve(rows);
    };
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
};

document
  .getElementById("data-file")
  .addEventListener("change", async (event) => {
    dataset = (await kMeansloadCSVFile(event.target.files[0])).map((row) =>
      row.length === 1 ? row[0] : row
    );
    console.log("Datos cargados:", dataset);
  });

document
  .getElementById("config-file")
  .addEventListener("change", async (event) => {
    const config = (await kMeansloadCSVFile(event.target.files[0]))[0];
    numClusters = config[0];
    maxIterations = config[1];
    console.log(`Configuración: Clusters: ${numClusters}, Iteraciones: ${maxIterations}`);
  });

document.getElementById("btnLineal").onclick = function () {
  if (dataset.length === 0 || numClusters <= 0 || maxIterations <= 0) {
    alert("Por favor, carga los archivos de datos y configuración.");
    return;
  }

  const is2D = Array.isArray(dataset[0]);
  const kmeansAlgorithm = is2D ? new KMeans2D() : new LinearKMeans();
  const clusteredData = kmeansAlgorithm.clusterize(numClusters, dataset, maxIterations);

  let uniqueClusters = Array.from(new Set(clusteredData.map((item) => item[1])));
  uniqueClusters = uniqueClusters.map((cluster) => [
    cluster,
    `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  ]);

  plotClusters(clusteredData, uniqueClusters, is2D);
};

function plotClusters(clusteredData, uniqueClusters, is2D) {
  if (scatterPlot) {
    scatterPlot.destroy();
  }

  const datasets = uniqueClusters.map(([cluster, color]) => {
    return {
      label: `Cluster ${cluster}`,
      data: clusteredData
        .filter(([point, clusterID]) => clusterID === cluster)
        .map(([point]) => ({
          x: is2D ? point[0] : point,
          y: is2D ? point[1] : 0,
        })),
      backgroundColor: color,
      pointRadius: 5,
    };
  });

  const ctx = document.getElementById("chartkmean").getContext("2d");
  scatterPlot = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: datasets,
    },
    options: {
      title: {
        display: true,
        text: "Clustering K-Means",
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "X",
          },
          min: Math.min(...dataset.flat()) - 10,
          max: Math.max(...dataset.flat()) + 10,
        },
        y: {
          title: {
            display: true,
            text: "Y",
          },
          min: is2D ? Math.min(...dataset.flat()) - 10 : -1,
          max: is2D ? Math.max(...dataset.flat()) + 10 : 1,
        },
      },
    },
  });
}



// ==================================== DIV==================================

document.addEventListener("DOMContentLoaded", () => {
  
    let selector = document.getElementById("model-selector");
    let sections = document.querySelectorAll(".model-section");
    
    selector.addEventListener("change", () => {
      
      sections.forEach((section) => {
      
        section.style.display = "none";
      
      });
  
      let modelSelected = selector.value;
      if (modelSelected) {
        document.getElementById(modelSelected).style.display = "block";
      }
  
  
    });
  });
  
