const mongoose = require('mongoose');


const connection = () => {
    // Certifique-se de que a variável de ambiente DB_NAME esteja definida
    const DB_NAME = process.env.DB_NAME;

    // Monta a URI com o nome do banco
    const uri = `mongodb://localhost:27017/${DB_NAME}`;

    // Conecta ao MongoDB local
    mongoose.connect(uri)
        .then(() => console.log('Conectado ao MongoDB local!'))
        .catch(err => console.error('Erro na conexão:', err));
}

module.exports = connection
