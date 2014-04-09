
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , movie = require("./routes/movie")
  , http = require("http");

var router = express();
//var app = module.exports = express.createServer();
//module.exports = router;
var server = http.createServer(router);

// Configuration

router.configure(function(){
  router.set('views', __dirname + '/views');
  router.set('view engine', 'jade');
  router.use(express.bodyParser());
  router.use(express.methodOverride());
  router.use(router.router);
  router.use(express.static(__dirname + '/public'));
});

router.configure('development', function(){
  router.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

router.configure('production', function(){
  router.use(express.errorHandler());
});

console.log("Chat server listening at", process.env.IP + ":" + process.env.PORT);

// Routes

router.get('/genre', function(req, res){
    movie.getGenres(req, res);
    });
router.get('/', routes.index);


server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
});
