import databaseProject from "../mongodb.js";

export const getMe= async (req,res,next)=>{
   try {
    const result= await databaseProject.user.findOne({_id:req.userID});
    console.log(result);
    
   return res.status(200).json({payload:result});
   } catch (error) {
    return next(error)
   }
}
