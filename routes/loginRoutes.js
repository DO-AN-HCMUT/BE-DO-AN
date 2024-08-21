import express from "express";
import { validateLogin, validateRegister } from "../middleware/login.js";
import { createLoginAccess, createOAuthAccess } from "../services/loginService.js";
import { createRegisterAccess } from "../services/registerService.js";
export const loginRoutes =express.Router();
loginRoutes.post("/sign-in",validateLogin,createLoginAccess)
loginRoutes.get("/oauth",createOAuthAccess)
loginRoutes.post("/sign-up",validateRegister,createRegisterAccess)