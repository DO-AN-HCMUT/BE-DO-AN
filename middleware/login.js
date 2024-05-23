import { checkSchema, validationResult } from "express-validator";

import bcrypt from "bcrypt";
import databaseProject from "../mongodb.js";
export const validator = (schema) => {
    return async (req, res, next) => {
      console.log(req);
      await schema.run(req);
      const error = validationResult(req).mapped();
      if (Object.values(error).length > 0) {
        // next(error);
        return res.json({ error });
      }
      next();
    };
  };
export const validateRegister = validator(
    checkSchema(
      {
        email: {
          errorMessage: "Invalid email",
          isEmail: true,
          custom: {
            options: async (value, { req }) => {
              const isExist = await databaseProject.user.findOne({
                email: value,
              });
  
              if (isExist) {
                throw new Error("Email is already existed");
              }
              return true;
            },
          },
        },
        password: {
          trim: true,
          isLength: {
            options: { min: 8 },
            errorMessage: "Password should be at least 8 chars",
          },
        },
        confirmPassword: {
          trim: true,
          isLength: {
            options: { min: 8 },
            errorMessage: "Password should be at least 8 chars",
          },
  
          custom: {
            options: (value, { req }) => {
              if (value !== req.body.password) {
                throw new Error("Confirm password must be same as password");
              }
              return true;
            },
          },
        },
      },
      ["body"]
    )
  );
export const loginValidator = validator(
    checkSchema(
      {
        email: {
          errorMessage: "Invalid email",
          isEmail: true,
          custom: {
            options: async (value) => {
              const isUserExist = await databaseProject.user.findOne({
                email: value,
              });
  
              if (isUserExist) {    
                return true
              } else {
  
                throw new Error("Email is not registered");
  
              }
            },
          },
        },
        password: {
          trim: true,
          isLength: {
            options: { min: 8 },
            errorMessage: "Password should be at least 8 chars",
          },
          custom: {
  
            options: async (value, { req }) => {
              let checked = false;
              const userLogin = await databaseProject.user.findOne({
                email: req.body.email,
              });
              if(userLogin){
                checked = bcrypt.compareSync(value, userLogin.password)
              console.log(checked);
              if (checked == true) {
                return true
              }
              else { throw new Error(" PASSWORD DOES NOT MATCH") }
              }
              
  
  
            },
          },
        },
      },
      ["body"]
    )
  );