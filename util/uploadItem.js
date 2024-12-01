import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';
import databaseProject from "../mongodb.js";
import { ObjectId } from "mongodb";
const uploadCloudinary = async (item) => {
  try {
    const uploadResult = await cloudinary.uploader
      .upload(
        `${item}`
      )
      .catch((error) => {
        console.log(error);
      });
    const optimizeUrl = cloudinary.url(`${uploadResult.public_id}`, {
      fetch_format: 'auto',
      quality: 'auto'
    });
    return optimizeUrl
  } catch (error) {
    return false
  }
}
export const uploadAvatar = async (req, res, next) => {
  // Configuration
  const userId=req.userId;

  cloudinary.config({
    cloud_name: 'drjfybihf',
    api_key: '769694336124359',
    api_secret: `${process.env.CLOUDINARY_KEY}` // Click 'View API Keys' above to copy your API secret
  });

  if (!req.file?.path) {
    return next("invalid path");
  } else {

    const filePath = req.file.path;
    try {

      const result = await uploadCloudinary(filePath);

      if (typeof result == 'boolean') {
        return next('Error: upload to Cloudinary');
      }
      console.log(result);

      fs.unlinkSync(`${filePath}`);
      await databaseProject.user.updateOne({_id:new ObjectId(userId)},{$set:{avatar:result}});
      return res.json({
        message: "File uploaded successfully",
        payload: {},
        success: true,
      });

    } catch (error) {
      return next(error);
    }
  }
};

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