import express from "express";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/inspectors", userController.getInspectors);

export default userRouter;
