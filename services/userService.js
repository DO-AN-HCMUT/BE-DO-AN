import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";

export const getMe = async (req, res, next) => {
   try {
      const result = await databaseProject.user.findOne({ _id: new ObjectId(req.userID) });
      console.log(req.userID);

      return res.status(200).json({
         payload: result,
         message: "Success",
         success: true
      });
   } catch (error) {
      return next(error)
   }
}
export const getDetail = async (req, res, next) => {
   try {

      const result = await databaseProject.user.findOne({ _id: new ObjectId(req.params.id) });

      return res.status(200).json({
         payload: result,
         message: "Success",
         success: true
      });
   } catch (error) {
      return next(error)
   }
}
export const updateProfile = async (req, res, next) => {
   try {
      const userID = req.userID;
      await databaseProject.user.updateOne({ _id: new ObjectId(userID) }, { $set: req.body });
      return res.json({
         payload: {},
         message: "Success",
         success: true
      });
   } catch (error) {
      return next(error);
   }
}
export const getAllProject = async (req, res, next) => {
   try {
      const userID = req.userID;
      const paging = Number(req.query?.paging);
      const searching = (req.query?.searching);

      const listOfProject = await databaseProject.project.find({ $or: [{ leaderID: userID }, { members: userID }] }).toArray();
      console.log('userID', userID);

      let result = listOfProject;
      if (searching) {
         result = listOfProject.filter((item, index) => {
            if (item.projectName.includes(decodeURI(searching))) {
               return true
            }
            return false
         })
      }
      else {
         result = listOfProject;
      }
      if (paging) {
         if (paging > 0) {
            return res.json({
               payload: result.slice(5 * (paging - 1), 5 * (paging - 1) + 4),
               message: `list of project in page ${paging}`,
               success: true
            })
         }
         else {
            return next('error: paging query')
         }
      }
      else {
         return res.json({
            payload: result,
            message: `list of project`,
            success: true
         })
      }

   } catch (error) {
      return next(error);
   }
}
export const getAllFriend=async (req,res,next)=>{
   try {
      const userID=req.userID;
      const projectListOwner=await databaseProject.project.find({leaderID:userID}).toArray();
      const projectListMember=await databaseProject.project.find({members:userID}).toArray();
      Promise.all(
         [projectListMember,projectListOwner]
      )
      let friendList=[];
      projectListOwner.forEach((item,index)=>{
         if(friendList.filter((childItem)=>item.members.includes(childItem)).length<=0){
            friendList.push(...item.members);           
         }
         
      })
      projectListMember.forEach((item,index)=>{
         if(!friendList.includes(item.leaderID)){
            friendList.push(item.leaderID)            
         }
      })
      return res.json({
         payload: friendList,
         message: `list user's friend`,
         success: true
      })
   } catch (error) {
      return next(error)
   }
}