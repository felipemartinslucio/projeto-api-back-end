const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * tags:
 *   name: Install
 *   description: Operações de instalação e configuração inicial do banco de dados.
 */

/**
 * @swagger
 * /install:
 *   get:
 *     summary: Cria e popula o banco de dados com usuários iniciais
 *     description: Gera senhas hash para usuários iniciais e insere-os no banco de dados.
 *     tags: [Install]
 *     responses:
 *       201:
 *         description: Banco de dados criado e populado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Banco de dados criado e populado com sucesso!'
 *       500:
 *         description: Erro ao criar e popular o banco de dados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Erro ao criar e popular o banco de dados.'
 *                 error:
 *                   type: string
 *                   example: 'Detalhes do erro.'
 */
router.get('/', async (req, res) => {
    try {
        // Gera hash para senhas
        const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
        const hashedPasswordUser = await bcrypt.hash('user123', 10);

        // Inserção de usuários iniciais
        await User.insertMany([
            { name: 'Admin User', username: 'admin', password: hashedPasswordAdmin, role: 'admin' },
            { name: 'Normal User 1', username: 'user1', password: hashedPasswordUser, role: 'user' },
            { name: 'Normal User 2', username: 'user2', password: hashedPasswordUser, role: 'user' },
            { name: 'Normal User 3', username: 'user3', password: hashedPasswordUser, role: 'user' },
            { name: 'Normal User 4', username: 'user4', password: hashedPasswordUser, role: 'user' }
        ]);

        // Resposta de sucesso
        res.status(201).json({ message: 'Banco de dados criado e populado com sucesso!' });
    } catch (error) {
        // Resposta de erro
        res.status(500).json({ message: 'Erro ao criar e popular o banco de dados.', error: error.message });
    }
});

module.exports = router;