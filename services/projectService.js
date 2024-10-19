import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";
import { Project, Task } from "../Schema/schema.js";

export const makeProject = async (req, res, next) => {
  const leaderID = req.userID;
  const { members, projectName } = req.body;

  const code = projectName
    .split(" ")
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const projectItem = new Project({
    members,
    leaderID,
    projectName,
    code,
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
    const project = await databaseProject.project.findOne({
      _id: new ObjectId(projectID),
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const newMemberIds = memberIDS.filter(
      (id) => !project.members.includes(id),
    );

    await databaseProject.project.updateOne(
      { _id: new ObjectId(projectID) },
      { $set: { members: [...project.members, ...newMemberIds] } },
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

  const project = await databaseProject.project.findOne({
    _id: new ObjectId(projectID),
  });

  const code = project.code + "-" + (project.taskIDs.length + 1);

  try {
    const taskItem = new Task({ ...taskDetail, projectID, code });
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

export const getMembers = async (req, res, next) => {
  const projectID = req.params.projectID;
  const search = req.query?.q;

  try {
    const project = await databaseProject.project.findOne({
      _id: new ObjectId(projectID),
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const populatedMembers = await databaseProject.user
      .find({
        _id: { $in: project.members.map((id) => new ObjectId(id)) },
        fullName: { $regex: search || "", $options: "i" },
      })
      .toArray();

    return res.json({
      payload: populatedMembers,
      success: true,
      message: "Success",
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  const { projectID } = req.params;

  try {
    const result = await Promise.all(
      (
        await databaseProject.task
          .find({ projectID: { $in: [projectID] } })
          .toArray()
      ).map(async (item) => {
        const userIds = item.registeredMembers;
        const users = await databaseProject.user
          .find({
            _id: { $in: userIds.map((id) => new ObjectId(id)) },
          })
          .toArray();

        return { ...item, registeredMembers: users };
      }),
    );
    return res.json({
      payload: result,
      success: true,
      message: "Success",
    });
  } catch (error) {
    return next(error);
  }
};
