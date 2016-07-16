var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var expressHandlebars = require('express-handlebars');

var app = express();

// view engine setup
app.engine('.hbs', expressHandlebars({
    extname: '.hbs',
    layoutsDir: 'views',
    helpers: require('./lib/util/server-handlebar-helpers'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'index'
}));

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.set('port', '3111');
app.set('GOOGLE_API', 'AIzaSyCV4F7s1JuDChWLGFG-2S5rmSbdGnOM2CI');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//module.exports = app;
var http = require('http');
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
