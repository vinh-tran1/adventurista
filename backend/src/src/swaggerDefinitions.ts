import { Options } from "swagger-jsdoc";

const swaggerDefinition: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Adventurista API",
      version: "1.0.0",
      description: "This is the documentation for our app",
    },
    servers: [{ url: '/v1' }],
  },
  apis: [
    "./users.ts",
    "./events.ts",
    "./messages.ts",
    // Add other .ts files as needed
  ],
};

export default swaggerDefinition;
