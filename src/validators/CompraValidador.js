const yup = require('yup');

const compraSchema = yup.object().shape({
    forma_pagamento: yup
        .string('Campo forma pagamento precisa ser um texto!')
        .required('Campo forma pagamento obrigatório!'),
    data_pagamento: yup
        .date("Este campo precisa ser uma data!"),
    total_pagar: yup
        .number('Campo total a pagar precisa ser um número!')
        .required('Campo total a pagar obrigatório!'),
    status: yup
        .string('Campo status precisa ser uma string!')
        .oneOf(['pago'], 'Campo status precisa ser "pago"!'),
    carrinho: yup
        .string()
        .required('Precisa informar o carrinho a ser pago!')
})

function compraValidador(req, res, next) {
    compraSchema
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

function alterarCompra(req, res, next) {
    if (req.params.id) {
        if (req.body.forma_pagamento || req.body.data_pagamento || req.body.total_pagar || req.body.status || req.body.carrinho) {
            next()
        } else {
            return res.status(400).json({ mensagem: "Precisa informar algum campo para ser alterado!" })
        }
    } else {
        return res.status(400).json({ mensagem: "Precisa informar qual é a compra!" });
    }
}

module.exports = {
    compraValidador,
    alterarCompra
}