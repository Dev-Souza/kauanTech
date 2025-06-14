const fs = require('fs');
const path = require('path');
const Produto = require('../models/Produto');

async function create(req, res) {
    try {
        const categoria = req.body.categoria;

        let imagemPath = null;
        if (req.file) {
            imagemPath = `/uploads/${req.file.filename}`;
        }

        const produto = new Produto({
            codigo_barras: req.body.codigo_barras,
            nome: req.body.nome,
            preco: Number(req.body.preco),
            quantidade: Number(req.body.quantidade),
            descricao: req.body.descricao,
            categoria: categoria.toUpperCase(),
            status: req.body.status,
            imagem: imagemPath
        });

        const produtoCriado = await produto.save();
        res.status(201).json(produtoCriado);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar produto', error: error.message });
    }
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
    try {
        const { id } = req.params;
        const produtoExistente = await Produto.findById(id);

        if (!produtoExistente) {
            return res.status(404).json({ mensagem: "Produto não encontrado!" });
        }

        // Se uma nova imagem foi enviada, deleta a antiga (se existir)
        if (req.file) {
            if (produtoExistente.imagem) {
                const nomeArquivo = produtoExistente.imagem.replace('/uploads/', '');
                const caminhoImagem = path.join(__dirname, '..', 'uploads', nomeArquivo);

                fs.unlink(caminhoImagem, (err) => {
                    if (err) console.error("Erro ao deletar imagem antiga:", err);
                });
            }
        }

        // Monta dados a atualizar
        const updatedData = {
            codigo_barras: req.body.codigo_barras,
            nome: req.body.nome,
            preco: Number(req.body.preco),
            quantidade: Number(req.body.quantidade),
            descricao: req.body.descricao,
            categoria: req.body.categoria?.toUpperCase(),
            status: req.body.status,
        };

        // Atualiza imagem somente se enviou nova
        if (req.file) {
            updatedData.imagem = `/uploads/${req.file.filename}`;
        }

        const produtoAtualizado = await Produto.findByIdAndUpdate(id, updatedData, { new: true });
        res.json(produtoAtualizado);
    } catch (error) {
        console.error("Erro no update:", error);
        res.status(500).json({ mensagem: "Erro ao atualizar produto", erro: error.message });
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