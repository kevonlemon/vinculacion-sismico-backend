import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import buildingRepository from "../repositories/buildingsRepository.js";
import { BuildingSchema } from "../schema/buildingSchema.js";

const getBuildings = async () => {
  const buildings = await buildingRepository.getBuildings();
  return buildings;
};

const createBuilding = async (buildingData, images) => {
  buildingData.latitud = parseFloat(buildingData.latitud);
  buildingData.longitud = parseFloat(buildingData.longitud);
  buildingData.numero_pisos = parseInt(buildingData.numero_pisos);
  buildingData.area_total_piso = parseFloat(buildingData.area_total_piso);
  buildingData.anio_construccion = parseInt(buildingData.anio_construccion);
  buildingData.anio_codigo = parseInt(buildingData.anio_codigo);
  buildingData.ampliacion = buildingData.ampliacion === "1" ? true : false;
  buildingData.anio_ampliacion = parseInt(buildingData.anio_ampliacion);
  buildingData.historico = buildingData.historico === "1" ? true : false;
  buildingData.albergue = buildingData.albergue === "1" ? true : false;
  buildingData.gubernamental =
    buildingData.gubernamental === "1" ? true : false;
  buildingData.unidades = parseInt(buildingData.unidades);

  let parsedData = BuildingSchema.parse({
    ...buildingData,
    foto_edificio: images?.foto_edificio || null,
    grafico_edificio: images?.grafico_edificio || null,
  });

  return await buildingRepository.createBuilding(parsedData);
};

const buildingService = { getBuildings, createBuilding };

export default buildingService;
