import jwt from "jsonwebtoken";
import databaseProject from "../../mongodb.js";
const privateKey = process.env.PRIVATE_KEY;
export const checkToken = (privateKey, token) => {
  try {
    if (token !== undefined) {
      
      return jwt.verify(token, privateKey)
    } else {
      console.log("error Token");
      return { error: "error checkToken" };
    }
  } catch (error) {
    return {error:error}
  }
};
export const userValidator = async (req, res, next) => {
  console.log(req.headers);

  const token = req.headers?.authorization?.split(" ")[1];

  console.log(token);
  if (token == "undefined") {
    throw new Error("Access token is undefined");
  } else {
    const userUnit = checkToken(privateKey, token);
    console.log(userUnit);
    if (userUnit.error == undefined) {
      const result = await databaseProject.user.findOne({
        email: userUnit.email,
      });
      if (result) {
        console.log(JSON.stringify(result._id));
        req.userID = result._id;
        return next();
      } else {
        
        return res.status(400).json({
          payload:{},
          message:"Access token is wrong",
          success:false
      });
      }
    }
    else{
      return res.status(400).json({
        payload:{},
        message:userUnit.error,
        success:false
    });
      
    }
  }
};
