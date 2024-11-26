import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";

export const getAllTask = async (req, res, next) => {
  const userID = req.userID;

  const search = decodeURI(req.query?.search);
  try {
    // const payload = await databaseProject.task
    //   .find({ registeredMembers: { $in: [userID] },title: { $regex: search || "", $options: "i" } })
    //   .toArray();
    const payload = await databaseProject.task.aggregate([
      {
        '$addFields': {
          'lookupField': {
            '$toObjectId': '$projectID'
          }
        }
      }, {
        '$lookup': {
          'from': 'project',
          'localField': 'lookupField',
          'foreignField': '_id',
          'as': 'result'
        }
      }, {
        '$match': {
          'registeredMembers': [userID],
          $or: [
            { title: { $regex: search, $options: "i" } },
            { code: { $regex: search, $options: "i" } }
          ]
        }
      }, {
        '$sort': {
          'endDate': -1
        }
      }
    ]).toArray()
    return res.json({
      payload: payload,
      success: true,
      message: "Success",
    });
  } catch (error) {
    return next(error);
  }
};
export const getDetailTask = async (req, res, next) => {
  const taskID = req.params.id;
  try {
    const payload = await databaseProject.task.findOne({
      _id: new ObjectId(taskID),
    });
    return res.json({
      payload: payload,
      success: true,
      message: "Success",
    });
  } catch (error) {
    return next(error);
  }
};
export const updateTask = async (req, res, next) => {
  const taskID = req.params.id;
  const contentUpdate = req.body;
  try {
    await databaseProject.task.updateOne(
      { _id: new ObjectId(taskID) },
      { $set: contentUpdate },
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
  const projectID = req.query?.projectID;
  const taskID = req.params.id;
  try {
    const oldData = await databaseProject.project.findOne({ _id: new ObjectId(projectID) })[0];
    const newTasks = oldData.taskIDs.filters((item) => item !== taskID);
    await databaseProject.project.updateOne({ _id: new ObjectId(projectID) }, { $set: { 'taskIDs': newTasks } });
    return res.json({
      payload: {},
      success: true,
      message: "Success",
    });
  } catch (error) {
    return next(error);
  }
}