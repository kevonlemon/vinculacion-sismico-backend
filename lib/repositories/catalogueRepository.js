import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";

const getByType = async (type) => {
  try {
    const catalogues = await db(DatabaseTable.catalogos)
      .select("id_catalogo", "tipo", "codigo", "valor")
      .where({ tipo: type });
    return catalogues;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los catálogos"
    );
  }
};

const catalogueRepository = {
  getByType,
};

export default catalogueRepository;
