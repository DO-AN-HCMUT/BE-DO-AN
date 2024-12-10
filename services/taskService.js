import { ObjectId } from 'mongodb';
import databaseProject from '../mongodb.js';
import { Comment } from '../Schema/schema.js';
import dayjs from 'dayjs';

export const getAllTask = async (req, res, next) => {
  const userId = req.userId;

  const search = req.query?.search;
  const dueToday = req.query?.dueToday === 'true';

  try {
    const payload = (
      await databaseProject.task
        .aggregate([
          {
            $match: {
              registeredMembers: {
                $in: [new ObjectId(userId)],
              },
              $or: [
                {
                  title: { $regex: search ?? '', $options: 'i' },
                },
                { key: { $regex: search ?? '', $options: 'i' } },
              ],
              ...(dueToday
                ? {
                    endDate: {
                      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                      $lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                  }
                : {}),
            },
          },
          {
            $lookup: {
              from: 'project',
              localField: 'projectId',
              foreignField: '_id',
              as: 'project',
            },
          },
          {
            $unwind: '$project',
          },
          {
            $sort: {
              endDate: -1,
            },
          },
        ])
        .toArray()
    ).map((item) => {
      return {
        ...item,
        status: dayjs(item.endDate).isBefore(new Date(), 'day') && item.status !== 'DONE' ? 'OVERDUE' : item.status,
      };
    });

    return res.json({
      payload,
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};
export const getDetailTask = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const payload = await databaseProject.task.findOne({
      _id: new ObjectId(taskId),
    });
    payload.status =
      dayjs(payload.endDate).isBefore(new Date(), 'day') && payload.status !== 'DONE' ? 'OVERDUE' : payload.status;
    const getUser = await databaseProject.user
      .find({ _id: { $in: payload.registeredMembers.map((item) => new ObjectId(item)) } })
      .toArray();

    return res.json({
      payload: { ...payload, memberDetail: getUser },
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};
export const updateTask = async (req, res, next) => {
  const taskId = req.params.id;
  const contentUpdate = req.body.payload;
  try {
    await databaseProject.task.updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: {
          ...contentUpdate,
          registeredMembers: contentUpdate.registeredMembers.map((item) => new ObjectId(item)),
          endDate: new Date(contentUpdate.endDate),
        },
      },
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
export const deleteTask = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    await databaseProject.task.deleteOne({ _id: new ObjectId(taskId) });
    return res.json({
      payload: {},
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};

export const commentTask = async (req, res, next) => {
  const taskId = req.params.id;
  const content = req.body.content;
  const userId = req.userId;

  console.log(taskId, content, userId);

  try {
    if (!taskId) {
      return next('taskId is required');
    }

    if (!content) {
      return next('content is required');
    }

    await databaseProject.comment.insertOne(
      new Comment({
        taskId: new ObjectId(taskId),
        createdBy: new ObjectId(userId),
        content,
      }),
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

export const updateComment = async (req, res, next) => {
  const commentId = req.params.id;
  const content = req.body.content;
  try {
    if (!commentId) {
      return next('commentId is required');
    }

    if (!content) {
      return next('content is required');
    }

    await databaseProject.comment.updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content,
          hasUpdated: true,
        },
      },
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

export const deleteComment = async (req, res, next) => {
  const commentId = req.params.id;
  try {
    if (!commentId) {
      return next('commentId is required');
    }

    await databaseProject.comment.deleteOne({ _id: new ObjectId(commentId) });
    return res.json({
      payload: {},
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};

export const getComments = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    if (!taskId) {
      return next('taskId is required');
    }

    const comments = await databaseProject.comment
      .find({ taskId: new ObjectId(taskId) })
      .sort({ createdAt: -1 })
      .toArray();

    const users = await databaseProject.user
      .find({ _id: { $in: comments.map((item) => new ObjectId(item.createdBy)) } })
      .toArray();

    return res.json({
      payload: comments.map((item) => {
        const author = users.find((user) => user._id.toString() === item.createdBy.toString());
        return {
          ...item,
          author,
        };
      }),
      success: true,
      message: 'Success',
    });
  } catch (error) {
    return next(error);
  }
};
