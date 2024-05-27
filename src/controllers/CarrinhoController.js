const Carrinho = require('../models/Carrinho');

async function create(req, res) {
    const carrinho = new Carrinho(req.body)
    const carrinhoCriado = await carrinho.save()
    res.status(201).json(carrinhoCriado);
}

async function getAll(req, res) {
    res.json(await Carrinho.find()
    .populate('cliente')
    .populate('produto.id'));
}

async function getById(req, res) {
    const carrinho = await Carrinho.findById(req.params.id)
    if (carrinho) {
        res.json(carrinho);
    } else {
        res.status(404).json("Carrinho não encontrado!");
    }
}

async function update(req, res) {
    const carrinhoAtualizado = await Carrinho.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (carrinhoAtualizado) {
        res.json(carrinhoAtualizado)
    } else {
        res.status(404).json({ mensagem: "Carrinho não encontrado!" })
    }
}

async function deletar(req, res) {
    const carrinhoExcluido = await Carrinho.findByIdAndDelete(req.params.id);
    if (carrinhoExcluido) {
        res.json({ mensagem: "Excluído com sucesso!" })
    } else {
        res.status(404).json({ mensagem: "Carrinho não encontrado!" })
    }
}

module.exports = {
    create,
    getById,
    getAll,
    update,
    deletar
}