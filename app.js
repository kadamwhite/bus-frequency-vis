'use strict';

var express = require( 'express' );
var path = require( 'path' );
var favicon = require( 'serve-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );

var browserify = require( 'browserify-middleware' );
var combynExpress = require( 'combynexpress' );

var routes = require( './routes/index' );
var users = require( './routes/users' );

var app = express(  );

// View engine setup

app.engine( 'html', combynExpress() );
app.set( 'view engine', 'html' );

// Logging & Parsing

app.use( favicon( __dirname + '/public/favicon.ico' ) );
app.use( logger( 'dev' ) );
app.use( bodyParser.json(  ) );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser(  ) );

// Middleware setup

var publicDir = path.join( __dirname, 'public' );

app.use( require( 'stylus' ).middleware( publicDir ) );

// Specify transforms here (instead of package.json 'browserify' section) for obviousness
browserify.settings({
  debug: true,
  transform: [
    // Auto-parse combyne templates
    [ 'combynify' ]
  ]
});

// Bundle and serve first-party application code
app.get( '/scripts/app.js', browserify( path.join( publicDir, 'scripts/app.js' ) ) );

// For anything else, use static files
app.use( express.static( publicDir ) );

// Routing

app.use( '/', routes );
app.use( '/users', users );

// catch 404 and forward to error handler
app.use( function( req, res, next ) {
  var err = new Error( 'Not Found' );
  err.status = 404;
  next( err );
} );

// error handlers

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
  app.use( function( err, req, res, next ) {
    res.status( err.status || 500 );
    res.render( 'error', {
      message: err.message,
      error: err
    } );
  } );
}

// production error handler
// no stacktraces leaked to user
app.use( function( err, req, res, next ) {
  res.status( err.status || 500 );
  res.render( 'error', {
    message: err.message,
    error: {}
  } );
} );

module.exports = app;
