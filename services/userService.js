import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";

export const getMe= async (req,res,next)=>{
   try {
    const result= await databaseProject.user.findOne({_id:new ObjectId(req.userID)});  
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
export const getDetail= async (req,res,next)=>{
   try {
   
    const result= await databaseProject.user.findOne({_id: new ObjectId(req.params.id)});
    
   return res.status(200).json({
      payload: result,
      message: "Success",
      success: true
    });
   } catch (error) {
    return next(error)
   }
}
export const updateProfile= async (req,res,next)=>{
   try {
      const userID=req.userID;
      await databaseProject.user.updateOne({_id:new ObjectId(userID)},{$set:req.body});
      return res.json({
         payload: {},
         message: "Success",
         success: true
       });
   } catch (error) {
      return next(error);
   }
}