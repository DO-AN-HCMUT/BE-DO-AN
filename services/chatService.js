import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";
import { Chat } from "../Schema/schema.js";

export const getChat = async (req, res, next) => {
	try {
		const secondId = req.params.id				
		const result = await databaseProject.chat.findOne({"userIDs": [req.userID,(secondId)]});		
		return res.json({
			payload:result,
			message:"success",
			success:true
		})
	} catch (error) {
		return next(error)
	}
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
		const secondId = req.params.id				
		const result = await databaseProject.chat.findOne({'userIDs': [req.userID,(secondId)]});	
		 await databaseProject.chat.deleteOne({_id:new ObjectId(result._id)})
		return res.json({
			payload:{},
			message:"success",
			success:true
		})
	} catch (error) {
		return next(error)
	}
}
export const getReceiver=async(req,res,next)=>{
	try {		
		const userID=req.userID
		
		const data=await databaseProject.chat.find({"userIDs":{$all:[userID]}}).toArray()
		const result=data?.map((item)=>{
			if(item.userIDs[0] === userID){
				return item.userIDs[1]
			}
			return item.userIDs[0]
		})
		return res.json({
			payload:{sender: userID,receiver:result},
			message:"success",
			success:true
		})
	} catch (error) {
		return next(error)
	}
}
export const addMessage=async(req,res,next)=>{
	try {
		const {sender,receiver,message}=req.body;
		const oldData=await databaseProject.chat.findOne({'userIDs':[sender,receiver]});
		await databaseProject.chat.updateOne({'userIDs':[sender,receiver]},{$set: {message:[...oldData.message,message]}})
		return res.json({
			payload:{},
			message:"success",
			success:true
		})
	} catch (error) {
		return next(error)
	}
}