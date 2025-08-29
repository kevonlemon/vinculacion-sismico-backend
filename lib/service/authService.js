import * as utils from "../../utils.js";
import { LoginSchema, RegisterSchema } from "../schema/authSchema.js";
import authRepos from "../repositories/authRepository.js";

const register = async (userData) => {
  let parsedData = RegisterSchema.parse(userData);
  parsedData.password_hash = await utils.hashPassword(parsedData.password);
  delete parsedData.password;
  return await authRepos.register(parsedData);
};

const login = async (loginData) => {
  const parsedData = LoginSchema.parse(loginData);
  return await authRepos.login(parsedData);
};

const authService = { register, login };

export default authService;
