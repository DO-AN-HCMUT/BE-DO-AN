import express from "express";
import { deleteChat, getAllChat, getChat, makeChat } from "../services/chatService.js";
import { userValidator } from "../middleware/validator/userValidator.js";

export const chatRouter=express.Router();

chatRouter.get("/:id",userValidator,getChat)
chatRouter.get("/all",userValidator,getAllChat)
chatRouter.post("/add",makeChat)
chatRouter.delete("/delete/:id",deleteChat)