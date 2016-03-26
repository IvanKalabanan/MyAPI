var express = require('express');
var path = require('path'); // модуль для парсинга пути
var log = require('./libs/log')(module);
var app = express();
//var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var fs = require('fs');
var kerbTable    = require('./models/fff').ArticleM;
mongoose.connect('mongodb://localhost:27017/kerb');

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


//app.use(logger('dev')); // выводим все запросы со статусами в консоль
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // стандартный модуль, для парсинга JSON в запросах
app.use(methodOverride()); // поддержка put и delete
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)


// Статті -

app.get('/api', function (req, res) {
  return kerbTable.find(function (err, tabl) {
        if (!err) {
            return res.send(tabl);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});



app.post('/api', function(req, res) {
  var article = new kerbTable({
        name: req.body.name
    });

    article.save(function (err) {
        if (!err) {
            log.info("article created");
            return res.send({ status: 'OK', article:article });
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

app.delete('/api/:id', function (req, res){
  return kerbTable.findById(req.params.id, function (err, article) {
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
app.set('port', (process.env.PORT || 1337));

app.listen(app.get('port'), function(){
    console.log('Node app is running on port', app.get('port'));
});
