const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Define o middleware de autenticação
const authMiddleware = async (req, res, next) => {
    // Extrai o token do cabeçalho 'Authorization' da requisição
    const token = req.headers['authorization']?.split(' ')[1];

    // Status 401 e mensagem de erro
    if (!token) return res.status(401).json({ message: 'Token não informado!' });

    try {
        // Verifica e decodifica o token usando a chave secreta armazenada na variável de ambiente 'JWT_SECRET'
        // Se o token for válido, 'jwt.verify' retornará os dados decodificados do token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Busca o usuário no banco de dados usando o ID decodificado do token
        // 'decoded.id' é o ID do usuário que foi codificado no token
        req.user = await User.findById(decoded.id);

        // Chama o próximo middleware ou rota na cadeia de processamento
        next();
    } catch (error) {
        // Status 401 e mensagem de erro
        res.status(401).json({ message: 'Token inválido!' });
    }
};

module.exports = authMiddleware;