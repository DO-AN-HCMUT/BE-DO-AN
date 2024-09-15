
export class User {
  constructor(user) {
    (this.fullName = user.fullName||""),
      (this.email = user.email),
      (this.sex = user.sex || "other"),
      (this.password = user.password),
      (this.birthday = user.birthday?new Date(user.birthday):new Date() ) ,
      this.avatar=user.avatar || ""
  }
}
export class Chat{
  constructor(chat){
    this.userIDs=chat.userIDs || [],
    this.message=chat.message || [],
    // message struct {userID:id,content:" "}
    this.createdDate= new Date()
  }
}
export class Project{
  constructor(project){
    this.leaderID=project.leaderID,
    this.members=project.members || [],
    // this.chatIDs=project.chatIDs || [],
    this.createdDate=new Date(),
    this.taskIDs=project.taskIDs || []
  }
}
export class Task{
  constructor(task){
    this.projectID=task.projectID,
    this.registeredMembers=task.registeredMembers || [],
    this.description=task.description || "",
    this.status=task.status || "new",
    this.endDate=task.endDate,
    this.createdDate=new Date()
  }
}