import express from "express";
import ResourceController from "../controller/resource.controller";

export const resourceRouter = express.Router();

resourceRouter.get("/resource", ResourceController.heandleResource);
