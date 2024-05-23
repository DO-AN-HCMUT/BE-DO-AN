import databaseProject from "../mongodb.js"

export const getMe= async (req,res,next)=>{
   try {
    const result= await databaseProject.user.findOne({_id:req.userID});
   return res.json(result);
   } catch (error) {
    return next(error)
   }
}