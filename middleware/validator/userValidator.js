import jwt from "jsonwebtoken";
import databaseProject from "../../mongodb.js";
const privateKey = process.env.PRIVATE_KEY;
export const checkToken = (privateKey, token) => {
  try {
    if (token !== undefined) {
      return {
        payload: jwt.verify(token, privateKey),
        message: "Success",
        success: true,
      };
    } else {
      const error = "error checkToken";

      return {
        payload: {},
        message: error,
        success: false,
      };
    }
  } catch (error) {
    return {
      payload: {},
      message: error,
      success: false,
    };
  }
};
export const userValidator = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (token == "undefined") {
    return {
      payload: {},
      message: "Access token is undefined",
      success: false,
    };
  } else {
    const userUnit = checkToken(privateKey, token);
    if (userUnit.success) {
      const result = await databaseProject.user.findOne({
        email: userUnit.payload.email,
      });
      if (result) {
        req.userID = result._id.toString();
        req.userMail = result.email;

        return next();
      } else {
        return res.status(400).json({
          payload: {},
          message: "Access token is wrong",
          success: false,
        });
      }
    } else {      
      return res.status(400).json({
        payload: {},
        message: userUnit.message.name,
        success: false,
      });
    }
  }
};
