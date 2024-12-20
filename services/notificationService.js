import { Notification } from '../Schema/schema.js';
import databaseProject from '../mongodb.js';
import { ObjectId } from 'mongodb';
import { NotificationType } from '../constants/index.js';

export const sendNotification = async (recipientIds, type, authorId, targetId) => {
  recipientIds = recipientIds.filter((recipientId) =>
    authorId ? recipientId.toString() !== authorId.toString() : true,
  );

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

export const readById = async (req, res, next) => {
  const notificationId = req.params.id;
  try {
    await databaseProject.notification.updateOne({ _id: new ObjectId(notificationId) }, { $set: { isRead: true } });
    return res.json({ payload: {}, success: true, message: 'Read notification by id success' });
  } catch (error) {
    return next(error);
  }
};

export const getAllNotifications = async (req, res, next) => {
  const recipientId = req.userId;
  try {
    const notifications = await Promise.all(
      (
        await databaseProject.notification
          .aggregate([
            {
              $match: { recipientId: new ObjectId(recipientId) },
            },
            { $sort: { createdAt: -1 } },
          ])
          .toArray()
      ).map(async (notification) => ({
        ...notification,
        author: notification.authorId ? await databaseProject.user.findOne({ _id: notification.authorId }) : null,
      })),
    );

    const targetPopulatedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        switch (notification.type) {
          case NotificationType.TASK_UPDATE:
          case NotificationType.TASK_COMMENT:
          case NotificationType.TASK_ASSIGN:
          case NotificationType.TASK_UNASSIGN:
          case NotificationType.TASK_OVERDUE: {
            const task = await databaseProject.task.findOne({
              _id: notification.targetId,
            });
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
    return res.json({
      payload: targetPopulatedNotifications,
      success: true,
      message: 'Get all notifications success',
    });
  } catch (error) {
    return next(error);
  }
};
