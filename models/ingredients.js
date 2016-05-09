var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  id_dish: Stasriring,
  name: String,
  quantity: String
});

//mongoose.model('kerb', usersSchema);

var ingredients_table = mongoose.model('ingredients', usersSchema);

module.exports.ArticleIngredients = ingredients_table;
