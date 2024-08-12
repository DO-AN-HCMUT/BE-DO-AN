import fs from "fs"
export const uploadItem=(req,res,next)=>{
	const filePath = req.file.path; // This will give you the full path to the uploaded file
	console.log('File uploaded to:', filePath);
	fs.unlink(`${filePath}`,(error)=>{
		console.log(error);
		
	})
	res.json({ message: 'File uploaded successfully', filePath: filePath });
}