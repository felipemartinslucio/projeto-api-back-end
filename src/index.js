// Variáveis de ambiente do arquivo .env
require('dotenv').config();

// Módulo 'express' para criar a aplicação web
const express = require('express');

// Conexão com o MongoDB
const connectDB = require('./config/db');

// Rotas em arquivos separados
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const installRoutes = require('./routes/installRoutes');

// Documentação da API usando Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Conexão MongoBD
connectDB();

// Express
const app = express();

// Middleware para parsing de JSON no corpo das requisições
app.use(express.json());

// Configuração e documentação Swagger
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentação da API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'],
});

// Documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define as rotas da aplicação
app.use('/install', installRoutes); // Rotas - instalação e configuração inicial
app.use('/auth', authRoutes); // Rotas - autenticação
app.use('/admin', adminRoutes); // Rotas - administrador
app.use('/user', userRoutes); // Rotas - usuários

// Define a porta para o servidor (utiliza a porta especificada no arquivo .env ou a porta 3000 por padrão)
const PORT = process.env.PORT || 3000;

// Inicia o servidor na porta definida
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));