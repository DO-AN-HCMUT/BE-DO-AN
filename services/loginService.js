import axios from 'axios';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import { checkToken } from '../middleware/validator/userValidator.js';
import databaseProject from '../mongodb.js';
import { User } from '../Schema/schema.js';
const privateKey = process.env.PRIVATE_KEY;
const hashCount = parseInt(process.env.HASH_COUNT);
const FEUrl = process.env.FE_URL;
async function checkAccount(payload) {
  const existingAccount = await databaseProject.user.findOne({
    email: payload.email,
  });
  if (!existingAccount) {
    const encryptPass = bcrypt.hashSync(payload.password, hashCount);
    await databaseProject.user.insertOne(
      new User({
        password: encryptPass,
        fullName: payload.email.split('@')[0],
        email: payload.email,
      }),
    );
  }
}
export const createTokenLogin = (data, privateKey) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ email: data.email, password: data.password }, privateKey, { expiresIn: '365d' }, (err, token) => {
      if (err) {
        reject(err.message);
      }
      resolve(token);
    });
  });
};
export const createLoginAccess = async (req, res, next) => {
  try {
    const encrypt = { email: req.body.email, password: req.body.password };

    const token = await createTokenLogin(encrypt, privateKey);

    return res.json({
      message: 'Success',
      payload: { accessToken: token },
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const createOAuthAccess = async (req, res, next) => {
  try {
    const data = await getOauthGoogleToken(req.query.code);
    //return res.json(data)
    const { id_token, access_token } = data;
    const googleUser = await getGoogleUser({ id_token, access_token });
    const email = googleUser.email;
    const encrypt = { email: email, password: 'Google' };
    await checkAccount(encrypt);
    const token = await createTokenLogin(encrypt, privateKey);
    return res.redirect(`${FEUrl}/auth/sign-in?accessToken=${token}`);
  } catch (error) {
    return next(error);
  }
};
const getOauthGoogleToken = async (code) => {
  const body = {
    code,
    client_id: process.env.NEXT_PUBLIC_CLIENT_Id,
    client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL,
    grant_type: 'authorization_code',
  };
  const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return data;
};

/**
 * Hàm này thực hiện gửi yêu cầu lấy thông tin người dùng từ Google dựa trên Google OAuth token.
 * @param {Object} tokens - Đối tượng chứa Google OAuth token.
 * @param {string} tokens.id_token - Id token được lấy từ Google OAuth.
 * @param {string} tokens.access_token - Access token được lấy từ Google OAuth.
 * @returns {Object} - Đối tượng chứa thông tin người dùng từ Google.
 */
const getGoogleUser = async ({ id_token, access_token }) => {
  const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
    params: {
      access_token,
      alt: 'json',
    },
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });
  return data;
};
export const checkTokenProcess = async (req, res, next) => {
  const token = req.headers?.authorization?.split(' ')[1];
  if (token == 'undefined') {
    return res.json({
      payload: {},
      message: 'Access token is undefined',
      success: false,
    });
  } else {
    const userUnit = checkToken(privateKey, token);
    if (userUnit.success) {
      return res.status(200).json({
        payload: {},
        message: 'Success',
        success: true,
      });
    } else {
      return res.status(400).json({
        payload: {},
        message: userUnit.message,
        success: false,
      });
    }
  }
};
