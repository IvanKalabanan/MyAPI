var mongoose    = require('mongoose');
var log         = require('./log')(module);
var nconf = require('nconf');
var config      = require('./config');

//mongoose.connect(config.get('mongoose:uri'));


nconf.argv()
    .env()
    .file({ file: './config.json' });

module.exports = nconf;

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

mongoose.model('kkk', {name: String});
