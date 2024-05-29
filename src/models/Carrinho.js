const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        total_precos: {
            type: Number
        },
        data_criacao: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['aberto', 'pago'] // Permitir apenas os valores "aberto" e "pago"
        },
        cliente: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'cliente',
            required: true
        },
        produto: [{
            id: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'produto',
                required: true
            },
            quantidade: Number
        }]
    },
    {
        timestamps: true
    }
)

const Carrinho = mongoose.model('carrinho', schema)

module.exports = Carrinho