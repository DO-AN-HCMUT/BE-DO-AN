import express from "express";
import { userValidator } from "../middleware/validator/userValidator.js";
import {
  addMessage,
  deleteChat,
  getChat,
  getReceiver,
  makeChat,
} from "../services/chatService.js";

export const chatRouter = express.Router();
chatRouter.get("/all", userValidator, getReceiver);
chatRouter.post("/create", makeChat);
chatRouter.put("/addMess", addMessage);
chatRouter.delete("/:id/delete/", userValidator, deleteChat);
chatRouter.get("/:id", userValidator, getChat);
