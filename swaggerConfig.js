// swaggerConfig.js

const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Restaurant and Delivery Platform API',
    version: '1.0.0',
    description: 'API documentation for the Restaurant and Delivery Platform',
  },
  servers: [
    {
      url: 'http://localhost:8000', // Replace with your server URL
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
