import express from 'express';
import { upload } from '../middleware/multer.js';
import { userValidator } from '../middleware/validator/userValidator.js';
import { getAllFriend, getAllProject, getDetail, getMe, updateProfile } from '../services/userService.js';
import { uploadAvatar } from '../util/uploadItem.js';

export const userRoutes = express.Router();

userRoutes.get('/me', userValidator, getMe);
userRoutes.get('/friend', userValidator, getAllFriend);
userRoutes.get('/projects', userValidator, getAllProject);
userRoutes.put('/update', userValidator, updateProfile);
userRoutes.post('/uploadImg', upload.single('file'), userValidator, uploadAvatar);
userRoutes.get('/:id', getDetail);
