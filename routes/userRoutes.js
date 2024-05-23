import express from "express";
import { userValidator } from "../validator/userValidator.js";
import { getMe } from "../services/userService.js";
export const userRoutes=express.Router();

userRoutes.get("/me",userValidator,getMe)