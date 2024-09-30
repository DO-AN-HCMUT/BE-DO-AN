import { ObjectId } from "mongodb";
import databaseProject from "../mongodb";

export const getAllTask=async(req,res,next)=>{
	const userID=req.userID;
	try {
		const payload=await databaseProject.task.find({registeredMembers:new ObjectId(userID)}).toArray();
		return res.json({
			payload:payload,
			success:true,
			message:'Success'
		})
	} catch (error) {
		return next(error);
	}
}
export const getDetailTask=async(req,res,next)=>{
	const taskID=req.params.id;
	try {
		const payload=await databaseProject.task.findOne({_id:new ObjectId(taskID)});
		return res.json({
			payload:payload,
			success:true,
			message:'Success'
		})
	} catch (error) {
		return next(error);
	}
}