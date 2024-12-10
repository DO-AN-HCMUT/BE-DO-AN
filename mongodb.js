import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();
// MongoDB connection URL
const pass = process.env.PASS;
const url = `mongodb+srv://vinhnguyenbker:${pass}@cluster0.tzx9qps.mongodb.net/`;

class DatabaseService {
  constructor() {
    this.client = new MongoClient(url);
    this.db = this.client.db(process.env.DB_NAME);
  }
  run() {
    try {
      this.client.connect();
    } catch (error) {
      console.log('error', error);
    }
  }
  get user() {
    return this.db.collection('user');
  }
  get task() {
    return this.db.collection('task');
  }
  get chat() {
    return this.db.collection('chat');
  }
  get project() {
    return this.db.collection('project');
  }
  get comment() {
    return this.db.collection('comment');
  }
}
const databaseProject = new DatabaseService();
export default databaseProject;
