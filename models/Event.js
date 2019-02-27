const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    type:{type: mongoose.Schema.Types.String, required: true},
    eventdate: {type: mongoose.Schema.Types.String, required: true},
    place:{type: mongoose.Schema.Types.String, required: true},
    maxplayers:{type: mongoose.Schema.Types.Number, required: true},
    time:{type: mongoose.Schema.Types.String, required: true},
    users:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    pastEvent:{type:mongoose.Schema.Types.Boolean, default:false},
    results:[{type:mongoose.Schema.Types.ObjectId, ref:"Result"}]
});

const EventTable = mongoose.model('Event', eventSchema);

module.exports = EventTable;