import { ObjectId } from 'mongodb';
import databaseProject from '../mongodb.js';

export const getMe = async (req, res, next) => {
  try {
    const result = await databaseProject.user.findOne({
      _id: new ObjectId(req.userId),
    });

    return res.status(200).json({
      payload: result,
      message: 'Success',
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const email = req.body.email;

    const result = await databaseProject.user.findOne({ email });
    return res.status(200).json({
      payload: result,
      message: 'Success',
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
      message: 'Success',
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    await databaseProject.user.updateOne({ _id: new ObjectId(userId) }, { $set: req.body });
    return res.json({
      payload: {},
      message: 'Success',
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
    const search = req.query?.search;

    // const listOfProject = await databaseProject.project
    //   .find({ $or: [{ leaderId: new ObjectId(userId) }, { memberIds: { $in: [new ObjectId(userId)] } }] })
    //   .toArray();

    const listOfProject = await databaseProject.project
      .aggregate([
        {
          $match: {
            $or: [{ leaderId: new ObjectId(userId) }, { memberIds: { $in: [new ObjectId(userId)] } }],
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'leaderId',
            foreignField: '_id',
            as: 'leader',
          },
        },
        {
          $unwind: '$leader',
        },
      ])
      .toArray();

    let result = listOfProject;
    if (search) {
      result = listOfProject.filter((item, index) => {
        if (item.projectName.includes(search)) {
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
        return next('error: paging query');
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
    const projectListOwner = await databaseProject.project.find({ leaderId: new ObjectId(userId) }).toArray();
    const projectListMember = await databaseProject.project
      .find({ memberIds: { $in: [new ObjectId(userId)] } })
      .toArray();
    Promise.all([projectListMember, projectListOwner]);
    let friendList = [];
    projectListOwner.forEach((item) => {
      if (friendList.filter((childItem) => item.memberIds.includes(childItem)).length <= 0) {
        friendList.push(...item.memberIds);
      }
    });
    console.log(friendList);

    projectListMember.forEach((item) => {
      console.log(item.leaderId);

      if (!friendList.includes(new ObjectId(item.leaderId))) {
        friendList.push(new ObjectId(item.leaderId));
      }
      friendList.push(...item.memberIds.filter((segment) => segment.toString() !== userId));
    });
    console.log(friendList);

    if (friendList.length > 0) {
      const friendIds = friendList.map((item) => new ObjectId(item));
      const friendData = await databaseProject.user.find({ _id: { $in: friendIds } }).toArray();
      const payload = friendData
        .filter((item) => item._id.toString() !== userId)
        .map((item) => {
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
