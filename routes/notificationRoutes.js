import express from 'express';
import { userValidator } from '../middleware/validator/userValidator.js';
import { readAllNotifications, getAllNotifications, checkTasksStatus } from '../services/notificationService.js';

export const notificationRouter = express.Router();
notificationRouter.post('/check', userValidator, checkTasksStatus);
notificationRouter.post('/read', userValidator, readAllNotifications);
notificationRouter.get('/my', userValidator, getAllNotifications);
