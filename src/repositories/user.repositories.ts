import { User } from "../models/user.schema";

const UserRepositories = {
  post: async (username: string, email: string, password: string) => {
    const data = new User({
      username,
      email,
      password,
    });
    await data.save();
    return data;
  },
  getById: async (userId: string) => {
    const data = await User.findById(userId);
    return data;
  },
};

export default UserRepositories;
