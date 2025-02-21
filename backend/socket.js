const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client Connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    //for updating location
    socket.on('update-loaction-captain', async (data)=>{
      
      const {userId , location} = data;
      // validation
      if(!location || !location.ltd || !location.lng){
        return socket.emit('error', {message: 'Invalid location '})
      }
      
      await captainModel.findByIdAndUpdate(userId, {
        location:{
        ltd: location.ltd,
        lng: location.lng,
        // updatedAt: new Date()  // to update last seen time
        }
      })
    })

    socket.on("disconnect", () => {
      console.log(`Client Disconnected: ${socket.id}`);
    });
  });
}

function sendMessageToSocketId(socketId, messageObject) {
  console.log((`sending msg to socket ${socketId}`,messageObject))
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized");
  }
}

module.exports = { initializeSocket, sendMessageToSocketId };
