import express from "express";
import { upload } from "../middleware/multer.js";
import { userValidator } from "../middleware/validator/userValidator.js";
import { getAllTask, getDetailTask, updateTask } from "../services/taskService.js";
import { uploadItem } from "../util/uploadItem.js";
export const taskRoutes=express.Router();

taskRoutes.get('/getDetail/:id',getDetailTask);
taskRoutes.get('/getAll',userValidator,getAllTask);
taskRoutes.put('/update/:id',updateTask);
taskRoutes.post("/uploadFile",upload.single("file"),uploadItem)
