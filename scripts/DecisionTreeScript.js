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
