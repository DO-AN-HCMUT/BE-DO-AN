import express from 'express';
import { userValidator } from '../middleware/validator/userValidator.js';
import { getAllNotifications, readAllNotifications, readById } from '../services/notificationService.js';

export const notificationRouter = express.Router();
notificationRouter.post('/read', userValidator, readAllNotifications);
notificationRouter.post('/:id/read', userValidator, readById);
notificationRouter.get('/my', userValidator, getAllNotifications);
