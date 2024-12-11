import { ObjectId } from 'mongodb';
import databaseProject from '../mongodb.js';
import { Chat } from '../Schema/schema.js';

export const getChat = async (req, res, next) => {
  try {
    const secondId = req.params.id;
    const result = await databaseProject.chat.findOne({
      userIds: { $all: [new ObjectId(req.userId), new ObjectId(secondId)] },
    });
    return res.json({
      payload: result,
      message: 'success',
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const makeChat = async (req, res, next) => {
  try {

    const checkExist = await databaseProject.chat.findOne({
      userIds: req.body.userIds.map((item) => new ObjectId(item)),
    });
    if (checkExist) {
      return next('Exist Conservation');
    } else {
      const item = new Chat({ userIds: req.body.userIds.map((item) => new ObjectId(item)), message: req.body.message });
      await databaseProject.chat.insertOne(item);
      return res.json({
        payload: {},
        message: 'success',
        success: true,
      });
    }
  } catch (error) {
    return next(error);
  }
};
export const deleteChat = async (req, res, next) => {
  try {
    const secondId = req.params.id;
    const result = await databaseProject.chat.findOne({
      userIds: { $all: [new ObjectId(req.userId), new ObjectId(secondId)] },
    });
    await databaseProject.chat.deleteOne({ _id: new ObjectId(result._id) });
    return res.json({
      payload: {},
      message: 'success',
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
export const getReceiver = async (req, res, next) => {
  try {
    const userId = req.userId;

    const data = await databaseProject.chat.find({ userIds: { $in: [new ObjectId(userId)] } }).toArray();
    const result = data?.map((item) => {      
      if (item.userIds[0].toString() === (userId)) {
        return item.userIds[1].toString();
      }
      return item.userIds[0].toString();
    });    
    
    return res.json({
      payload: { sender: userId, receiver: result },
      message: 'success',
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
export const addMessage = async (req, res, next) => {
  try {
    const { sender, receiver, message } = req.body;
    const oldData = await databaseProject.chat.findOne({
      userIds: { $all: [ new ObjectId(sender),new ObjectId(receiver)] },
    });
    await databaseProject.chat.updateOne(
      { userIds: { $all: [new ObjectId(sender), new ObjectId(receiver)] } },
      { $set: { message: [...oldData.message, message] } },
    );
    return res.json({
      payload: {},
      message: 'success',
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
