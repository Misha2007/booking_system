import * as bcrypt from 'bcrypt'
import { User } from "../models/user.js";
import Clients from '../models/clients.js';
import "../util/db.js";
// import * as models from "../models"

class userController {
  constructor() {
    this.USERS = [];
  }

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
      console.log("[Server]: Salt generation successful, proceeding to hash the password");

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing password" });
        }
    
        console.log('[Server]: Hashed password:', hash);

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
          res.status(500).json({ message: "Error creating user", error: err.message });
        });
      });
    });
}


  getUser(req, res) {
    console.log("Found user: ")
    const project = Clients.findOne({ where: { email: req.body.email } }).then((newUser) => {
      // Send back the successful response
      console.log(newUser)
    
    // console.log(project)
    const user = req.body.email
    const storedHashedPassword = newUser.password
    const userInputPassword = req.body.password

    bcrypt.compare(userInputPassword, storedHashedPassword, (err, result) => {
      if (err) {
        console.error('Error comparing passwords: ', err);
        return;
      }

    if (result) {
      console.log('[Server]: User logged in');
      return res.json({
        user: user,
      }); 
    } else {
      console.log('[Server]: Passwords do not match! Auth failed.');
      res.status(500).send("Passwords dont match" );
    } 
    });
  })
  }
}

export const UserController = new userController();
