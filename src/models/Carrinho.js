const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        total_precos: {
            type: Number,
            required: true
        },
        data_criacao: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
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