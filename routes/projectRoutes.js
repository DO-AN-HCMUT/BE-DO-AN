import express from "express";
import { userValidator } from "../middleware/validator/userValidator.js";
import { makeProject } from "../services/projectService.js";

export const projectRouter=express.Router();
projectRouter.post('/new',userValidator,makeProject);
