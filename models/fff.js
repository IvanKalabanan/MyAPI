var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  name: String
});

//mongoose.model('kerb', usersSchema);

var kerbTable = mongoose.model('kerb', usersSchema);

module.exports.ArticleM = kerbTable;
