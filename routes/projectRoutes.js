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
  getAllTasks,
  sendInvitation,
} from "../services/projectService.js";

export const projectRouter = express.Router();
projectRouter.post("/new", userValidator, makeProject);
projectRouter.get("/:projectID/members", getMembers);
projectRouter.post("/:projectID/addMember", addMember);
projectRouter.post("/:projectID/sendInvitation", userValidator,sendInvitation);
projectRouter.put("/:projectID/deleteMember", deleteMember);
projectRouter.post("/:projectID/createTask", createTask);
projectRouter.get("/:projectID/get", userValidator, getProject);
projectRouter.delete("/:projectID/deleteProject", userValidator, deleteProject);
projectRouter.get("/:projectID/tasks", getAllTasks);
