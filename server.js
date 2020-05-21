const express = require("express")
const app = express()
app.use(express.json())
const tf = require("@tensorflow/tfjs-node")
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const next_server = next({ dev })
const handle = next_server.getRequestHandler()

next_server.prepare()
    .then(async () => {
        const handler = tf.io.fileSystem("./model/model.json");
        let model = await tf.loadLayersModel(handler);
        app.get("/", (req, res) => {
            model.predict(tf.tensor(Array(200).fill(0), [1, 200, 1])).data().then(d => res.send(String(indexOfMax(d))))
        })
        io.on('connection', (socket) => {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', (data) => {
                console.log(data);
            });
        });
        server.listen(3001,(err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
          })
    })

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