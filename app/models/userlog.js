var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userLogSchema = new Schema({
    id: String,
    name: String,
    action: String,
    target: String,
    timestamp: Date
});

module.exports = mongoose.model('UserLog', userLogSchema);