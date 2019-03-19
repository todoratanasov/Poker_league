const mongoose = require('mongoose');

const resultsSchema = new mongoose.Schema({
    event:{type: mongoose.Schema.Types.ObjectId,  ref: "Event",required:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    buyIn:{type: mongoose.Schema.Types.Number, required:true},
    cashOut:{type: mongoose.Schema.Types.Number, required:true},
    totalPoints:{type: mongoose.Schema.Types.Number, default:0}
});

const Result = mongoose.model("Result", resultsSchema);

module.exports = Result;