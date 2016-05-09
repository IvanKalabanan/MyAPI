var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  dish_name: String,
  recipe: String,
  foto: String,
  type: String
});

//mongoose.model('kerb', usersSchema);

var dish_table = mongoose.model('dishes', usersSchema);

module.exports.ArticleDish = dish_table;
