import express from 'express';
import { upload } from '../middleware/multer.js';
import { userValidator } from '../middleware/validator/userValidator.js';
import { deleteTask, getAllTask, getDetailTask, updateTask } from '../services/taskService.js';
import { uploadItem } from '../util/uploadItem.js';
export const taskRoutes = express.Router();

taskRoutes.get('/:id/getDetail', getDetailTask);
taskRoutes.get('/getAll', userValidator, getAllTask);
taskRoutes.post('/upload', upload.single('file'), uploadItem);
taskRoutes.put('/:id/update', updateTask);
taskRoutes.delete('/:id/delete', deleteTask);
