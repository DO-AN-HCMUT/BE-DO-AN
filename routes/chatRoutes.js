import express from "express";
import { getChat } from "../services/chatService";

export const chatRouter=express.Router();

chatRouter.get("/:id",getChat)