const express = require("express")
const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
const app = express()
app.use(express.json())
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const next_server = next({ dev })
const handle = next_server.getRequestHandler()
const worker = new Worker("./scripts/modelSocketWorker.js");
worker.on("message", d => {
    io.sockets.emit("note", d)
})
next_server.prepare()
    .then(async () => {
        app.get("/_next/*", handle)
        app.get("/static/*", handle)
        app.get("/", handle)
        server.listen(3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })
    })