import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AuthServices from "../services/auth.services";
import UserServices from "../services/user.services";

const ResourceController = {
  heandleResource: async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken) {
      try {
        jwt.verify(accessToken, process.env.JWT_ACCESS_SCREET as string);
        const payload = jwt.decode(accessToken) as {
          id: string;
          username: string;
          email: string;
        };
        console.log(payload.id);
        const data = await UserServices.getData(payload.id);
        res.json({
          message: "Success",
          data: data,
        });
      } catch (error) {
        if (!refreshToken) {
          res.json({ message: "Re-Login" });
        } else {
          jwt.verify(refreshToken, process.env.JWT_REFRESH_SCREET as string);
          const actifeRefreshToken = await AuthServices.getToken(refreshToken);

          if (!actifeRefreshToken) {
            res.json({ message: "Re-Login" });
          } else {
            const payload = jwt.decode(refreshToken) as {
              id: string;
              username: string;
              email: string;
            };
            const payloadNewAccessToken = {
              id: payload.id,
              username: payload.username,
              email: payload.email,
            };
            const newAccessToken = jwt.sign(
              payloadNewAccessToken,
              process.env.JWT_ACCESS_SCREET as string,
              {
                expiresIn: 300,
              }
            );
            const data = await UserServices.getData(payload.id);

            res.cookie("accessToken", newAccessToken, { httpOnly: true }).json({
              message: "Success...",
              data: data,
            });
          }
        }
      }
    } else {
      res.status(400).json({ message: "No access token provided" });
    }
  },
};

export default ResourceController;
