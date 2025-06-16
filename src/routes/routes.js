const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
// Configura storage do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));;
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Controllers
const ClienteController = require('../controllers/ClienteController');
const ProdutoController = require('../controllers/ProdutoController');
const ReviewController = require('../controllers/ReviewController');
const CarrinhoController = require('../controllers/CarrinhoController');
const CompraController = require('../controllers/CompraController');

//Importando o validador
// Validações de cliente
const { clienteValidador, alterarCliente, loginValidador } = require('../validators/ClienteValidator');

// Validações de produto
const { produtoValidador, alterarProduto } = require('../validators/ProdutoValidator');

// Validações de Review
const { reviewValidador, alterarReview } = require('../validators/ReviewValidator');

// Validações de Carrinho
const { carrinhoValidador, alterarCarrinho } = require('../validators/CarrinhoValidator');

// Validações de Compra
const { compraValidador, alterarCompra } = require('../validators/CompraValidador');

// Validação de ID
const { validarId } = require('../validators/validarId');

// Função de valiadação de role
const { verificarRole, checarToken } = require('../middlewares/auth');

// Rota de Cliente
router.post('/auth/login', loginValidador, ClienteController.login)
router.post('/clientes', clienteValidador, ClienteController.create);
router.get('/clientes', checarToken, verificarRole(['admin']), ClienteController.getAll);
router.get('/clientes/:id', checarToken, validarId, ClienteController.getById);
router.put('/clientes/:id', checarToken, validarId, alterarCliente, ClienteController.update);
router.delete('/clientes/:id', checarToken, validarId, ClienteController.deletar);
// Validação que tem que ser feita no front
router.get('/admin', checarToken, verificarRole(['admin']), (req, res) => {
  res.json({ mensagem: 'Bem-vindo ao painel administrativo!' });
});

// Rota de Produto
// Buscar por nome
router.get('/produtos/buscar', ProdutoController.buscarProdutoPorNome)
router.post('/produtos', upload.single('imagem'), checarToken, produtoValidador, verificarRole(['admin']), ProdutoController.create)
router.get('/produtos', ProdutoController.getAll);
router.get('/produtos/:id', ProdutoController.getById)
router.put('/produtos/:id', upload.single('imagem'), checarToken, validarId, alterarProduto, verificarRole(['admin']), ProdutoController.update)
router.delete('/produtos/:id', checarToken, validarId, verificarRole(['admin']), ProdutoController.deletar)

// Rota de Review
router.post('/reviews', checarToken, reviewValidador, ReviewController.create)
router.get('/reviews', checarToken, verificarRole(['admin']), ReviewController.getAll);
router.get('/reviews/:id', checarToken, validarId, ReviewController.getById)
router.put('/reviews/:id', checarToken, validarId, alterarReview, ReviewController.update)
router.delete('/reviews/:id', checarToken, validarId, ReviewController.deletar)

// Rota de Carrinho
router.get('/carrinhos/existente', checarToken, CarrinhoController.getCarrinhoAbertoByEmail)
router.post('/carrinhos', checarToken, carrinhoValidador, CarrinhoController.create)
router.get('/carrinhos', checarToken, verificarRole(['admin']), CarrinhoController.getAll);
router.get('/carrinhos/:id', checarToken, validarId, CarrinhoController.getById)
router.put('/carrinhos/:id', checarToken, validarId, alterarCarrinho, CarrinhoController.update)
router.delete('/carrinhos/:id', checarToken, validarId, CarrinhoController.deletar)
router.delete('/carrinhos/:id/retirar', checarToken, validarId, CarrinhoController.retirarItemCarrinho)

// Rota de Compra
router.post('/compras', checarToken, compraValidador, CompraController.create)
router.get('/compras', checarToken, verificarRole(['admin']), CompraController.getAll);
router.get('/compras/:id', checarToken, validarId, CompraController.getById)
router.put('/compras/:id', checarToken, validarId, alterarCompra, CompraController.update)
router.delete('/compras/:id', checarToken, validarId, CompraController.remove)

module.exports = router;