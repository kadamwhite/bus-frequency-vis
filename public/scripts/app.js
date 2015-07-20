'use strict';
/* jshint unused: false */// directive to suppress lint errors for view vars

var d3 = require( 'd3' );

// DATA STRUCTURE

var StopCollection = window.SC = require( './collections/stop-collection' );
var SpinnerView = require( './views/spinner-view' );
var ContainerView = require( './views/container-view' );

var stops = new StopCollection([]);

// ELEMENTS

var spinner = new SpinnerView({
  el: document.querySelectorAll( '.spinner' ).item( 0 ),
  collection: stops
});
var container = new ContainerView({
  el: document.getElementById( 'container' ),
  collection: stops
});

// DATA RETRIEVAL
d3.json( '/data', function( data ) {
  stops.reset( data );
});
// Swap this in for the prior to help in rendering a static page
// stops.reset( require( '../../parsed-data.json' ) );
