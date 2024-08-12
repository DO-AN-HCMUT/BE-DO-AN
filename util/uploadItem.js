import fs from "fs"
export const uploadItem = (req, res, next) => {
	
	if (!req.file?.path) {
		return next("invalid path")
	}
	else {
		const filePath = req.file.path;
		console.log(filePath);
		// This will give you the full path to the uploaded file
		console.log('File uploaded to:', filePath);
		fs.unlink(`${filePath}`, (error) => {
			return next(error)
		})
		return res.json({ message: 'File uploaded successfully', filePath: filePath });

	}


}