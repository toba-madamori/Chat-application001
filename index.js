const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const router = require('./router')

const port = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const { getUser, addUser, removeUser, getUsersInRoom } = require('./users')


io.on('connection', (socket)=>{
    console.log('we have a new connection!!');

    socket.on('join', ({name, room}, callback)=>{
        console.log(name, room);

    })

    socket.on('disconnect', ()=>{
        console.log('user has disconnected');
    })
})

app.use(router)

server.listen(port, ()=>{ console.log(`server is listenin on port ${port}..`); })
