const mongoose = require('mongoose');

const SimulateSchema = new mongoose.Schema({
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] 
});

const Simulate = mongoose.model('Simulate', SimulateSchema);
module.exports = Simulate;
