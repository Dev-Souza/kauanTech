const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        forma_pagamento: {
            type: String,
            required: true
        },
        data_pagamento: {
            type: Date,
            default: Date.now
        },
        total_pagar: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pago'], //"pago"
            default: "pago"
        },
        carrinho: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'carrinho',
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Compra = mongoose.model('compra', schema)

module.exports = Compra