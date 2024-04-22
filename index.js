const express = require('express')
const app = express()
const SocketIO = require('socket.io').Server

// kombinasi express & socket.io
const http = require('http')
const { Socket } = require('socket.io')
const server = http.createServer(app)

// static - tampilkan html
app.use("/", express.static("public"))

// server socket.io - satu room chat semua user
// setiap chat masuk, user penerima bisa tahu siapa pengirim
const io = new SocketIO(server)

io.on("connection", (socket) => {
    console.log(`new socket io connected: ${socket.id}`)

    let username = "Anonymous"
    socket.on("register", (data) => {
        username = data
    })

    // chat event...
    socket.on("send.chat", text => {
        let chatData = {
            text: text,
            date: new Date().toLocaleTimeString(),
            username: username,
        }
        console.log(chatData)
        socket.broadcast.emit("chat.receive", chatData)
        socket.emit("chat.sent", chatData)
    })

    socket.on("disconnect", () => {
        console.log(`disconnected client: ${socket.id}`)
    })
})

server.listen(8000, () => {
    console.log(`server running on port 8000`)
})
