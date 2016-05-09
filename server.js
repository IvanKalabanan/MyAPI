var express = require('express');
var path = require('path'); // модуль для парсинга пути
var log = require('./libs/log')(module);
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var fs = require('fs');
var dish_table    = require('./models/dish').ArticleDish;
var ingredients_table    = require('./models/ingredients').ArticleIngredients;
mongoose.connect('mongodb://localhost:27017/dish');

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

// прогрузка файлу з базою
/*fs.readdirSync('./models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require('./models/' + filename)
});*/


app.use(logger('dev')); // выводим все запросы со статусами в консоль
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // стандартный модуль, для парсинга JSON в запросах
app.use(methodOverride()); // поддержка put и delete
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)


// Статті -

//ingredients

app.get('/ingredients', function (req, res) {
  return ingredients_table.find(function (err, tabl) {
        if (!err) {
            return res.send(tabl);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});



app.post('/ingredients', function(req, res) {
  var ingred_article = new ingredients_table({
        id_dish: req.body.id_dish,
        name: req.body.name,
        quantity: req.body.quantity
    });

    ingred_article.save(function (err) {
        if (!err) {
            log.info("article created");
            return res.send({ status: 'OK', ingred_article:ingred_article });
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

//

//dish
app.get('/dish', function (req, res) {
  return dish_table.find(function (err, tabl) {
        if (!err) {
            return res.send(tabl);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});



app.post('/dish', function(req, res) {
  var dish_article = new dish_table({
        dish_name: req.body.dish_name,
        recipe: req.body.recipe,
        foto: req.body.foto,
        type: req.body.type
    });

    dish_article.save(function (err) {
        if (!err) {
            log.info("article created");
            return res.send({ status: 'OK', dish_article:dish_article });
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

app.delete('/dish/:id', function (req, res){
  return dish_table.findById(req.params.id, function (err, article) {
      if(!article) {
          res.statusCode = 404;
          return res.send({ error: 'Not found' });
      }
      return article.remove(function (err) {
          if (!err) {
              log.info("article removed");
              return res.send({ status: 'OK' });
          } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              return res.send({ error: 'Server error' });
          }
      });
  });
});

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));

// -

// Обработчік помилок -
app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});
});
// -


app.listen(80,'192.168.0.102', function(){
    log.info('Express server listening on port 1337');
});
