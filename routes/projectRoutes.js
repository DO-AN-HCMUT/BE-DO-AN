import express from "express";
import { userValidator } from "../middleware/validator/userValidator.js";
import {
  addMember,
  createTask,
  deleteMember,
  deleteProject,
  getProject,
  makeProject,
  getAllTasks,
} from "../services/projectService.js";

export const projectRouter = express.Router();
projectRouter.post("/new", userValidator, makeProject);
projectRouter.post("/addMember", addMember);
projectRouter.put("/deleteMember", deleteMember);
projectRouter.post("/createTask", createTask);
projectRouter.get("/get", userValidator, getProject);
projectRouter.delete("/deleteProject", userValidator, deleteProject);
projectRouter.get("/:projectID/tasks", getAllTasks);
