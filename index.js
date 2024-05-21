import cors from "cors";
import { config } from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import databaseProject from "./mongodb.js";
import { loginRoutes } from "./routes/loginRoutes.js";
import { errorHandle } from "./errorhandler/errorhandler.js";

const app = express()
const port = 4000
config();
app.use(helmet())
app.use(express.json())
app.use(morgan('combined'))

app.use(cors())
databaseProject.run()
app.use("/login",loginRoutes);
app.use(errorHandle);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })