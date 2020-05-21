const tf = require("@tensorflow/tfjs-node")
const inputs = require("./inputStarter")
const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

var inputArray = inputs[Math.floor(Math.random() * inputs.length)].flat();

const indexOfMax = (arr) => {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

(async () => {
    const handler = tf.io.fileSystem("model/model.json");
    let model = await tf.loadLayersModel(handler);
    function predict() {
        model.predict(tf.tensor(inputArray.map(v => v / 804), [1, 200, 1])).data().then(d => {
            let max = indexOfMax(d)
            parentPort.postMessage(max)
            inputArray.push(max)
            inputArray.shift()
            predict()
        })
    }
    predict()
})()
