'use strict';

var d3 = require( 'd3' );

var data = d3.json( '/data', function( data ) {
  console.log( data );
});
