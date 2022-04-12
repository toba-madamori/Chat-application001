const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const port = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = socketio(server)

server.listen(port, ()=>{ console.log(`server is listenin on port ${port}..`); })
