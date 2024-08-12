import express from "express";
import { upload } from "../middleware/multer.js";
import { getMe } from "../services/userService.js";
import { uploadItem } from "../util/uploadItem.js";
import { userValidator } from "../validator/userValidator.js";

export const userRoutes=express.Router();

userRoutes.get("/me",userValidator,getMe)
userRoutes.post("/uploadImg",upload.single("image"),uploadItem)
