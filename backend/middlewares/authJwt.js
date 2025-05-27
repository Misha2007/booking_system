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
    const decoded = jwt.verify(token.replace("Bearer ", ""), authConfig.secret);
    console.log("Decoded JWT:", decoded);

    req.user = req.user || {};
    req.user.clientId = decoded.clientId;

    const user = await Clients.findByPk(req.user.clientId);
    console.log("Found user:", user);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found" });
    }

    req.user = user;
    console.log("[Server]: User added to req object:", req.user);

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    return res
      .status(401)
      .json({ message: "Unauthorized!", error: err.message });
  }
};
