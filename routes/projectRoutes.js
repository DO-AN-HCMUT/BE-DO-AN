import express from 'express';
import { userValidator } from '../middleware/validator/userValidator.js';
import {
  addMembers,
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
import { leaderValidator } from '../middleware/validator/leaderValidator.js';

export const projectRouter = express.Router();
projectRouter.post('/new', userValidator, makeProject);
projectRouter.post('/key', checkProjectKey);
projectRouter.get('/:projectId/members', getMembers);
projectRouter.post('/:projectId/addMembers', addMembers);
projectRouter.post('/:projectId/verify', userValidator, verifyMember);
projectRouter.post('/:projectId/sendInvitation', userValidator, sendInvitation);
projectRouter.put('/:projectId/members', deleteMember);
projectRouter.post('/:projectId/createTask', userValidator, createTask);
projectRouter.get('/:projectId/get', userValidator, getProject);
projectRouter.delete('/:projectId/deleteProject', userValidator, leaderValidator, deleteProject);
projectRouter.get('/:projectId/tasks', getAllTasks);
