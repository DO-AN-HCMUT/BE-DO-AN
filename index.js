import cors from "cors";
import { config } from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import databaseProject from "./mongodb.js";
import { loginRoutes } from "./routes/loginRoutes.js";
import { errorHandle } from "./errorhandler/errorhandler.js";
import { userRoutes } from "./routes/userRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";
import { Server } from "socket.io";
import { chatService } from "./services/chatService.js";

const app = express()
const port = 4000
const chatPort=5000
config();
app.use(helmet())
app.use(express.json())
app.use(morgan('combined'))

app.use(cors())
databaseProject.run()
app.use("/auth",loginRoutes);
app.use("/user",userRoutes);
app.use("/task",taskRoutes);
app.use(errorHandle);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
const io = new Server(chatPort, {
    cors: {
      origin: '*',
    }
});
io.on("connection", chatService );