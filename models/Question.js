const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    banca: String,
    instituicao: String,
    prova: String,
    nivel: String,
    disciplina: String,
    assunto: String,
    pergunta: String,
    textoAux: String,
    imagemAux: String,
    alternatives: [
        {
            label: String,
            text: String
        }
    ],
    correctAnswer: String,
    explanation: String
});

module.exports = mongoose.model('Question', questionSchema);
