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
      (this.members = project.members ?? []),
      (this.createdAt = new Date()),
      (this.taskIds = []),
      (this.name = project.name),
      (this.key = project.key);
  }
}
export class Task {
  constructor(task) {
    (this.projectId = task.projectId),
      (this.key = task.key),
      (this.title = task.title || ""),
      (this.registeredMembers = task.registeredMembers || []),
      (this.description = task.description || ""),
      (this.status = task.status || "TO_DO"),
      (this.endDate = task.endDate),
      (this.createdDate = new Date());
  }
}
