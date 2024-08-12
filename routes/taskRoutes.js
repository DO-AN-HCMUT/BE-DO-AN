import express from "express";
import { upload } from "../middleware/multer.js";
import { uploadItem } from "../util/uploadItem.js";
export const taskRoutes=express.Router();

taskRoutes.get("/")
taskRoutes.post("/uploadFile",upload.single("file"),uploadItem)
