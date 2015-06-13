'use strict';

var express = require( 'express' );
var router = express.Router();

var fs = require( 'fs' );
var path = require( 'path' );

router.get( '/', function( req, res, next ) {
  var fileName = path.join( __dirname, '../data.json' );
  fs.readFile( fileName, function( err, data ) {
    res.status( 200 ).json( JSON.parse( data ) );
  }).catch(function( err ) {
    console.error( err );
    res.status( 500 ).json( err.message );
  });
});

module.exports = router;
