import express, { Router } from "express";
import { UserController } from "../controllers/user.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.post("/new-user", (req, res) => UserController.createUser(req, res));
router.post("/login", (req, res) => UserController.getUser(req, res));
router.get("/profile", verifyToken, (req, res) => {
  UserController.getUserProfile(req, res);
});
router.patch("/profile/edit", verifyToken, (req, res) => {
  UserController.editUser(req, res);
});

router.delete("/delete", (req, res, next) => {
  console.log("DELETE /user/delete route hit");
  next();
}, verifyToken, (req, res) => {
  console.log("verifyToken passed");
  UserController.deleteUser(req, res);
});

export default router;
