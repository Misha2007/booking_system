import { User } from "../models/user.js";

class userController {
  constructor() {
    this.USERS = [];
  }
  createUser(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const newUser = new User(Math.random().toString(), name, email, password);
    this.USERS.push(newUser);
    res.json({
      message: "created new user",
      newUser: newUser,
    });
    console.log(this.USERS);
  }
}

export const UserController = new userController();
