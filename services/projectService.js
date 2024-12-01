import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";
import { Project, Task } from "../Schema/schema.js";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";

export const makeProject = async (req, res, next) => {
  const leaderId = req.userId;
  const { members, projectName } = req.body;

  const code = projectName
    .split(" ")
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const projectItem = new Project({
    members,
    leaderId,
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
  const leaderId = req.userId;
  const projectId = req.params.projectId;
  try {
    if (projectId) {
      const result = await databaseProject.project.findOne({
        _id: new ObjectId(projectId),
      });
      return res.json({
        payload: result,
        success: true,
        message: "Success",
      });
    } else {
      const result = await databaseProject.project
        .find({
          $or: [{ members: { $in: [leaderId] } }, { leaderId: leaderId }],
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
  const projectId = req.params?.projectId;
  const { memberIds } = req.body;
  try {
    const project = await databaseProject.project.findOne({
      _id: new ObjectId(projectId),
    });

    if (!project) {
      return next("Project not found");
    }

    const newMemberIds = memberIds.filter(
      (id) => !project.members.includes(id),
    );

    await databaseProject.project.updateOne(
      { _id: new ObjectId(projectId) },
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
export const verifyMember = async (req, res, next) => {
  const projectId = req.params?.projectId;
  const userId = req.userId;
  try {
    const project = await databaseProject.project.findOne({
      _id: new ObjectId(projectId),
    });

    if (!project) {
      return next("Project not found");
    }

    const newMemberIds = project.members.filter(
      (id) => id === userId,
    );
    if (newMemberIds.length <= 0) {
      await databaseProject.project.updateOne(
        { _id: new ObjectId(projectId) },
        { $set: { members: [...project.members, userId] } },
      );
    }

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
  const projectId = req.params?.projectId;
  const { memberIds } = req.body;
  try {
    const oldMemberIds = await databaseProject.project.findOne({
      _id: new ObjectId(projectId),
    })?.members;
    const index = oldMemberIds.indexOf(memberIds);
    oldMemberIds.splice(index, 1);
    await databaseProject.project.updateOne(
      { _id: new ObjectId(projectId) },
      { members: oldMemberIds },
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
  const projectId = req.params?.projectId;
  try {
    await databaseProject.project.deleteOne({ _id: new ObjectId(projectId) });
    await databaseProject.task.deleteMany({ projectId: projectId });
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
  const projectId = req.params?.projectId;
  const taskDetail = req.body;

  const project = await databaseProject.project.findOne({
    _id: new ObjectId(projectId),
  });

  const code = project.code + "-" + (project.taskIds.length + 1);

  try {
    const taskItem = new Task({ ...taskDetail, projectId, code });
    const result = await databaseProject.task.insertOne(taskItem);
    const insertId = result.insertedId;
    await databaseProject.project.updateOne(
      { _id: new ObjectId(projectId) },
      { $push: { taskIds: insertId } },
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
  const projectId = req.params.projectId;
  const search = req.query?.search;

  try {
    const project = await databaseProject.project.findOne({
      _id: new ObjectId(projectId),
    });

    if (!project) {
      return next("Project not found");
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
  const { projectId } = req.params;

  try {
    const result = await Promise.all(
      (
        await databaseProject.task
          .find({ projectId: { $in: [projectId] } })
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
// mail
const contractMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lightwing2208@gmail.com",
    pass: process.env.PASS_MAIL,
  },
});
contractMail.verify((error) => {
  if (error) {
    console.log(error);
    // return next(error)
  }
  else {
    console.log("ready to send");

  }
})

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
  const template = fs.readFileSync(path.resolve('mailTemplate/invitation.html'), "utf-8").replaceAll("{{projectName}}", projectName).replace("{{inviter}}", inviterMail).replace("{{projectId}}", projectId).replace("{{memberId}}", guestId);
  const sentMail = {
    from: "lightwing2208@gmail.com",
    to: guestMail,
    subject: "INVITATION",
    html: template
  }
  contractMail.sendMail(sentMail, (error) => {
    if (error) {
      return next(error);
    }
    else {
      return res.json({
        payload: {},
        success: true,
        message: "Success",
      });
    }
  })
}
