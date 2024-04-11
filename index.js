import cors from "cors";
import { config } from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import databaseProject from "./mongodb";

const app = express()
const port = 4000
config();
app.use(helmet())
app.use(express.json())
app.use(morgan('combined'))

app.use(cors())
databaseProject.run()

console.log(databaseProject.user.find().toArray());
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })