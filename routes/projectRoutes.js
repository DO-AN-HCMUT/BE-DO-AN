import express from "express";
import { userValidator } from "../middleware/validator/userValidator.js";
import {
  addMember,
  getMembers,
  createTask,
  deleteMember,
  deleteProject,
  getProject,
  makeProject,
} from "../services/projectService.js";

export const projectRouter = express.Router();
projectRouter.post("/new", userValidator, makeProject);
projectRouter.get("/:projectID/members", getMembers);
projectRouter.post("/addMember", addMember);
projectRouter.put("/deleteMember", deleteMember);
projectRouter.post("/createTask", createTask);
projectRouter.get("/get", userValidator, getProject);
projectRouter.delete("/deleteProject", userValidator, deleteProject);
