import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import  DatabaseTable from "../../data/databaseTables.js";

const register = async (userData) => {
  const trx = await db.transaction();
  try {
    const [user] = await trx(DatabaseTable.usuarios)
      .insert(userData)
      .returning(["id_usuario", "nombre", "email"]);
    await trx.commit();
    return user;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const authRepository = {  register };

export default authRepository;
