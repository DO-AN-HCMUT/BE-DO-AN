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
const port = 4000;
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
const io = new Server(chatPort, {
  cors: {
    origin: "*",
  },
});
const socketService = (socket) => {
  socket.on("message", (message) => {
    io.emit("broad", message);
  });
};
io.on("connection", socketService);
