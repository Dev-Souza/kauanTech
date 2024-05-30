const yup = require('yup');

const reviewSchema = yup.object().shape({
    rating: yup
        .number('Campo avaliação precisa ser de 1 a 5!')
        .required('Campo avaliação obrigatório!'),
    comentario: yup
        .string()
        .required('Campo comentário obrigatório!'),
    data_review: yup
        .date('Data inválida!'),
    produto: yup
        .string()
        .required('Precisa-se informar qual é o produto!'),
    cliente: yup
        .string()
        .required('Precisa-se informar quem é o cliente!'),
})

function reviewValidador(req, res, next) {
    reviewSchema
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

function alterarReview(req, res, next) {
    if(req.params.id){
        if(req.body.rating || req.body.comentario){
            next()
        }else {
            return res.status(400).json({mensagem: "Precisa informar algum campo para ser alterado!"})
        }
    }else{
        return res.status(400).json({mensagem: "O review precisa ser informado para ser alterado!"})
    }
}

module.exports = {
    reviewValidador,
    alterarReview
}