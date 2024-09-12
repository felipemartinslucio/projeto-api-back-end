const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operações de autenticação e registro de usuários.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Cria um novo usuário com as informações fornecidas.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário.
 *                 example: "João Silva"
 *               username:
 *                 type: string
 *                 description: Nome de usuário do usuário.
 *                 example: "joaosilva"
 *               password:
 *                 type: string
 *                 description: Senha do usuário.
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Dados fornecidos inválidos ou ausentes.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/register', async (req, res) => {
    try {
        // Extrai os dados do corpo da requisição
        const { name, username, password } = req.body;

        // Validação dos dados fornecidos
        if (!name || !username || !password) {
            return res.status(400).json({ message: 'Por favor, forneça: nome, usuário e senha.' });
        }

        // Cria um novo documento de usuário com as informações fornecidas
        const user = new User({ name, username, password });

        // Salva o novo usuário no banco de dados
        await user.save();

        // Status 201 (Created) e mensagem de sucesso
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        // Status 400 (Bad Request) e mensagem do erro
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Faz login e gera um token JWT
 *     description: Faz login com as credenciais fornecidas e retorna um token JWT para autenticação futura.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nome de usuário do usuário.
 *                 example: "joaosilva"
 *               password:
 *                 type: string
 *                 description: Senha do usuário.
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Token JWT gerado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/login', async (req, res) => {
    try {
        // Extrai os dados do corpo da requisição
        const { username, password } = req.body;

        // Busca o usuário no banco de dados pelo nome de usuário fornecido
        const user = await User.findOne({ username });

        // Verifica se o usuário não existe ou se a senha fornecida não corresponde à senha armazenada
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Credenciais inválidas!' });
        }

        // Cria um token JWT para o usuário autenticado
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        // Status 500 (Internal Server Error) e mensagem do erro
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;