const Compra = require('../models/Compra')
const Carrinho = require('../models/Carrinho')

async function create(req, res) {
    //Buscando esse carrinho a ser pago
    const carrinhoAPagar = await Carrinho.findById(req.body.carrinho);

    //Validando se esse carrinho está aberto
    if (carrinhoAPagar.status == 'aberto') {
        const compra = new Compra({
            forma_pagamento: req.body.forma_pagamento,
            total_pagar: carrinhoAPagar.total_precos,
            carrinho: req.body.carrinho
        })
        
        //Alterando o status do carrinho para pago
        carrinhoAPagar.status = "pago";
        await carrinhoAPagar.save();
        const compraCriado = await compra.save();
        return res.json(compraCriado);
    }
    return res.status(400).json({ mensagem: "Este carrinho informado já foi pago!" })

}

async function getAll(req, res) {
    res.json(await Compra.find().populate({
        path: 'carrinho',
        populate: [
            {
                path: 'cliente',
                select: 'nome telefone email'
            },
            {
                path: 'produto.id',
                select: 'nome preco'
            }
        ]
    }))
}

async function getById(req, res) {
    const compra = await Compra.findById(req.params.id).populate({
        path: 'carrinho',
        populate: [
            {
                path: 'cliente',
                select: 'nome telefone email'
            },
            {
                path: 'produto.id',
                select: 'nome preco'
            }
        ]
    })
    if (compra) {
        res.json(compra)
    } else {
        res.status(404).json({ mensagem: "Compra não encontrato!" })
    }
}

async function update(req, res) {
    const compraAtualizado = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (compraAtualizado) {
        res.json(compraAtualizado)
    } else {
        res.status(404).json({ mensagem: "Compra não encontrato!" })
    }

}

async function remove(req, res) {
    const compraExcluido = await Compra.findByIdAndDelete(req.params.id)
    if (compraExcluido) {
        res.json({
            mensagem: "Compra excluido com sucesso!",
            compraExcluido
        })
    } else {
        res.status(404).json({ mensagem: "Compra não encontrato!" })
    }
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
}