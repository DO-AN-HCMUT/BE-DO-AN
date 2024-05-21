export const errorHandle=(req,res,err)=>{
    if(err){
        console.log("next:err",err);
        return res.json({"error":err})
    }
}