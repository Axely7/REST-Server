const { Socket } = require("socket.io")

const socketController = (socket = new Socket()) => {
   console.log(socket)
}

module.exports = {
    socketController
}