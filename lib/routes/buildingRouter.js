import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import buildingController from "../controllers/buildingController.js";

const buildingRouter = express.Router();
buildingRouter.use(authMiddleware.authenticateUser.bind(authMiddleware));

buildingRouter.get("/", buildingController.getBuildings);

export default buildingRouter;
