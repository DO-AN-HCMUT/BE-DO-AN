import express from "express";
import { deleteChat, getChat, makeChat } from "../services/chatService.js";
import { userValidator } from "../middleware/validator/userValidator.js";

export const chatRouter=express.Router();

chatRouter.get("/:id",userValidator,getChat)
chatRouter.post("/add",makeChat)
chatRouter.delete("/delete/:id",deleteChat)