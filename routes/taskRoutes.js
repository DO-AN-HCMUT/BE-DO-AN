import express from "express";
import { upload } from "../middleware/multer.js";
import { uploadItem } from "../util/uploadItem.js";
import { userValidator } from "../middleware/validator/userValidator.js";
import { getAllTask, getDetailTask } from "../services/taskService.js";
export const taskRoutes=express.Router();

taskRoutes.get('/getDetail/:id',getDetailTask);
taskRoutes.get('/getAll',userValidator,getAllTask);
taskRoutes.post("/uploadFile",upload.single("file"),uploadItem)
