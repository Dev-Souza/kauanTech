const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },
        cpf: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        senha: {
            type: String,
            required: true,
        },
        telefone: {
            type: String,
            required: true,
        },
        endereco: {
            cep: String,
            logradouro: String,
            complemento: String,
            bairro: String,
            localidade: String,
            uf: String,
            numero: String
        }
    },
    {
        timestamps: true
    }
)

const Cliente = mongoose.model('cliente', schema)

module.exports = Cliente