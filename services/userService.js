import { ObjectId } from "mongodb";
import databaseProject from "../mongodb.js";

export const getMe = async (req, res, next) => {
  try {
    const result = await databaseProject.user.findOne({
      _id: new ObjectId(req.userId),
    });
    console.log(req.userId);

    return res.status(200).json({
      payload: result,
      message: "Success",
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
export const getDetail = async (req, res, next) => {
  try {
    const result = await databaseProject.user.findOne({
      _id: new ObjectId(req.params.id),
    });

    return res.status(200).json({
      payload: result,
      message: "Success",
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    await databaseProject.user.updateOne(
      { _id: new ObjectId(userId) },
      { $set: req.body },
    );
    return res.json({
      payload: {},
      message: "Success",
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
export const getAllProject = async (req, res, next) => {
  try {
    const userId = req.userId;
    const paging = Number(req.query?.paging);
    const searching = req.query?.searching;

    const listOfProject = await databaseProject.project
      .find({ $or: [{ leaderId: new ObjectId(userId) }, { memberIds: new ObjectId(userId) }] })
      .toArray();
    let result = listOfProject;
    if (searching) {
      result = listOfProject.filter((item, index) => {
        if (item.projectName.includes(decodeURI(searching))) {
          return true;
        }
        return false;
      });
    } else {
      result = listOfProject;
    }
    if (paging) {
      if (paging > 0) {
        return res.json({
          payload: result.slice(5 * (paging - 1), 5 * (paging - 1) + 4),
          message: `list of project in page ${paging}`,
          success: true,
        });
      } else {
        return next("error: paging query");
      }
    } else {
      return res.json({
        payload: result,
        message: `list of project`,
        success: true,
      });
    }
  } catch (error) {
    return next(error);
  }
};
export const getAllFriend = async (req, res, next) => {
  try {
    const userId = req.userId;
    const projectListOwner = await databaseProject.project
      .find({ leaderId: new ObjectId(userId) })
      .toArray();
    const projectListMember = await databaseProject.project
      .find({ memberIds: userId })
      .toArray();
    Promise.all([projectListMember, projectListOwner]);
    let friendList = [];
    projectListOwner.forEach((item) => {
      if (
        friendList.filter((childItem) => item.memberIds.includes(childItem))
          .length <= 0
      ) {
        friendList.push(...item.memberIds);
      }
    });
    projectListMember.forEach((item) => {
      if (!friendList.includes(item.leaderId)) {
        friendList.push(item.leaderId);
      }
    });
    if (friendList.length > 0) {
      const friendIds = friendList.map((item) => new ObjectId(item));
      const friendData = await databaseProject.user
        .find({ _id: { $in: friendIds } })
        .toArray();
      const payload = friendData.map((item) => {
        return {
          id: item._id,
          fullName: item.fullName,
          avatar: item.avatar,
        };
      });
      return res.json({
        payload: payload,
        message: `list user's friend`,
        success: true,
      });
    } else {
      return res.json({
        payload: [],
        message: `No friend`,
        success: true,
      });
    }
  } catch (error) {
    return next(error);
  }
};
