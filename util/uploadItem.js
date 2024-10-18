import fs from "fs";
export const uploadItem = (req, res, next) => {
  if (!req.file?.path) {
    return next("invalid path");
  } else {
    const filePath = req.file.path;
    // This will give you the full path to the uploaded file
    console.log("File uploaded to:", filePath);
    // fs.unlinkSync(`${filePath}`);
    return res.json({
      message: "File uploaded successfully",
      payload: filePath,
      success: true,
    });
  }
};
