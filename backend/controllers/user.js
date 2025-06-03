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
    let user;
    try {
      if (req.params.clientId) {
        user = await Clients.findOne({
          where: {
            clientId: req.params.clientId,
          },
        });
      } else {
        user = await Clients.findOne({
          where: {
            clientId: req.user.clientId,
          },
        });
      }

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
    const role = req.body.role || "client";
    const lastName = req.body.lastName || null;
    const phoneNumber = req.body.number || null;

    console.log(req.body.role);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    if (req.user && req.user.role !== "admin" && role !== "client") {
      return res.status(403).json({ message: "Only admins can assign roles" });
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return res.status(500).json({ message: "Error generating salt" });
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return res.status(500).json({ message: "Error hashing password" });
        }

        Clients.create({
          firstName: name,
          email: email,
          password: hash,
          role: role,
          lastName: lastName,
          phoneNumber: phoneNumber,
        })
          .then((newUser) => {
            const token = jwt.sign(
              { clientId: newUser.clientId, role: newUser.role },
              authConfig.secret,
              { expiresIn: "2h" }
            );

            res.status(201).json({
              message: "Created new user",
              newUser: newUser,
              accessToken: token,
            });

            console.log(
              `[Server]: ${newUser.firstName} (${newUser.role}) signed up`
            );
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
              { clientId: newUser.clientId, role: newUser.role },
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
    let updatedRows;
    try {
      if (
        (req.body.phoneNumber && typeof req.body.phoneNumber !== "number") ||
        (req.body.firstName && typeof req.body.firstName !== "string") ||
        (req.body.email && typeof req.body.email !== "string") ||
        (req.body.lastName && typeof req.body.lastName !== "string")
      ) {
        return res.status(400).json({ error: "Invalid types of data" });
      }

      if (req.params.clientId) {
        updatedRows = await Clients.update(
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName || null,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber || null,
          },
          {
            where: {
              clientId: req.params.clientId,
            },
          }
        );
      } else {
        updatedRows = await Clients.update(
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
      }

      if (updatedRows[0] === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.params.clientId) {
        const updatedUser = await Clients.findOne({
          where: {
            clientId: req.params.clientId,
          },
        });
      } else {
        const updatedUser = await Clients.findOne({
          where: {
            clientId: req.user.clientId,
          },
        });
      }

      res.json({ message: "User updated successfully" });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  deleteUser = async (req, res) => {
    let clientId;
    try {
      if (req.params.clientId) {
        clientId = req.params.clientId;
      } else {
        clientId = req.user?.clientId || req.user?.id;
      }
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

  getAllUsers = async (req, res) => {
    try {
      // Delete the user
      const allUsers = await Clients.findAll();

      if (allUsers === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(allUsers);

      res.json({ users: allUsers });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const UserController = new userController();
