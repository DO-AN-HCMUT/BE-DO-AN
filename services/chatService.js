import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";
import { Chat } from "../Schema/schema.js";

export const getChat = async (req, res, next) => {
	try {
		const secondId = req.params.id				
		const result = await databaseProject.chat.findOne({"userIDs": [req.userID,(secondId)]});
		console.log(result);
		
		return res.json({
			payload:result,
			message:"success",
			success:true
		})
	} catch (error) {
		return next(error)
	}
}
export const chatService = (socket) => {
	socket.on("message", (message) => {
		io.emit("broad", message)
	});
}
export const makeChat = async (req, res, next) => {
	try {
		const item = new Chat(req.body)
		await databaseProject.chat.insertOne(item);
		return res.json({
			payload:{},
			message:"success",
			success:true
		})
	} catch (error) {
		return next(error)
	}
}
export const deleteChat=async(req,res,next)=>{
	try {
		const idChat=req.params.id
		await databaseProject.chat.deleteOne({_id:ObjectId(idChat)})
		return res.json({
			payload:{},
			message:"success",
			success:true
		})
	} catch (error) {
		return next(error)
	}
}
