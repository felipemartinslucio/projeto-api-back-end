const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operações relacionadas aos usuários.
 */

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Atualiza as informações do usuário autenticado
 *     description: Permite que o usuário autenticado atualize suas próprias informações.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               username:
 *                 type: string
 *                 description: Nome de usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *             example:
 *               name: 'Novo Nome'
 *               username: 'novo_usuario'
 *               password: 'nova_senha'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Usuário atualizado!'
 *       400:
 *         description: Erro na atualização do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Erro ao atualizar o usuário.'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Usuário não encontrado!'
 */

/**
 * @swagger
 * /user/list:
 *   get:
 *     summary: Lista usuários com paginação
 *     description: Retorna uma lista de usuários com base na paginação especificada.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           enum: [5, 10, 30]
 *         required: true
 *         description: Número de usuários a serem retornados por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Número da página de resultados
 *     responses:
 *       200:
 *         description: Lista de usuários com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   description: Total de usuários na base de dados
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas disponíveis com base no limite
 *                 currentPage:
 *                   type: integer
 *                   description: Número da página atual
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID do usuário
 *                       name:
 *                         type: string
 *                         description: Nome do usuário
 *                       username:
 *                         type: string
 *                         description: Nome de usuário
 *                       role:
 *                         type: string
 *                         description: Papel do usuário (admin ou user)
 *                   example:
 *                     - id: '60d5f9f1f4d4f0d5a6c7d1e2'
 *                       name: 'Normal User'
 *                       username: 'user1'
 *                       role: 'user'
 *       400:
 *         description: Erro na validação dos parâmetros de paginação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Limite inválido. Use 5, 10, ou 30.'
 *       500:
 *         description: Erro interno ao buscar usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Erro ao buscar usuários.'
 */

router.put('/update', authMiddleware, async (req, res) => {
    try {
        // Extrai os dados de atualização do corpo da requisição
        const updates = req.body;

        // Busca o usuário no banco de dados usando o ID do usuário autenticado (obtido do middleware de autenticação)
        const user = await User.findById(req.user.id);

        // Verifica se o usuário foi encontrado
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado!' });

        // Atualiza as informações do usuário com os dados fornecidos na requisição
        Object.assign(user, updates);

        // Salva as alterações no banco de dados
        await user.save();

        // Mensagem de sucesso
        res.json({ message: 'Usuário atualizado!' });
    } catch (error) {
        // Status 400 (Bad Request) e mensagem do erro
        res.status(400).json({ message: error.message });
    }
});

// Listar usuários com paginação
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        // Validação de parâmetros de paginação
        if (![5, 10, 30].includes(parseInt(limit))) {
            return res.status(400).json({ message: 'Limite inválido. Use 5, 10, ou 30.' });
        }
        if (page < 1) {
            return res.status(400).json({ message: 'O número da página deve ser maior que 0.' });
        }

        // Calcular o número de registros a serem ignorados
        const skip = (page - 1) * limit;

        // Buscar usuários com paginação
        const users = await User.find().limit(parseInt(limit)).skip(skip).exec();
        const totalUsers = await User.countDocuments();

        res.json({
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
            users,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;