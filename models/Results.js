const mongoose = require('mongoose');

const resultsSchema = new mongoose.Schema({
    type:{type: mongoose.Schema.Types.String, required:true},
    event:{type: mongoose.Schema.Types.ObjectId,  ref: "Event",required:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    buyIn:{type: mongoose.Schema.Types.Number, required:true},
    cashOut:{type: mongoose.Schema.Types.Number, required:true}
});

const Result = mongoose.model("Result", resultsSchema);

module.exports = Result;