export const errorHandle=(err, req, res,next) => {
    console.log(err,"error handle")
   return  res.status(400).json(
    
    {
        payload:err,
        success:false
    }
)
  }
