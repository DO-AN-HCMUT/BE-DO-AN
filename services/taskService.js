import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";

export const getAllTask = async (req, res, next) => {
  const userID = req.userID;
  try {
    const payload = await databaseProject.task
      .find({ registeredMembers: { $in: [userID] } })
      .toArray();
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
