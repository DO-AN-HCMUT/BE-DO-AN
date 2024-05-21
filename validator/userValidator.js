import jwt from "jsonwebtoken";
import databaseProject from "../mongodb";
const privateKey = process.env.PRIVATE_KEY;
export const checkToken = (privateKey, token) => {
  if (token !== undefined) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, privateKey, (err, token) => {
        if (err) {
          throw reject(err);
        }
        resolve(token);
      });
    });
  } else {
    console.log("error Token");
    return { err: "error checkToken" };
  }
};
export const userValidator = async (req, res, next) => {
  console.log(req.headers);

  const token = req.headers?.authorization?.split(" ")[1];

  console.log(token);
  if (token == "undefined") {
    throw new Error("Access token is undefined");
  } else {
    const userUnit = await checkToken(privateKey, token);

    if (userUnit) {
      const result = await databaseProject.user.findOne({
        email: userUnit.email,
      });
      if (result) {
        console.log(result._id.valueOf());
        req.userID = result._id.valueOf();
        return next();
      } else {
        return res.json({ err: "Access token is wrong" });
      }
    }
  }
};
