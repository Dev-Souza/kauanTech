const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true
        },
        comentario: {
            type: String,
            required: true,
        },
        data_review: {
            type: Date,
            required: true,
        },
        produto: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'produto',
            required: true
        },
        cliente: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'cliente',
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Review = mongoose.model('review', schema)

module.exports = Review