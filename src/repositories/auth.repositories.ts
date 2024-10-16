import { Auth } from "../models/auth.schema";

const AuthRepositories = {
  get: async (refreshToken: string) => {
    const data = await Auth.findOne({
      refreshToken,
    });
    return data;
  },
  post: async (userId: string, refreshToken: string) => {
    const data = new Auth({
      userId,
      refreshToken,
    });
    await data.save();
  },
  delete: async (refreshToken: string) => {
    await Auth.findByIdAndDelete({
      refreshToken,
    });
  },
};

export default AuthRepositories;
