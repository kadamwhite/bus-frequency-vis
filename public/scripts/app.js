'use strict';

var d3 = require( 'd3' );

function renderVis( data ) {
  console.log( data );
}

d3.json( '/data', renderVis );
