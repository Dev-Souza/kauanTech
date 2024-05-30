const Review = require('../models/Review');

async function create(req, res) {
    //Meu rating só pode ser de 1 a 5, então vamos validar isso
    if (req.body.rating > 5 || req.body.rating < 1) {
        return res.status(400).json({ mensagem: "Sua classificação do produto tem que ser de 1 a 5!" });
    }

    //Criação do Review
    const review = new Review({
        rating: req.body.rating,
        comentario: req.body.comentario,
        produto: req.body.produto,
        cliente: req.body.cliente
    })
    const reviewCriado = await review.save()
    res.status(201).json(reviewCriado);
}

async function getAll(req, res) {
    res.json(await Review.find()
    .populate({
        path: 'cliente',
        select: 'nome telefone'
    })
    .populate({
        path: 'produto',
        select: 'nome preco'
    }))
}

async function getById(req, res) {
    const review = await Review.findById(req.params.id)
    .populate({
        path: 'cliente',
        select: 'nome telefone'
    })
    .populate({
        path: 'produto',
        select: 'nome preco'
    })
    
    if (review) {
        res.json(review);
    } else {
        res.status(404).json("Review não encontrado!");
    }
}

async function update(req, res) {
    //Meu rating só pode ser de 1 a 5, então vamos validar isso
    if (req.body.rating > 5 || req.body.rating < 1) {
        return res.status(400).json({ mensagem: "Sua classificação do produto tem que ser de 1 a 5!" });
    }

    const reviewAtualizado = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (reviewAtualizado) {
        res.json(reviewAtualizado)
    } else {
        res.status(404).json({ mensagem: "Review não encontrado!" })
    }
}

async function deletar(req, res) {
    const reviewExcluido = await Review.findByIdAndDelete(req.params.id);
    if (reviewExcluido) {
        res.json({ mensagem: "Excluído com sucesso!" })
    } else {
        res.status(404).json({ mensagem: "Review não encontrado!" })
    }
}

module.exports = {
    create,
    getById,
    getAll,
    update,
    deletar
}