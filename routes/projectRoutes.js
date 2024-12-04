import express from 'express';
import { userValidator } from '../middleware/validator/userValidator.js';
import {
  addMember,
  getMembers,
  createTask,
  deleteMember,
  deleteProject,
  getProject,
  makeProject,
  getAllTasks,
  sendInvitation,
  verifyMember,
  checkProjectKey,
} from '../services/projectService.js';

export const projectRouter = express.Router();
projectRouter.post('/new', userValidator, makeProject);
projectRouter.post('/key', checkProjectKey);
projectRouter.get('/:projectId/members', getMembers);
projectRouter.post('/:projectId/addMember', addMember);
projectRouter.post('/:projectId/verify', userValidator, verifyMember);
projectRouter.post('/:projectId/sendInvitation', userValidator, sendInvitation);
projectRouter.put('/:projectId/deleteMember', deleteMember);
projectRouter.post('/:projectId/createTask', createTask);
projectRouter.get('/:projectId/get', userValidator, getProject);
projectRouter.delete('/:projectId/deleteProject', userValidator, deleteProject);
projectRouter.get('/:projectId/tasks', getAllTasks);
