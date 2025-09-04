import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";
import bucket from "../firebase/firebase.js";

const getBuildings = async () => {
  try {
    const buildings = await db(DatabaseTable.edificios).select("*");
    return buildings;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los edificios"
    );
  }
};

const createBuilding = async (buildingData) => {
  const trx = await db.transaction();
  try {
    let foto_edificio_url = "";
    let grafico_edificio_url = "";
    let domainUrl = process.env.DOMAIN_URL_FIREBASE_STORAGE;

    if (buildingData.foto_edificio || buildingData.grafico_edificio) {
      // helper para subir un archivo
      const uploadFile = async (file, folder) => {
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;
        const storageFile = bucket.file(fileName);

        await storageFile.save(file.buffer, {
          metadata: { contentType: file.mimetype },
        });
        await storageFile.makePublic();

        return `${domainUrl}/${bucket.name}/${fileName}`;
      };

      // subir foto_edificio si existe
      if (buildingData.foto_edificio) {
        foto_edificio_url = await uploadFile(
          buildingData.foto_edificio,
          "building/foto"
        );
      }

      // subir grafico_edificio si existe
      if (buildingData.grafico_edificio) {
        grafico_edificio_url = await uploadFile(
          buildingData.grafico_edificio,
          "building/grafico"
        );
      }
    }

    buildingData.foto_edificio_url = foto_edificio_url;
    buildingData.grafico_edificio_url = grafico_edificio_url;
    delete buildingData.foto_edificio;
    delete buildingData.grafico_edificio;

    let building = await trx(DatabaseTable.edificios)
      .insert(buildingData)
      .returning("*");

    await trx.commit();

    return building[0];
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const buildingRepository = {
  getBuildings,
  createBuilding,
};

export default buildingRepository;
