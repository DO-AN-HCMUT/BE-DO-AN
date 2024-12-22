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
      (this.memberIds = project.memberIds ?? []),
      (this.createdAt = new Date()),
      (this.name = project.name),
      (this.key = project.key),
      (this.description = project.description ?? null),
      (this.taskMaxIndex = 0);
  }
}
export class Task {
  constructor(task) {
    (this.projectId = task.projectId),
      (this.key = task.key),
      (this.title = task.title),
      (this.registeredMembers = task.registeredMembers ?? []),
      (this.description = task.description ?? null),
      (this.status = task.status ?? 'TO_DO'),
      (this.endDate = task.endDate ? new Date(task.endDate) : null),
      (this.createdAt = new Date());
    this.isOverdueNotificationSent = task.isOverdueNotificationSent ?? false;
  }
}

export class Comment {
  constructor(comment) {
    (this.taskId = comment.taskId),
      (this.createdBy = comment.createdBy),
      (this.content = comment.content),
      (this.hasUpdated = comment.hasUpdated ?? false),
      (this.createdAt = new Date());
  }
}

export class Notification {
  constructor(notification) {
    (this.recipientId = notification.recipientId),
      (this.type = notification.type),
      (this.authorId = notification.authorId ?? null),
      (this.targetId = notification.targetId),
      (this.isRead = notification.isRead ?? false),
      (this.createdAt = new Date());
  }
}
export class Invitation {
  constructor(invitation) {
    this.createdDate = new Date();
    this.receiverMail = invitation.receiverMail;
    this.projectName = invitation.projectName;
    this.projectId = invitation.projectId;
    this.leaderId = invitation.inviter;
    this.userId = invitation.userId ?? null;
    this.isAccepted = invitation.isAccepted ?? false;
  }
}
