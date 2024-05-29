const express = require('express');
const router = express.Router();

// Controllers
const ClienteController = require('../controllers/ClienteController');
const ProdutoController = require('../controllers/ProdutoController');
const ReviewController = require('../controllers/ReviewController');
const CarrinhoController = require('../controllers/CarrinhoController');

//Importando o validador
// Validações de cliente
const { clienteValidador, alterarCliente, loginValidador, checarToken } = require('../validators/ClienteValidator');

// Validações de produto
const { produtoValidador, alterarProduto } = require('../validators/ProdutoValidator');

// Validações de Review
const { reviewValidador, alterarReview } = require('../validators/ReviewValidator');

// Validações de Carrinho
const { carrinhoValidador, alterarCarrinho } = require('../validators/CarrinhoValidator');

// Validação de ID
const { validarId } = require('../validators/validarId');

// Rota de Cliente
router.post('/auth/login', loginValidador, ClienteController.login)
router.post('/clientes', clienteValidador, ClienteController.create);
router.get('/clientes', checarToken, ClienteController.getAll);
router.get('/clientes/:id', checarToken, validarId, ClienteController.getById);
router.put('/clientes/:id', checarToken, validarId, alterarCliente, ClienteController.update);
router.delete('/clientes/:id', checarToken, validarId, ClienteController.deletar);

// Rota de Produto
router.post('/produtos', checarToken, produtoValidador, ProdutoController.create)
router.get('/produtos', checarToken, ProdutoController.getAll);
router.get('/produtos/:id', checarToken, validarId, ProdutoController.getById)
router.put('/produtos/:id', checarToken, validarId, alterarProduto, ProdutoController.update)
router.delete('/produtos/:id', checarToken, validarId, ProdutoController.deletar)

// Rota de Review
router.post('/reviews', checarToken, reviewValidador, ReviewController.create)
router.get('/reviews', checarToken, ReviewController.getAll);
router.get('/reviews/:id', checarToken, validarId, ReviewController.getById)
router.put('/reviews/:id', checarToken, validarId, alterarReview, ReviewController.update)
router.delete('/reviews/:id', checarToken, validarId, ReviewController.deletar)

// Rota de Carrinho
router.post('/carrinhos', checarToken, carrinhoValidador, CarrinhoController.create)
router.get('/carrinhos', checarToken, CarrinhoController.getAll);
router.get('/carrinhos/:id', checarToken, validarId, CarrinhoController.getById)
router.put('/carrinhos/:id', checarToken, validarId, alterarCarrinho, CarrinhoController.update)
router.delete('/carrinhos/:id', checarToken, validarId, CarrinhoController.deletar)
router.delete('/carrinhos/:id/retirar', checarToken, validarId, CarrinhoController.retirarItemCarrinho)

module.exports = router;