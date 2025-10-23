import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Study API',
      version: '1.0.0',
      description: 'A simple Express API for learning Node.js with TypeScript',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);