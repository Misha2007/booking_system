import jwt from "jsonwebtoken";
import db from "../util/db.js";
import authConfig from "../config/auth.config.js";
import Clients from "../models/clients.js";

export const verifyToken = async (req, res, next) => {
  const headerToken =
    req.headers["x-access-token"] || req.headers["authorization"];
  console.log("headerToken", headerToken);

  const token = headerToken.replace("Bearer ", "");
  console.log("token", token);

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  try {
    // Decode the JWT token

    const decoded = jwt.verify(token.replace("Bearer ", ""), authConfig.secret);
    //const decoded = jwt.verify(token, authConfig.secret);
    console.log("Decoded JWT:", decoded);

    // Assign the decoded user ID to req.user
    req.user = req.user || {}; // Initialize req.user if it doesn't exist
    req.user.clientId = decoded.clientId; // Set the user ID from decoded JWT

    // Fetch the user (client) from the database
    const user = await Clients.findByPk(req.user.clientId);
    console.log("Found user:", user);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found" });
    }

    // Assign the found user to req.user
    req.user = user; // Add the found user to the req object
    console.log("User added to req object:", req.user);

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized!", error: err.message });
  }
};
