import express from "express";
import { addMessage, deleteChat, getAllChat, getChat, makeChat } from "../services/chatService.js";
import { userValidator } from "../middleware/validator/userValidator.js";

export const chatRouter=express.Router();
chatRouter.get("/all",userValidator,getAllChat)
chatRouter.get("/:id",userValidator,getChat)
chatRouter.post("/add",makeChat)
chatRouter.put("/addMess",addMessage)
chatRouter.delete("/delete/:id",deleteChat)