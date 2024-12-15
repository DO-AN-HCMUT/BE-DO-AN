import { ObjectId } from 'mongodb';
import databaseProject from '../mongodb.js';
import { Project, Task } from '../Schema/schema.js';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import dayjs from 'dayjs';
import { sendNotification } from './notificationService.js';
import { NotificationType } from '../constants/index.js';

export const makeProject = async (req, res, next) => {
  const leaderId = req.userId;
  const { name, key, description } = req.body;

  const newProject = new Project({
    leaderId: new ObjectId(leaderId),
    name,
    key,
    description,
    memberIds: [new ObjectId(leaderId)],
  });

  try {
    await databaseProject.project.insertOne(newProject);
    return res.json({
      payload: newProject,
      success: true,
      message: 'Create success',
    });
  } catch (error) {
    return next(error);
  }
};

export const checkProjectKey = async (req, res, next) => {
  const { key } = req.body;
  try {
    const project = await databaseProject.project.findOne({ key });
    if (project) {
      return res.status(400).json({
        payload: {},
        success: false,
        message: 'Project key is already exist',
      });
    } else {
      return res.json({
        payload: {},
        success: true,
        message: 'Project key is valid',
      });
    }
  } catch (error) {
    return next(error);
  }
};

export const getProject = async (req, res, next) => {
  const userId = req.userId;
  const projectId = req.params.projectId;
  try {
    if (projectId) {
      const result = await databaseProject.project.findOne({
        _id: new ObjectId(projectId),
      });
      return res.json({
        payload: { ...result, isMeLeader: result.leaderId.toString() === userId },
        success: true,
        message: 'Success',
      });
    } else {
      const result = await databaseProject.project
        .find({
          $or: [{ memberIds: { $in: [new ObjectId(userId)] } }, { leaderId: new ObjectId(userId) }],
        })
        .toArray();
      return res.json({
        payload: { ...result, isMeLeader: result.leaderId.toString() === userId },
        success: true,
        message: 'Success',
      });
    }
  } catch (error) {
    return next(error);
  }
};

export const addMembers = async (req, res, next) => {
  const projectId = req.params?.projectId;
  const { memberEmails } = req.body;

  try {
    const project = await databaseProject.project.findOne({
      _id: new ObjectId(projectId),
    });

    if (!project) {
      return next('Project not found');
    }

    const membersToAdd = await databaseProject.user
      .find({
        email: { $in: memberEmails },
      })
      .toArray();

    await databaseProject.project.updateOne(
      { _id: new ObjectId(projectId) },
      { $set: { memberIds: Array.from(new Set([...project.memberIds, ...membersToAdd.map((member) => member._id)])) } },
    );

    await sendNotification(
      membersToAdd.map((member) => member._id),
      NotificationType.PROJECT_INVITE,
      project.leaderId,
      project._id,
    );

    return res.json({
      payload: {},
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyMember = async (req, res, next) => {
  const projectId = req.params?.projectId;
  const memberId = req.query?.memberId;
  const userId = req.userId;
  if (memberId === 'undefined') {
    return next('Error');
  } else if (memberId !== userId) {
    return next('You are not invited');
  }
  try {
    const project = await databaseProject.project.findOne({
      _id: new ObjectId(projectId),
    });

    if (!project) {
      return next('Project not found');
    }

    const newMemberIds = project.memberIds.filter((id) => id === userId);
    if (newMemberIds.length <= 0) {
      await databaseProject.project.updateOne(
        { _id: new ObjectId(projectId) },
        { $set: { memberIds: [...project.memberIds, userId] } },
      );
    }

    return res.json({
      payload: {},
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteMember = async (req, res, next) => {
  const projectId = req.params?.projectId;
  const { memberIds } = req.body;
  try {
    const project = await databaseProject.project.findOne({
      _id: new ObjectId(projectId),
    });

    if (!project) {
      return next('Project not found');
    }

    if (memberIds.includes(project.leaderId.toString())) {
      return next('Cannot delete leader');
    }

    const oldMemberIds = project?.memberIds.filter((id) => !memberIds.includes(id.toString()));

    await databaseProject.project.updateOne({ _id: new ObjectId(projectId) }, { $set: { memberIds: oldMemberIds } });
    await databaseProject.task.updateMany(
      { registeredMembers: { $in: memberIds.map((id) => new ObjectId(id)) } },
      { $pull: { registeredMembers: { $in: memberIds.map((id) => new ObjectId(id)) } } },
    );

    await sendNotification(
      memberIds.map((id) => new ObjectId(id)),
      NotificationType.PROJECT_REMOVE_MEMBER,
      project.leaderId,
      project._id,
    );

    return res.json({
      payload: {},
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  const projectId = req.params?.projectId;
  try {
    await databaseProject.project.deleteOne({ _id: new ObjectId(projectId) });
    await databaseProject.task.deleteMany({ projectId: projectId });
    return res.json({
      payload: {},
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};

export const createTask = async (req, res, next) => {
  const projectId = req.params?.projectId;
  const taskDetail = req.body;

  const project = await databaseProject.project.findOne({
    _id: new ObjectId(projectId),
  });

  const key = project.key + '-' + (project.taskMaxIndex + 1);

  try {
    const taskItem = new Task({
      ...taskDetail,
      registeredMembers: taskDetail.registeredMembers.map((member) => new ObjectId(member)),
      projectId: new ObjectId(projectId),
      key,
    });
    const result = await databaseProject.task.insertOne(taskItem);
    const insertId = result.insertedId;
    await databaseProject.project.updateOne(
      { _id: new ObjectId(projectId) },
      { $set: { taskMaxIndex: project.taskMaxIndex + 1 } },
    );
    await sendNotification(
      taskDetail.registeredMembers.map((member) => new ObjectId(member)),
      NotificationType.TASK_ASSIGN,
      new ObjectId(req.userId),
      insertId,
    );
    return res.json({
      payload: {},
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};

export const getMembers = async (req, res, next) => {
  const projectId = req.params.projectId;
  const search = req.query?.search;

  try {
    const project = await databaseProject.project.findOne({
      _id: new ObjectId(projectId),
    });

    if (!project) {
      return next('Project not found');
    }

    const members = await databaseProject.user
      .aggregate([
        {
          $match: {
            _id: { $in: project.memberIds.map((id) => new ObjectId(id)) },
            fullName: { $regex: search || '', $options: 'i' },
          },
        },
      ])
      .toArray();

    return res.json({
      payload: members.map((member) => ({
        ...member,
        isLeader: member._id.toString() === project.leaderId.toString(),
      })),
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const result = (
      await Promise.all(
        (await databaseProject.task.find({ projectId: { $in: [new ObjectId(projectId)] } }).toArray()).map(
          async (item) => {
            const userIds = item.registeredMembers;
            const users = await databaseProject.user
              .find({
                _id: { $in: userIds.map((id) => new ObjectId(id)) },
              })
              .toArray();

            return { ...item, registeredMembers: users };
          },
        ),
      )
    ).map((item) => {
      return {
        ...item,
        status: dayjs(item.endDate).isBefore(new Date(), 'day') && item.status !== 'DONE' ? 'OVERDUE' : item.status,
      };
    });
    return res.json({
      payload: result,
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};
// mail
const contractMail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lightwing2208@gmail.com',
    pass: process.env.PASS_MAIL,
  },
});
contractMail.verify((error) => {
  if (error) {
    console.log(error);
    // return next(error)
  } else {
    console.log('ready to send');
  }
});

export const sendInvitation = async (req, res, next) => {
  const inviterMail = req.userMail;
  const { guestMail, projectName } = req.body;
  const guestDetail = await databaseProject.user.findOne({ email: guestMail });
  let guestId;
  if (guestDetail) {
    guestId = guestDetail._id;
  }
  const projectId = req.params.projectId;
  if (!projectName) {
    return next('Missing parameter: projectName');
  }
  const template = fs
    .readFileSync(path.resolve('mailTemplate/invitation.html'), 'utf-8')
    .replaceAll('{{projectName}}', projectName)
    .replace('{{inviter}}', inviterMail)
    .replace('{{projectId}}', projectId)
    .replace('{{memberId}}', guestId);
  const sentMail = {
    from: 'lightwing2208@gmail.com',
    to: guestMail,
    subject: 'INVITATION',
    html: template,
  };
  contractMail.sendMail(sentMail, (error) => {
    if (error) {
      return next(error);
    } else {
      return res.json({
        payload: {},
        success: true,
        message: 'Success',
      });
    }
  });
};
