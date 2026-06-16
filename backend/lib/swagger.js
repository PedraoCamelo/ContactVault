const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ContactVault API',
      version: '1.0.0',
      description: 'REST API for managing contacts with authentication via JWT.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Phone: {
          type: 'object',
          required: ['number'],
          properties: {
            number: { type: 'string', example: '11999999999' },
            type: { type: 'string', enum: ['personal', 'work', 'other'], default: 'personal' },
          },
        },
        Address: {
          type: 'object',
          required: ['street', 'city', 'state', 'zipCode'],
          properties: {
            street: { type: 'string', example: 'Rua das Flores, 123' },
            city: { type: 'string', example: 'São Paulo' },
            state: { type: 'string', example: 'SP' },
            zipCode: { type: 'string', example: '01310-100' },
          },
        },
        Contact: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            _id: { type: 'string', example: '64a1f2c3e4b0a1b2c3d4e5f6' },
            firstName: { type: 'string', example: 'João' },
            lastName: { type: 'string', example: 'Silva' },
            email: { type: 'string', format: 'email', example: 'joao@example.com' },
            dateOfBirth: { type: 'string', format: 'date', example: '1990-05-20' },
            phoneNumbers: { type: 'array', items: { $ref: '#/components/schemas/Phone' } },
            addresses: { type: 'array', items: { $ref: '#/components/schemas/Address' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Log: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            method: { type: 'string', example: 'GET' },
            path: { type: 'string', example: '/contacts' },
            status: { type: 'integer', example: 200 },
            durationMs: { type: 'integer', example: 12 },
            ip: { type: 'string', example: '127.0.0.1' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Contact not found' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
