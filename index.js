import cors from "cors";
import { config } from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from "socket.io";
import { errorHandle } from "./errorhandler/errorhandler.js";
import databaseProject from "./mongodb.js";
import { chatRouter } from "./routes/chatRoutes.js";
import { loginRoutes } from "./routes/loginRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { projectRouter } from "./routes/projectRoutes.js";
const app = express();
const chatPort = 5500;
config();
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));

app.use(cors());
databaseProject.run();
app.use("/auth", loginRoutes);
app.use("/user", userRoutes);
app.use("/task", taskRoutes);
app.use("/chat", chatRouter);
app.use("/project", projectRouter);
app.use(errorHandle);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
const io = new Server(chatPort, {
  cors: {
    origin: "*",
  },
});
const socketService = (socket) => {

  // socket.on("message", (message) => {
  //   io.emit("broad", message);
  // });
  const users = [];
  const username = socket.handshake.auth.username;
  // if (!username) {
  //   console.log('socket error');
  //   return;
  // }
  socket.username = username;
  for (let [id, socket] of io.of("/").sockets) {
    if (users.filter((item) => item.socketName == socket.username).length < 1 && socket.username !== undefined)
      users.push({
        socketId: id,
        socketName: socket.username,
      });
  }
  socket.emit("users", users);
  socket.on('message', (payload) => {
    io.to(`${payload.socketId}`).emit('private', `${payload.content}`)
  })
  socket.on('disconnect', (reason) => {
    socket.disconnect(true);
    io.disconnectSockets(true);
    console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
  });
};
io.on("connection", socketService);
