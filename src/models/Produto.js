const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        codigo_barras: {
            type: String,
            required: true
        },
        nome: {
            type: String,
            required: true,
        },
        preco: {
            type: Number,
            required: true,
        },
        quantidade: {
            type: Number,
            required: true,
        },
        descricao: {
            type: String,
            required: false,
        },
        categoria: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Produto = mongoose.model('produto', schema)

module.exports = Produto