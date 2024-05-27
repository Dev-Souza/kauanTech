const Review = require('../models/Review');

async function create(req, res) {
    const dataAtual = new Date();
    const review = new Review({
        rating: req.body.rating,
        comentario: req.body.comentario,
        data_review: dataAtual.toLocaleString(), //Para pegar a data e a hora da crição do review
        produto: req.body.produto,
        cliente: req.body.cliente
    })
    const reviewCriado = await review.save()
    res.status(201).json(reviewCriado);
}

async function getAll(req, res) {
    res.json(await Review.find());
}

async function getById(req, res) {
    const review = await Review.findById(req.params.id)
    if (review) {
        res.json(review);
    } else {
        res.status(404).json("Review não encontrado!");
    }
}

async function update(req, res) {
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