const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const router = require('./router')
const cors = require('cors')

const port = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const { getUser, addUser, removeUser, getUsersInRoom } = require('./users')


io.on('connection', (socket)=>{
    console.log('we have a new connection!!');

    socket.on('join', ({name, room}, callback)=>{
        const { error , user } = addUser({ id:socket.id, name, room})
        if(error){
            return callback(error)
        }
        // admin generated welcome messages
        socket.emit('message', { user:'admin',  text:`${user.name} welcome to ${user.room}`})
        socket.broadcast.to(user.room).emit('message', { user:'admin', text:`${user.name} has joined!`})
        // joining the room
        socket.join(user.room)

        io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)})

        callback()
    })

    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id)

        io.to(user.room).emit('message', { user:user.name, text:message})
        io.to(user.room).emit('roomData', { room:user.room, users:getUsersInRoom(user.room)})

        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', {user:'admin', text:`${user.name} has left.`})
        }
    })
})

app.use(router)
app.use(cors())

server.listen(port, ()=>{ console.log(`server is listenin on port ${port}..`); })
