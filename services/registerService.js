import bcrypt from "bcrypt";

import { User } from "../Schema/schema.js";
import databaseProject from "../mongodb.js";
import { createTokenLogin } from "./loginService.js";
const privateKey = process.env.PRIVATE_KEY;
async function register(payload) {
  const existingAccount = await databaseProject.user.findOne({
    email: payload.email,
  });
  console.log(existingAccount);
  if (!existingAccount) {
    const encryptPass = bcrypt.hashSync(payload.password, 10);
    console.log("encrypt", encryptPass);
    await databaseProject.user.insertOne(
      new User({
        username: payload.email,
        password: encryptPass,
        fullName: "",
        email: payload.email,
        gender: "other",
        sex: "",
        role: payload.role || "",
        
      })
    );
  }
  return false;
}

export const createRegisterAccess = async (req, res, next) => {
  try {
    const encrypt = { email: req.body.email, password: req.body.password };
    const insertData = await register(req.body);
    const accessToken = await createTokenLogin(encrypt, privateKey);
   
    return res.json({
      msg: "Success",
      accessToken
    });
  } catch (error) {
    next(error);
  }
};
