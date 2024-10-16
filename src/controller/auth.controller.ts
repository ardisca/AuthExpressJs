import { User } from "../models/user.schema";
import type { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthServices from "../services/auth.services";
import UserServices from "../services/user.services";

const AuthController = {
  heandleLogin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        res.status(404).json({ message: "Email and Password must valid" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "user not found" });
      } else {
        const isPasswordMatch = await bcrypt.compare(
          password,
          user.password as string
        );

        if (!isPasswordMatch) {
          res.status(404).json({ message: "wrong password" });
        } else {
          const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
          };

          const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SCREET as string,
            {
              expiresIn: 300,
            }
          );
          const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SCREET as string,
            {
              expiresIn: "7d",
            }
          );

          await AuthServices.postToken(user.id, refreshToken);

          res
            .status(200)
            .cookie("accessToken", accessToken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json({ message: "Login Succses", accessToken, refreshToken });
        }
      }
    } catch (error) {
      console.log(`Error ${error}`);
      res.status(404).json({ message: "Error", data: error });
    }
  },
  heandleRegistration: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      // input validation

      // hash password
      const hashPassword = await bcrypt.hash(password, 10);

      const data = await UserServices.postData(username, email, hashPassword);

      res.status(201).json({ message: "User Register Succses", data: data });
    } catch (error) {
      console.log(`Error ${error}`);
      res.status(404).json({ message: "Error", data: error });
    }
  },
  heandleLogout: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;
      await AuthServices.deleteToken(refreshToken);

      res
        .clearCookie("refreshToken")
        .clearCookie("accessToken")
        .json({ message: "Loqout Succsess" });
    } catch (error) {
      res.json({ error });
    }
  },
};

export default AuthController;
