const yup = require('yup');

// Schema para validar cada produto no array de produtos
const produtoSchema = yup.object().shape({
    id: yup
        .string()
        .required('ID do produto é obrigatório'),
    quantidade: yup
        .number()
        .required('Quantidade é obrigatória')
        .positive('Quantidade deve ser positiva')
});

// Schema para validar o carrinho
const carrinhoSchema = yup.object().shape({
    total_precos: yup
        .number('Campo total preços tem que ser um número!')
        .required('Campo total preços obrigatório!'),
    data_criacao: yup
        .date('Campo data criação precisa ser uma data!')
        .required('Campo data criação obrigatório!'),
    status: yup
        .string('Campo status precisa ser uma string!')
        .oneOf(['aberto', 'pago'], 'Campo status precisa ser "aberto" ou "pago"!')
        .required('Campo status obrigatório!'),
    cliente: yup
        .string()
        .required('Precisa-se informar quem é o cliente!')
        .matches(/^[0-9a-fA-F]{24}$/, 'ID do cliente inválido'),  // Verifica se o ID é um ObjectId válido do MongoDB
    produto: yup
        .array()
        .of(produtoSchema)  // Usa o produtoSchema para validar cada objeto no array de produtos
        .min(1, 'Deve haver pelo menos um produto')
        .required('Precisa-se informar os produtos!')
});

function carrinhoValidador(req, res, next) {
    carrinhoSchema
        .validate(req.body, { abortEarly: false })
        .then(() => next())
        .catch(e => {
            const errors = e.inner.map(error => ({
                campo: error.path,
                erros: error.errors
            }));
            res.status(400).json({
                mensagem: "Falha na validação dos campos",
                erros: errors
            });
        });
}

function alterarCarrinho(req, res, next) {
    if (req.params.id) {
        if (req.body.total_precos || req.body.data_criacao || req.body.status || req.body.cliente || req.body.produto) {
            next();
        } else {
            return res.status(400).json({ mensagem: "Precisa informar algum campo para ser alterado!" });
        }
    } else {
        return res.status(400).json({ mensagem: "Precisa informar quem é o carrinho!" });
    }
}

module.exports = {
    carrinhoValidador,
    alterarCarrinho
};