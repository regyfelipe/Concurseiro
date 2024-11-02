const express = require('express');
const connectDB = require('./config/db');
const questionRoutes = require('./routes/questionRoutes');
const Simulate = require('./models/Simulate'); 
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 

app.use('/api', questionRoutes);

app.get('/create-simulate', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createSimulate.html'));
});

app.get('/view-questions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'question.html'));
});

app.get('/simulate/:id', async (req, res) => {
    try {
        const simulate = await Simulate.findById(req.params.id).populate('questions');
        if (!simulate) {
            return res.status(404).send('Simulado não encontrado.');
        }
        res.render('simulate', { simulate });
    } catch (error) {
        console.error('Erro ao buscar simulado:', error);
        res.status(500).send(`Erro ao buscar simulado: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
