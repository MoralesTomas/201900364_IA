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
