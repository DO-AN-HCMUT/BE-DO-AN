import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";
import { Project, Task } from "../Schema/schema.js";

export const makeProject = async (req, res, next) => {
  const leaderID = req.userID;
  const { members, taskIDs, projectName } = req.body;
  const projectItem = new Project({
    members,
    taskIDs,
    leaderID,
    projectName,
  });
  try {
    await databaseProject.project.insertOne(projectItem);
    return res.json({
      payload: {},
      success: true,
      message: "Create success",
    });
  } catch (error) {
    return next(error);
  }
};
export const getProject = async (req, res, next) => {
  const leaderID = req.userID;
  const projectID = req.query?.projectID;
  try {
    if (projectID) {
      const result = await databaseProject.project.findOne({
        _id: new ObjectId(projectID),
      });
      return res.json({
        payload: result,
        success: true,
        message: "Success",
      });
    } else {
      const result = await databaseProject.project
        .find({
          $or: [{ members: { $in: [leaderID] } }, { leaderID: leaderID }],
        })
        .toArray();
      return res.json({
        payload: result,
        success: true,
        message: "Success",
      });
    }
  } catch (error) {
    return next(error);
  }
};
export const addMember = async (req, res, next) => {
  const projectID = req.query?.projectID;
  const { memberIDS } = req.body;
  try {
    const oldMemberIDs = await databaseProject.project.findOne({
      _id: new ObjectId(projectID),
    })?.members;
    await databaseProject.project.updateOne(
      { _id: new ObjectId(projectID) },
      { members: [...oldMemberIDs, memberIDS] },
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
export const deleteMember = async (req, res, next) => {
  const projectID = req.query?.projectID;
  const { memberIDS } = req.body;
  try {
    const oldMemberIDs = await databaseProject.project.findOne({
      _id: new ObjectId(projectID),
    })?.members;
    const index = oldMemberIDs.indexOf(memberIDS);
    oldMemberIDs.splice(index, 1);
    await databaseProject.project.updateOne(
      { _id: new ObjectId(projectID) },
      { members: oldMemberIDs },
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
export const deleteProject = async (req, res, next) => {
  const projectID = req.query?.projectID;
  try {
    await databaseProject.project.deleteOne({ _id: new ObjectId(projectID) });
    return res.json({
      payload: {},
      success: true,
      message: "Success",
    });
  } catch (error) {
    return next(error);
  }
};
export const createTask = async (req, res, next) => {
  const projectID = req.query?.projectID;
  const taskDetail = req.body;

  try {
    const taskItem = new Task({ projectID, ...taskDetail });
    const result = await databaseProject.task.insertOne(taskItem);
    const insertID = result.insertedId;
    await databaseProject.project.updateOne(
      { _id: new ObjectId(projectID) },
      { $push: { taskIDs: insertID } },
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
