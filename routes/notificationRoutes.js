import express from 'express';
import { userValidator } from '../middleware/validator/userValidator.js';
import { checkTasksStatusOverdue, getAllNotifications, readAllNotifications } from '../services/notificationService.js';

export const notificationRouter = express.Router();
notificationRouter.post('/check', userValidator, checkTasksStatusOverdue);
notificationRouter.post('/read', userValidator, readAllNotifications);
notificationRouter.get('/my', userValidator, getAllNotifications);
