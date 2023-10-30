import { Options } from 'swagger-jsdoc';

const swaggerDefinition: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Adventurista API',
      version: '1.0.0',
      description: 'This is the documentation for our API.',
    },
    basePath: '/v1',
  },
  apis: ['./events.ts', './users.ts'], // Adjust the path to where your route files are
};

export default swaggerDefinition;
