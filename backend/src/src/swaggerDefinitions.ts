import { Options } from "swagger-jsdoc";

const swaggerDefinition: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Adventurista API",
      version: "1.0.0",
      description: "This is the documentation for our app",
    },
    basePath: "/v1",
  },
  // go to the users.ts and events.ts files to see the paths
  apis: [
    "./users.ts",
    "./events.ts",
    "*.ts",
    "./*.ts, ./messages.ts, ./swaggerDefinitions.ts, ./index.ts",
  ],
};

export default swaggerDefinition;
