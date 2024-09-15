import databaseProject from "../mongodb.js";
import { Project } from "../Schema/schema.js";

export const makeProject=async(req,res,next)=>{
	const leaderID=req.userID;
	const {members,taskIDs}=req.body;
	const projectItem=new Project({
		members,taskIDs,leaderID
	})
	try {
		await databaseProject.project.insertOne(projectItem);
		return res.json({
			payload:{},
			success:true,
			message:'Create success'
		})
	} catch (error) {
		return next(error)
	}
}