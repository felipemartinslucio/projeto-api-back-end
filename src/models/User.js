const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema do usuário
const userSchema = new mongoose.Schema({
    // Nome do usuário - campo obrigatório
    name: { type: String, required: true },
    // Nome de usuário - campo obrigatório e único
    username: { type: String, required: true, unique: true },
    // Senha do usuário - campo obrigatório
    password: { type: String, required: true },
    // Papel do usuário - pode ser 'user' ou 'admin', padrão é 'user'
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

// Middleware executado antes de salvar o documento
userSchema.pre('save', async function (next) {
    // Verifica se a senha foi modificada; se não, chama o próximo middleware
    if (!this.isModified('password')) return next();

    // Gera um salt para o hash da senha
    const salt = await bcrypt.genSalt(10);

    // Cria um hash da senha usando o salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// Compara a senha fornecida com a senha armazenada
userSchema.methods.matchPassword = async function (password) {
    // Compara a senha fornecida com a senha hash armazenada
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);