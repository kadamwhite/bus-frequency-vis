'use strict';

var d3 = require( 'd3' );
/* var _ =*/ window._ = require( 'lodash' );

// ELEMENTS
/* var svg =*/ require( './elements/svg' );

// DATA STRUCTURE
var StopCollection = require( './collections/stop-collection' );

var parseData = require( './lib/parse-data' );

// DATA RETRIEVAL
function renderVis( data ) {
  // console.log( parseData( data ) );
  var stops = new StopCollection( parseData( data ) );
  // data = _.map( data, dayToBusArray );
  console.log( stops );
  window.stops = stops;
}

d3.json( '/data', renderVis );
