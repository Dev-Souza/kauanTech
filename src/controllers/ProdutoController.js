const Produto = require('../models/Produto');

async function create(req, res) {
    const categoria = req.body.categoria;
    const produto = new Produto({
        codigo_barras: req.body.codigo_barras,
        nome: req.body.nome,
        preco: Number(req.body.preco),
        quantidade: Number(req.body.quantidade),
        descricao: req.body.descricao,
        categoria: categoria.toUpperCase(),
        status: "Ativo"
    })
    const produtoCriado = await produto.save()
    res.status(201).json(produtoCriado);
}

async function getAll(req, res) {
    res.json(await Produto.find());
}

async function getById(req, res) {
    const produto = await Produto.findById(req.params.id)
    if (produto) {
        res.json(produto);
    } else {
        res.status(404).json("Produto não encontrado!");
    }
}

async function update(req, res) {
    const produtoAtualizado = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (produtoAtualizado) {
        res.json(produtoAtualizado)
    } else {
        res.status(404).json({ mensagem: "Produto não encontrado!" })
    }
}

async function deletar(req, res) {
    const produtoExcluido = await Produto.findByIdAndDelete(req.params.id);
    if (produtoExcluido) {
        res.json({ mensagem: "Excluído com sucesso!" })
    } else {
        res.status(404).json({ mensagem: "Produto não encontrado!" })
    }
}

module.exports = {
    create,
    getById,
    getAll,
    update,
    deletar
}