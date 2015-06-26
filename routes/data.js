'use strict';

var express = require( 'express' );
var router = express.Router();

var data = require( '../parsed-data.json' );

router.get( '/', function( req, res, next ) {
  res.status( 200 ).json( data );
});

module.exports = router;
