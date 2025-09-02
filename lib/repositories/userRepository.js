import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";

const getInspectors = async () => {
  try {
    const inspectors = await db(DatabaseTable.usuarios)
      .select("id_usuario", "nombre", "email")
      .where({ rol: "inspector" });
    return inspectors;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los inspectores"
    );
  }
};

const userRepository = {
  getInspectors,
};

export default userRepository;
