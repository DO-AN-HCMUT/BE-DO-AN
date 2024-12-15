import express from 'express';
import { userValidator } from '../middleware/validator/userValidator.js';
import { readAllNotifications, getAllNotifications } from '../services/notificationService.js';

export const notificationRouter = express.Router();
notificationRouter.post('/read', userValidator, readAllNotifications);
notificationRouter.get('/my', userValidator, getAllNotifications);
