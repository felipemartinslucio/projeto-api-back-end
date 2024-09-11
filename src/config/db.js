const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Tenta se conectar ao MongoDB usando a URI armazenada na variável de ambiente 'MONGO_URI'
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado!');
    } catch (error) {
        console.error('Erro na conexão com o MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;