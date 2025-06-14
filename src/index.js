const express = require('express');
const cors = require('cors')
const app = express();
const path = require('path')

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

// configuração de middleware
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//importando rotas
const router = require('./routes/routes');
app.use("/", router);

//Rota para conexão de banco de dados
const db = require('./database/connection');
db()

app.listen(3000, () => {
    console.log("Aplicação rodando!")
})