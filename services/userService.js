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
      const searching = req.query?.searching;
      const listOfProject = await databaseProject.project.find({ $or: [{ leaderID: userID }, { members: userID }] }).toArray();
      let result=listOfProject;
      if(searching){
         result=listOfProject.map((item,index)=>{
            if(item.projectName.includes(searching)){
               return item
            }
         })
      }
      else{
         result=listOfProject;
      }
      if (paging > 0 && paging < result.length()) {
         return res.json({
            payload: result.slice(5 * (paging - 1), 5 * (paging - 1) + 4),
            message: `list of project in page ${paging}`,
            success: true
         })
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