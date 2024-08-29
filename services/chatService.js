export const getChat=(req,res,next)=>{
	const id= req.params.id
	return res.json(id)
	
}