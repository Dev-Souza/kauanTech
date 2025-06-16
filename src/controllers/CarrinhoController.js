const Carrinho = require('../models/Carrinho');
const Produto = require('../models/Produto');
const Cliente = require('../models/Cliente');

async function create(req, res) {
    const { cliente, produto } = req.body;

    try {
        // Verificar se existe um carrinho aberto para o cliente
        let carrinhoExistente = await Carrinho.findOne({ cliente, status: 'aberto' });

        if (!carrinhoExistente) {
            // Se não existir carrinho aberto, criar um novo carrinho
            let total_precos = 0;

            // Calcular o total de preços dos produtos no novo carrinho
            for (let item of produto) {
                const produtoDetalhes = await Produto.findById(item.id);
                if (produtoDetalhes) {
                    if (produtoDetalhes.quantidade < item.quantidade) { //Verificando se a quantidade suficiente em estoque
                        return res.status(400).json({ mensagem: "Não existe quantidade suficiente para essa aquisição" });
                    }
                    total_precos += produtoDetalhes.preco * item.quantidade;
                    produtoDetalhes.quantidade -= item.quantidade; // Diminuindo a quantidade requisitada no estoque
                    await produtoDetalhes.save(); // Atualizando o estoque do produto
                }
            }

            // Criar um novo carrinho
            const carrinho = new Carrinho({
                total_precos,
                status: 'aberto', // Definindo status padrão como 'aberto'
                cliente,
                produto
            });

            const carrinhoCriado = await carrinho.save();
            return res.status(201).json(carrinhoCriado);
        } else {
            // Se existir carrinho aberto, adicionar o novo produto
            for (let item of produto) {
                const produtoDetalhes = await Produto.findById(item.id);
                if (produtoDetalhes) {
                    if (produtoDetalhes.quantidade < item.quantidade) {
                        return res.status(400).json({ mensagem: "Não existe quantidade suficiente para essa aquisição" });
                    }
                    const produtoExistente = carrinhoExistente.produto.find(p => p.id.toString() === item.id);
                    if (produtoExistente) {
                        // Se o produto já existir no carrinho, atualizar a quantidade
                        produtoExistente.quantidade += item.quantidade;
                    } else {
                        // Se o produto não existir, adicionar ao carrinho
                        carrinhoExistente.produto.push({ id: produtoDetalhes._id, quantidade: item.quantidade });
                    }
                    carrinhoExistente.total_precos += produtoDetalhes.preco * item.quantidade;
                    produtoDetalhes.quantidade -= item.quantidade;
                    await produtoDetalhes.save(); // Atualizando o estoque do produto
                }
            }
            await carrinhoExistente.save();

            return res.status(200).json(carrinhoExistente);
        }
    } catch (error) {
        console.error(error);
        return res.status(404).json({ mensagem: 'Erro ao criar ou atualizar o carrinho', error });
    }
};

async function retirarItemCarrinho(req, res) {
    try {
        const carrinhoExistente = await Carrinho.findById(req.params.id);
        const itemParaSubtrair = req.body; // Pega os elementos que estão vindo lá no postman
        const produtoEncontrado = await Produto.findById(req.body.produtoId);

        if (!carrinhoExistente) {
            return res.status(400).json({ mensagem: "Esse carrinho informado não existe!" });
        }

        let produtoEncontradoNoCarrinho = false;
        for (let item of carrinhoExistente.produto) { // Estou destrinchando esse meu array produto
            if (itemParaSubtrair.produtoId == item.id) {
                produtoEncontradoNoCarrinho = true; //Significa que o produto foi encontrado

                if (itemParaSubtrair.quantidade <= item.quantidade) { // Verifica se a quantidade que quer diminuir é menor ou igual à quantidade que tem no carrinho
                    item.quantidade -= itemParaSubtrair.quantidade; // Diminui a quantidade que foi pedida

                    // Atualizar o preço total do carrinho
                    carrinhoExistente.total_precos -= produtoEncontrado.preco * itemParaSubtrair.quantidade;

                    // Remover o item se a quantidade for zero
                    if (item.quantidade === 0) {
                        carrinhoExistente.produto = carrinhoExistente.produto.filter(p => p.id !== item.id);
                    }

                    // Devolver a quantidade para o estoque
                    produtoEncontrado.quantidade += itemParaSubtrair.quantidade
                    await produtoEncontrado.save();

                    // Verifica se o carrinho não tem nenhum produto e, se não tiver, EXCLUI o carrinho
                    if (carrinhoExistente.produto.length === 0) {
                        await Carrinho.findByIdAndDelete(req.params.id);
                        return res.json({ mensagem: "Carrinho excluído porque não há produtos nele." });
                    }

                    await carrinhoExistente.save();
                    return res.json({ mensagem: "Quantidade atualizada com sucesso!" });
                } else {
                    return res.status(400).json({ mensagem: "Quantidade maior do que tem no carrinho!" });
                }
            }
        }

        //Caso o produto não seja encontrado
        if (!produtoEncontradoNoCarrinho) {
            return res.status(400).json({ mensagem: "Informe um produto que existe no carrinho!" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: error.message });
    }
}

async function getAll(req, res) {
    try {
        const carrinhos = await Carrinho.find().populate({
            path: 'cliente',
            select: 'nome cpf telefone'
        }).populate({
            path: 'produto.id',
            select: 'nome preco'
        });

        res.json(carrinhos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar carrinhos', error });
    }
}

async function getCarrinhoAbertoByEmail(req, res) {
    try {
        const { email } = req.query;

        // Verificar se o cliente existe
        const clienteExistente = await Cliente.findOne({ email });
        if (!clienteExistente) {
            return res.status(404).json({ mensagem: "Esse cliente informado não existe!" });
        }

        // Buscar o carrinho aberto do cliente
        const carrinhoExistente = await Carrinho.findOne({ cliente: clienteExistente._id, status: 'aberto' })
            .populate({
                path: 'cliente',
                select: 'nome email'
            })
            .populate({
                path: 'produto.id',
                select: 'nome preco'
            });

        if (!carrinhoExistente) {
            return res.status(200).json({ mensagem: "Nenhum carrinho aberto encontrado para esse cliente." });
        }

        return res.status(200).json(carrinhoExistente);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar carrinho", error });
    }
}

async function getQtdInCarrinhoByEmail(req, res) {
    try {
        const { email } = req.query;

        // Verifica se o cliente existe
        const clienteExistente = await Cliente.findOne({ email });
        if (!clienteExistente) {
            return res.status(404).json({ mensagem: "Esse cliente informado não existe!" });
        }

        // Busca o carrinho aberto do cliente
        const carrinhoExistente = await Carrinho.findOne({
            cliente: clienteExistente._id,
            status: 'aberto'
        });

        if (!carrinhoExistente) {
            return res.status(200).json({ quantidade: 0 });
        }

        // Calcula a quantidade total de produtos (soma de todas as quantidades)
        const quantidadeTotal = carrinhoExistente.produto.reduce((total, item) => total + item.quantidade, 0);

        return res.status(200).json({ quantidade: quantidadeTotal });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar quantidade no carrinho", error });
    }
}

async function getById(req, res) {
    try {
        const carrinho = await Carrinho.findById(req.params.id).populate({
            path: 'cliente',
            select: 'nome cpf telefone'
        }).populate({
            path: 'produto.id',
            select: 'nome preco'
        });
        if (carrinho) {
            res.json(carrinho);
        } else {
            res.status(404).json("Carrinho não encontrado!");
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar carrinho', error });
    }
}

async function update(req, res) {
    try {
        const carrinhoAtualizado = await Carrinho.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (carrinhoAtualizado) {
            res.json(carrinhoAtualizado);
        } else {
            res.status(404).json({ mensagem: "Carrinho não encontrado!" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar carrinho', error });
    }
}

async function deletar(req, res) {
    try {
        const carrinhoExcluido = await Carrinho.findByIdAndDelete(req.params.id);
        if (carrinhoExcluido) {
            res.json({ mensagem: "Excluído com sucesso!" });
        } else {
            res.status(404).json({ mensagem: "Carrinho não encontrado!" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir carrinho', error });
    }
}

module.exports = {
    create,
    getById,
    getAll,
    update,
    deletar,
    retirarItemCarrinho,
    getCarrinhoAbertoByEmail,
    getQtdInCarrinhoByEmail
};
