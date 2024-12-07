import { ObjectId } from "mongodb";
import databaseProject from "../../mongodb";

export const leaderValidator = async (req, res, next) => {
	try {
		const userId= req.userId;
		const projectId=req.params.projectId;
		const result=await databaseProject.project.findOne({_id:new ObjectId (projectId)})
		if( result.leaderId.toString() === userId){
			return next();
		}
	} catch (error) {
		return res.status(400).json({
			payload: {},
			message: err ?? 'Not Permission',
			success: false,
		});
	}
}