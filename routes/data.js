'use strict';

var express = require( 'express' );
var router = express.Router();

// Serving existing data
// ============================================================================

var data = require( '../parsed-data.json' );

router.get( '/', function( req, res, next ) {
  res.status( 200 ).json( data );
});

// Rebuilding data
// ============================================================================

var fs = require( 'fs' );
var path = require( 'path' );
var rsvp = require( 'rsvp' );

var scheduleForDay = require( '../lib/api-utils' ).scheduleForDay;
var parseData = require( '../lib/parse-data' );
var paths = {
  data: path.join( __dirname, '../data.json' ),
  parsedData: path.join( __dirname, '../parsed-data.json' )
};

router.get( '/rebuild-data', function( req, res, next ) {
  var promises = [ 0, 1, 2, 3, 4, 5, 6 ].map(function( day ) {
    return scheduleForDay( day );
  });

  rsvp.all( promises ).then(function( response ) {
    // Write the raw API response to a file
    fs.writeFileSync( paths.data, JSON.stringify( response ), 'utf8' );

    // Write the parsed data file
    var parsedData = parseData( response );
    fs.writeFileSync( paths.parsedData, JSON.stringify( parsedData ), 'utf8' );

    // Return the parsed response
    res.status( 200 ).json( parsedData );
  }).catch(function( err ) {
    console.error( err );
    res.status( 500 ).json( err.message );
  });
});

module.exports = router;
