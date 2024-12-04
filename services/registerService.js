import bcrypt from 'bcrypt';

import { User } from '../Schema/schema.js';
import databaseProject from '../mongodb.js';
import { createTokenLogin } from './loginService.js';
const privateKey = process.env.PRIVATE_KEY;
const hashCount = parseInt(process.env.HASH_COUNT);

async function register(payload) {
  const existingAccount = await databaseProject.user.findOne({
    email: payload.email,
  });
  if (!existingAccount) {
    const encryptPass = bcrypt.hashSync(payload.password, hashCount);
    await databaseProject.user.insertOne(
      new User({
        ...payload,
        password: encryptPass,
      }),
    );
  }
}

export const createRegisterAccess = async (req, res, next) => {
  try {
    const encrypt = { email: req.body.email, password: req.body.password };
    await register(req.body);

    const accessToken = await createTokenLogin(encrypt, privateKey);

    return res.status(200).json({
      message: 'Success',
      payload: { accessToken },
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
