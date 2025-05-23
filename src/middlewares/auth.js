const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar o token
function checarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: "Token não fornecido!" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ mensagem: "Token inválido!" });
        }
        // Salvamos os dados do token no req.user
        req.user = decoded;
        next();
    });
}

// Middleware para verificar a role do usuário
function verificarRole(rolesPermitidas) {
    return (req, res, next) => {
        const roleUsuario = req.user.role;
        if (!rolesPermitidas.includes(roleUsuario)) {
            return res.status(403).json({ mensagem: "Acesso negado: permissão insuficiente!" });
        }
        next();
    };
}

module.exports = {
    checarToken,
    verificarRole
};