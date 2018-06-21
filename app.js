var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Create de database connection
require('./lib/connectMongoose');

/**
 * Modelos de base de datos
 */
require('./models/Ad');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var anunciosApiRouter = require('./routes/apiv1/ads');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Middlewares de la API
 */
app.use('/apiv1/anuncios', anunciosApiRouter);

/**
 * Ficheros estáticos
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Variables globales ejs
 */
app.locals.title = 'Nodepop';

/**
 * Middlewares del front de la aplicación
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if(err.array) { // validation error
      err.status = 422;
      const errInfo = err.array({ onlyFirstError: true })[0]; // muestra solo 1 error, pero se podrían mostrar todos.
      err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  // render the error page
  res.status(err.status || 500);

  // Si es una petición de API, respondemos con JSON
  if( isAPI(req) ) {
    res.json( { success: false, error: err.message } );
    return;
  } else {
    res.render('error');
  }
});

function isAPI(req) {
  return req.originalUrl.indexOf( '/apiV' ) === 0;
}

module.exports = app;
