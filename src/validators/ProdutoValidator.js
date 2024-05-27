const yup = require('yup');

const produtoSchema = yup.object().shape({
    codigo_barras: yup
        .string('Campo código de barras precisa ser válido!')
        .required('Campo código de barras obrigatório!'),
    nome: yup
        .string('Campo nome precisa ser um texto!')
        .required('Campo nome obrigatório!'),
    preco: yup
        .number('Campo preço precisa ser um número!')
        .required('Campo preço obrigatório!'),
    quantidade: yup
        .number('Campo quantidade precisar ser um número!')
        .required('Campo quantidade obrigatório!'),
    descricao: yup
        .string(),
    categoria: yup
        .string('Campo categoria precisa ser um texto!')
        .required('Campo categoria obrigatório!'),
    status: yup
        .string('Precisa ser ativo ou inativo!')
})

function produtoValidador(req, res, next) {
    produtoSchema
        .validate(req.body, { abortEarly: false })
        .then(() => next())
        .catch(e => {
            const errors = e.inner.map(e => {
                const erro = {
                    campo: e.path,
                    erros: e.errors
                }
                return erro
            })
            res.status(400).json(
                {
                    mensagem: "Falha na validação dos campos",
                    erros: errors
                }
            )
        })
}

function alterarProduto(req, res, next) {
    if (req.params.id) {
        if (req.body.codigo_barras || req.body.nome || req.body.preco || req.body.quantidade || req.body.descricao || req.body.categoria || req.body.status) {
            next()
        } else {
            return res.status(400).json({ mensagem: "Precisa informar algum campo para ser alterado!" })
        }
    } else {
        return res.status(400).json({ mensagem: "Precisa informar qual é o produto!" })
    }
}

module.exports = {
    produtoValidador,
    alterarProduto
}