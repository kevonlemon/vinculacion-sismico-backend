import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentación - Sistema de Vulnerabilidad Sísmica",
    version: "1.0.0",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./lib/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiExpress = swaggerUi;
