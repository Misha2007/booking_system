import * as bcrypt from "bcrypt";
import { User } from "../models/user.js";
import Clients from "../models/clients.js";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";
import "../util/db.js";

class userController {
  constructor() {
    this.USERS = [];
  }

  getUserProfile = async (req, res) => {
    try {
      const user = await Clients.findOne({
        where: {
          clientId: req.user.clientId,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = {
        ...user.get(),
        password: undefined,
      };

      res.json({ user: userData });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  createUser(req, res) {
    const saltRounds = 10;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // Use bcrypt to hash the password first
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return res.status(500).json({ message: "Error generating salt" });
      }
      console.log(
        "[Server]: Salt generation successful, proceeding to hash the password"
      );

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return res.status(500).json({ message: "Error hashing password" });
        }

        console.log("[Server]: Hashed password:", hash);

        // Create the new user with the hashed password
        Clients.create({
          firstName: name, // Assuming 'firstName' is used for name in your model
          email: email,
          password: hash, // Pass the hashed password to the database
        })
          .then((newUser) => {
            // Send back the successful response
            res.json({
              message: "Created new user",
              newUser: newUser,
            });
            console.log(newUser);
            console.log(`[Server]: ${newUser.firstName} signed up`);
          })
          .catch((err) => {
            // Handle errors from Sequelize
            res
              .status(500)
              .json({ message: "Error creating user", error: err.message });
          });
      });
    });
  }

  getUser(req, res) {
    console.log("Found user: ");
    const project = Clients.findOne({ where: { email: req.body.email } }).then(
      (newUser) => {
        console.log(newUser);

        const storedHashedPassword = newUser.password;
        const userInputPassword = req.body.password;

        bcrypt.compare(
          userInputPassword,
          storedHashedPassword,
          (err, result) => {
            if (err) {
              console.error("Error comparing passwords: ", err);
              return;
            }

            const token = jwt.sign(
              { clientId: newUser.clientId },
              authConfig.secret,
              {
                noTimestamp: true,
                expiresIn: 86400,
              }
            );

            console.log("login user token", newUser.clientId);

            if (result) {
              console.log("[Server]: User logged in");
              return res.json({
                user: newUser,
                accessToken: token,
              });
            } else {
              console.log("[Server]: Passwords do not match! Auth failed.");
              res.status(500).send("Passwords dont match");
            }
          }
        );
      }
    );
  }

  editUser = async (req, res) => {
    try {
      const updatedRows = await Clients.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName || null,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber || null,
        },
        {
          where: {
            clientId: req.user.clientId,
          },
        }
      );

      if (updatedRows[0] === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await Clients.findOne({
        where: {
          clientId: req.user.clientId,
        },
      });

      res.json({ message: "User updated successfully" });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const UserController = new userController();
