const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

// configuração de middleware
app.use(express.json());

//importando rotas
const router = require('./routes/routes');
app.use("/", router);

//Rota para conexão de banco de dados
const db = require('./database/connection');
db()

app.listen(3000, () => {
    console.log("Aplicação rodando!")
})