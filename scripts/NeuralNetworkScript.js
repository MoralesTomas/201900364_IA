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
