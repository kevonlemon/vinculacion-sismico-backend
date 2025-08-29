import * as utils from "../../utils.js";
import { RegisterSchema } from "../schema/authSchema.js";
import authRepos from "../repositories/authRepository.js";

const register = async (userData) => {
  let parsedData = RegisterSchema.parse(userData);
  parsedData.password_hash = await utils.hashPassword(parsedData.password);
  delete parsedData.password;
  return await authRepos.register(parsedData);
};
 
const authService = {  register };
 
export default authService;