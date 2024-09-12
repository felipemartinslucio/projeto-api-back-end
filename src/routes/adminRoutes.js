const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Operações relacionadas a administradores.
 */

/**
 * @swagger
 * /admin/create-admin:
 *   post:
 *     summary: Cria um novo administrador
 *     description: Cria um novo administrador. Requer autenticação e o usuário autenticado deve ser um administrador.
 *     tags: [Admin]
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
 *                 description: Nome do administrador.
 *                 example: "Admin User"
 *               username:
 *                 type: string
 *                 description: Nome de usuário do administrador.
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 description: Senha do administrador.
 *                 example: "admin123"
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso.
 *       403:
 *         description: Acesso negado. Apenas administradores podem criar novos administradores.
 *       400:
 *         description: Erro ao criar o administrador. Detalhes do erro serão retornados.
 */
router.post('/create-admin', authMiddleware, async (req, res) => {
    try {
        // Verifica se o usuário autenticado tem o papel de 'admin'
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acesso negado!' });

        // Extrai os dados do corpo da requisição
        const { name, username, password } = req.body;

        // Cria um novo documento de usuário com o papel 'admin'
        const admin = new User({ name, username, password, role: 'admin' });

        // Salva o novo administrador no banco de dados
        await admin.save();

        // Status 201 (Created) e mensagem de sucesso
        res.status(201).json({ message: 'Administrador criado com sucesso!' });
    } catch (error) {
        // Status 400 (Bad Request) e mensagem do erro
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /admin/delete-user/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     description: Exclui um usuário pelo ID. Requer autenticação e o usuário autenticado deve ser um administrador.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser excluído.
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *       403:
 *         description: Acesso negado. Apenas administradores podem excluir usuários.
 *       400:
 *         description: Erro ao excluir o usuário. Detalhes do erro serão retornados.
 */
router.delete('/delete-user/:id', authMiddleware, async (req, res) => {
    try {
        // Verifica se o usuário autenticado tem o papel de 'admin'
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acesso negado!' });

        // Remove o usuário do banco de dados pelo ID fornecido na URL
        await User.findByIdAndDelete(req.params.id);

        // Status 200 e mensagem de sucesso
        res.json({ message: 'Usuário excluído com sucesso!' });
    } catch (error) {
        // Status 400 (Bad Request) e mensagem do erro
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;