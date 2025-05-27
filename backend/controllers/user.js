import * as bcrypt from "bcrypt";
import Clients from "../models/clients.js";
import Trip from "../models/trip.js";
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

    if (name == null || email == null || password == null) {
      return res.status(400).json({ message: "Fill all required fields" });
    }
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
          firstName: name,
          email: email,
          password: hash,
        })
          .then((newUser) => {
            // Generate token immediately after signup
            const token = jwt.sign(
              { clientId: newUser.clientId },
              authConfig.secret,
              { expiresIn: "2h" } // or your preferred expiration
            );

            // Send back user data and token
            res.status(201).json({
              message: "Created new user",
              newUser: newUser,
              accessToken: token,
            });

            console.log(newUser);
            console.log(`[Server]: ${newUser.firstName} signed up`);
          })
          .catch((err) => {
            res
              .status(500)
              .json({ message: "Error creating user", error: err.message });
          });
      });
    });
  }

  getUser(req, res) {
    if (req.body.email == null || req.body.password == null) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    const project = Clients.findOne({ where: { email: req.body.email } }).then(
      (newUser) => {
        if (!newUser) {
          return res.status(404).json({
            error: "User not found",
          });
        }

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

              { expiresIn: "2h" }
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
              res.status(401).send("Invalid credentials");
            }
          }
        );
      }
    );
  }

  editUser = async (req, res) => {
    try {
      if (
        (req.body.phoneNumber && typeof req.body.phoneNumber !== "number") ||
        (req.body.firstName && typeof req.body.firstName !== "string") ||
        (req.body.email && typeof req.body.email !== "string") ||
        (req.body.lastName && typeof req.body.lastName !== "string")
      ) {
        return res.status(400).json({ error: "Invalid types of data" });
      }

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

  deleteUser = async (req, res) => {
    try {
      const clientId = req.user?.clientId || req.user?.id;
      if (!clientId) {
        return res.status(400).json({ message: "User not authenticated" });
      }

      // Delete all trips for this user
      await Trip.destroy({
        where: { clientId },
      });

      // Delete the user
      const deletedRows = await Clients.destroy({
        where: { clientId },
      });

      if (deletedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const UserController = new userController();
