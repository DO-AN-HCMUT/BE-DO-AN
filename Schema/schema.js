import { ObjectId } from "mongodb";

export class User {
  constructor(user) {
    (this.fullName = user.fullName||""),
      (this.email = user.email),
      (this.sex = user.sex || ""),
      (this.password = user.password|| ""),
      (this.birthday = user.birthday?new Date(user.birthday):new Date() ),
      (this.avatar= user.avatar||"")
  }
}