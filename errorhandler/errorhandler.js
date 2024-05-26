export const errorHandle=(req,res,err)=>{
    console.log(err);
    if(err){
        console.log("vao");
        return res.status(400).json({msg:err})
    }
}