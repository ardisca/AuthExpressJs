import AuthRepositories from "../repositories/auth.repositories";
import UserRepositories from "../repositories/user.repositories";

const UserServices = {
  postData: async (username: string, email: string, password: string) => {
    const data = await UserRepositories.post(username, email, password);
    return data;
  },
  getData: async (userId: string) => {
    const data = await UserRepositories.getById(userId);
    return data;
  },
};

export default UserServices;
