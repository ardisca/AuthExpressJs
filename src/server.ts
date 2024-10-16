import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { authRouter } from "./router/auth.router";
import { resourceRouter } from "./router/resource.router";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connection DB Succses"))
  .catch(() => console.log("Connection DB Failed"));

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", resourceRouter);

app.listen(process.env.PORT, () => {
  console.log(`Connect PORT : ${process.env.PORT}`);
});
