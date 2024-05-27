const express = require('express');
const app = express();

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