import { User } from "../models/user.js";

// import sequelize from "./util/db.js";
// const models = require("../models");

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
    console.log(newUser.name);
    console.log(`[Server]: ${newUser.name} signed up`);
  }

  getUser(req, res) {
    const user = this.USERS.find((user) => user.email === req.body.email);

    if (this.USERS.length == 0 || !user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.password === req.body.password) {
      console.log("[Server]: user logged in");
      return res.json({
        user: user,
      });
    }
    console.log("[Server]: User not found");
    return res.status(400).json({ message: "wrong password" });
  }
}

export const UserController = new userController();
