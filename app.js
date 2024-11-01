const express = require('express');
const connectDB = require('./config/db');
const questionRoutes = require('./routes/questionRoutes');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', questionRoutes);


app.get('/view-questions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'question.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
