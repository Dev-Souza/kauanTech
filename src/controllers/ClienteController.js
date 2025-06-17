require('dotenv').config();
const Cliente = require('../models/Cliente');
const { cpf } = require('cpf-cnpj-validator'); // Validador de CPF
const { parsePhoneNumberFromString } = require('libphonenumber-js'); // Validador de telefone
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Biblioteca do token para autenticação

const JWT_SECRET = process.env.JWT_SECRET; // Pegando o JWT do arquivo .env

async function create(req, res) {
    const { senha, ...clienteData } = req.body;

    try {
        // Hash a senha recebida
        const senhaHash = await bcrypt.hash(senha, 10);

        // Crie uma nova instância do modelo Cliente com a senha hashada
        const cliente = new Cliente({ ...clienteData, senha: senhaHash, role: req.body.role || 'user' });

        // Valide o telefone
        const telefoneValido = validatePhoneNumber(cliente.telefone, 'BR');
        if (!telefoneValido.valid) {
            return res.status(400).json("Telefone é inválido");
        }

        // Valide o CPF
        if (!cpf.isValid(cliente.cpf)) {
            return res.status(400).json("CPF é inválido!");
        }

        // Salve o cliente no banco de dados
        const clienteCriado = await cliente.save();
        res.status(201).json(clienteCriado);

    } catch (error) {
        console.error("Erro ao criar cliente:", error);
        res.status(500).json({ mensagem: "Erro ao criar cliente", error });
    }
}

async function getAll(req, res) {
    res.json(await Cliente.find());
}

async function getById(req, res) {
    const cliente = await Cliente.findById(req.params.id);
    if (cliente) {
        res.json(cliente);
    } else {
        res.status(404).json("Cliente não encontrado!");
    }
}

async function update(req, res) {
    const { senha, ...clienteData } = req.body;

    try {
        // Verifique se uma nova senha foi fornecida
        if (senha) {
            // Hash a nova senha
            const senhaHash = await bcrypt.hash(senha, 10);
            clienteData.senha = senhaHash;
        }
        // Atualize o cliente no banco de dados
        const clienteAtualizado = await Cliente.findByIdAndUpdate(req.params.id, clienteData, { new: true });

        if (clienteAtualizado) {
            res.json(clienteAtualizado);
        } else {
            res.status(404).json({ mensagem: "Cliente não encontrado!" });
        }
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.status(500).json({ mensagem: "Erro ao atualizar cliente", error });
    }
}

async function deletar(req, res) {
    const clienteExcluido = await Cliente.findByIdAndDelete(req.params.id);
    if (clienteExcluido) {
        res.json({ mensagem: "Excluído com sucesso!" });
    } else {
        res.status(404).json({ mensagem: "Cliente não encontrado!" });
    }
}

// Função que valida número de telefone
function validatePhoneNumber(number, country) {
    const phoneNumber = parsePhoneNumberFromString(number, country);
    if (phoneNumber && phoneNumber.isValid()) {
        return {
            valid: true,
            formatted: phoneNumber.formatInternational()
        };
    } else {
        return { valid: false };
    }
}

// Função que efetua login
async function login(req, res) {
    const { email, senha } = req.body;

    const cliente = await Cliente.findOne({ email });

    if (!cliente) {
        return res.status(401).json({ mensagem: "Cliente não cadastrado!" });
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha);

    if (!senhaValida) {
        return res.status(401).json({ mensagem: "Email ou senha inválidos!" });
    }

    const token = jwt.sign({ id: cliente._id, nome: cliente.nome, email: cliente.email, role: cliente.role}, JWT_SECRET, { expiresIn: '1h' });

    res.json({
        mensagem: "Login efetuado!",
        token: token,
        role: cliente.role
    });
}

module.exports = {
    create,
    getById,
    getAll,
    update,
    deletar,
    login
};