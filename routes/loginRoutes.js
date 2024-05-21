import express from "express";
import { loginValidator, validateRegister } from "../middleware/login.js";
import { createLoginAccess } from "../services/loginService.js";
import { createRegisterAccess } from "../services/registerService.js";
export const loginRoutes =express.Router();
loginRoutes.post("/sign-in",loginValidator,createLoginAccess)
loginRoutes.post("/sign-up",validateRegister,createRegisterAccess)