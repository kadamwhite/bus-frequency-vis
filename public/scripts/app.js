'use strict';

var d3 = require( 'd3' );
/* var _ =*/ window._ = require( 'lodash' );

// DATA STRUCTURE
var StopCollection = require( './collections/stop-collection' );

var parseData = require( './lib/parse-data' );

// DATA RETRIEVAL
function renderVis( data ) {
  var stops = new StopCollection( parseData( data ) );

  require( './visualizations/vis-one' ).render( stops );
}

d3.json( '/data', renderVis );
