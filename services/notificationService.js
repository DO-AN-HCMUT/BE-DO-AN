import { Notification } from '../Schema/schema.js';
import databaseProject from '../mongodb.js';
import { ObjectId } from 'mongodb';
import { NotificationType } from '../constants/index.js';

export const sendNotification = async (recipientIds, type, authorId, targetId) => {
  recipientIds = recipientIds.filter((recipientId) => recipientId.toString() !== authorId.toString());

  if (!recipientIds || recipientIds.length === 0) return;

  try {
    await databaseProject.notification.insertMany(
      recipientIds.map(
        (recipientId) =>
          new Notification({
            recipientId,
            type,
            authorId,
            targetId,
          }),
      ),
    );
  } catch (error) {
    return next(error);
  }
};
export const checkTasksStatus=async(req,res,next)=>{
  const readerId = req.userId;
  try {
    const result = await databaseProject.task.find({status: 'OVERDUE'}).toArray();
    const payload = result.map((item)=> new Notification({
      recipientId: new ObjectId(readerId),
      type: NotificationType.TASK_UPDATE,
      authorId: new ObjectId(item.leaderId),
      targetId:  new ObjectId(item._id)
    }))
    await databaseProject.notification.insertMany(payload);
    return res.json({ payload: {}, success: true, message: 'check tasks status: success' });
  } catch (error) {
    return next(error);
  }
};
export const readAllNotifications = async (req, res, next) => {
  const readerId = req.userId;
  try {
    await databaseProject.notification.updateMany(
      { isRead: false, recipientId: new ObjectId(readerId) },
      { $set: { isRead: true } },
    );
    return res.json({ payload: {}, success: true, message: 'Read  all notifications success' });
  } catch (error) {
    return next(error);
  }
};

export const getAllNotifications = async (req, res, next) => {
  const recipientId = req.userId;

  try {
    const notifications = await databaseProject.notification
      .aggregate([
        {
          $match: { recipientId: new ObjectId(recipientId) },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        { $unwind: '$author' },
        { $unset: 'authorId' },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    // console.log(notifications);

    const targetPopulatedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        switch (notification.type) {
          case NotificationType.TASK_UPDATE:
          case NotificationType.TASK_COMMENT:
          case NotificationType.TASK_ASSIGN:
          case NotificationType.TASK_UNASSIGN: {
            const task = await databaseProject.task.findOne({
              _id: notification.targetId,
            });
            if (notification.type === NotificationType.TASK_UNASSIGN) {
              console.log(notification, task);
            }
            return { ...notification, target: task };
          }

          case NotificationType.PROJECT_INVITE:
          case NotificationType.PROJECT_REMOVE_MEMBER: {
            const project = await databaseProject.project.findOne({
              _id: notification.targetId,
            });
            return { ...notification, target: project };
          }
        }
      }),
    );

    return res.json({ payload: targetPopulatedNotifications, success: true, message: 'Get all notifications success' });
  } catch (error) {
    return next(error);
  }
};
