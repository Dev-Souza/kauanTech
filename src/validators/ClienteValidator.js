require('dotenv').config();
const yup = require('yup');
const jwt = require('jsonwebtoken'); //Exportando a biblioteca do token para haver autenticação em minhas requisições

const JWT_SECRET = process.env.JWT_SECRET; //Pegando meu JWT lá do arquivo .env

const clienteSchema = yup.object().shape({
    nome: yup
        .string('Campo nome precisa ser um texto!')
        .required('Campo nome obrigatório!'),
    cpf: yup
        .string()
        .required('Campo CPF obrigatório!'),
    email: yup
        .string('Campo email precisa ser um texto!')
        .email('E-mail inválido!')
        .required('Campo email inválido!'),
    senha: yup
        .string()
        .required('Campo senha obrigatório!'),
    telefone: yup
        .string()
        .required('Campo telefone obrigatório!')
})

function clienteValidador(req, res, next) {
    clienteSchema
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

const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('E-mail inválido')
        .required('Campo e-mail obrigatório'),
    senha: yup
        .string('Campo senha precisa ser preenchido no formato')
        .required('Campo senha obrigatório')
})

function loginValidador(req, res, next) {
    loginSchema
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

async function checarToken(req, res, next) {
    try {
        const authorizationHeader = req.get('Authorization')
        const separator = authorizationHeader.split(' ')
        const token = separator[1]

        jwt.verify(token, JWT_SECRET)
        next()
    } catch (error) {
        return res.status(401).json({ mensagem: "Token inválido" })
    }
}

function alterarCliente(req, res, next) {
    if (req.params.id) {
        if (req.body.nome || req.body.cpf || req.body.email || req.body.senha || req.body.telefone || req.body.endereco) {
            next()
        } else {
            return res.status(400).json({ mensagem: "Precisa informar algum campo para ser alterado!" })
        }
    } else {
        return res.status(400).json({ mensagem: "Precisa informar qual é o cliente!" });
    }
}

module.exports = {
    clienteValidador,
    loginValidador,
    checarToken,
    alterarCliente
}