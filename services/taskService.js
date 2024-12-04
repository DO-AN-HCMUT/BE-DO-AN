import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";

export const getAllTask = async (req, res, next) => {
  const userId = req.userId;

  const search = req.query?.search;

  try {
    const payload = await databaseProject.task.aggregate([
      {
        '$lookup': {
          'from': 'project',
          'localField': 'projectId',
          'foreignField': '_id',
          'as': 'project'
        }
      },
      {
        '$match':{
          registeredMembers: {
            $in: [new ObjectId(userId)]
          },
          $or: [
            {
              title: { $regex: search ?? '' , $options: "i" }
            },
            { key: { $regex: search ?? '' , $options: "i" } }
          ]
        }
      },
      {
        '$sort': {
          'endDate': -1
        }
      }
    ]).toArray();

    return res.json({
      payload,
      success: true,
      message: "Success",
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
    const getUser=await databaseProject.user.find({_id:{$in: payload.registeredMembers.map((item)=> new ObjectId(item))}}).toArray();

    return res.json({
      payload: {...payload,memberDetail:getUser},
      success: true,
      message: "Success",
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
      { $set: {...contentUpdate,registeredMembers:contentUpdate.registeredMembers.map((item)=> new ObjectId(item)),endDate:new Date(contentUpdate.endDate)} },
    );
    return res.json({
      payload: {},
      success: true,
      message: "Success",
    });
  } catch (error) {
    return next(error);
  }
};
export const deleteTask = async (req, res, next) => {
  const projectId = req.query?.projectId;
  const taskId = req.params.id;
  try {
    const oldData = await databaseProject.project.findOne({ _id: new ObjectId(projectId) })[0];
    const newTasks = oldData.taskIds.filters((item) => item !== taskId);
    await databaseProject.project.updateOne({ _id: new ObjectId(projectId) }, { $set: { 'taskIds': newTasks } });
    return res.json({
      payload: {},
      success: true,
      message: "Success",
    });
  } catch (error) {
    return next(error);
  }
}