import express from "express";
import { upload } from "../middleware/multer.js";
import { getDetail, getMe, updateProfile } from "../services/userService.js";
import { uploadItem } from "../util/uploadItem.js";
import { userValidator } from "../middleware/validator/userValidator.js";

export const userRoutes=express.Router();

userRoutes.get("/me",userValidator,getMe)
userRoutes.get("/:id",getDetail)
userRoutes.put('/update',userValidator,updateProfile)
userRoutes.post("/uploadImg",upload.single("file"),uploadItem)
