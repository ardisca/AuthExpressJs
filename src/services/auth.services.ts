import AuthRepositories from "../repositories/auth.repositories";

const AuthServices = {
  getToken: async (refreshToken: string) => {
    const auth = await AuthRepositories.get(refreshToken);
    return auth;
  },
  postToken: async (userId: string, refreshToken: string) => {
    await AuthRepositories.post(userId, refreshToken);
  },
  deleteToken: async (refreshToken: string) => {
    await AuthRepositories.delete(refreshToken);
  },
};

export default AuthServices;
