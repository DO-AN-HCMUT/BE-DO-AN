export class User {
  constructor(user) {
    (this.fullName = user.fullName),
      (this.email = user.email),
      (this.password = user.password),
      (this.birthday = user.birthday ? new Date(user.birthday) : null),
      (this.avatar = user.avatar ?? null);
  }
}
export class Chat {
  constructor(chat) {
    (this.userIds = chat.userIds || []),
      (this.message = chat.message || []),
      // message struct {userId:id,content:" "}
      (this.createdDate = new Date());
  }
}
export class Project {
  constructor(project) {
    (this.leaderId = project.leaderId),
      (this.members = project.members || []),
      (this.createdDate = new Date()),
      (this.taskIds = project.taskIds || []),
      (this.projectName = project.projectName),
      (this.code = project.code);
  }
}
export class Task {
  constructor(task) {
    (this.projectId = task.projectId),
      (this.code = task.code),
      (this.title = task.title || ""),
      (this.registeredMembers = task.registeredMembers || []),
      (this.description = task.description || ""),
      (this.status = task.status || "pending"),
      (this.endDate = task.endDate),
      (this.createdDate = new Date());
  }
}
