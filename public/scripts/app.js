'use strict';

var d3 = require( 'd3' );

// ELEMENTS

var containerNode = document.getElementById( 'container' );

// DATA STRUCTURE

var StopCollection = window.SC = require( './collections/stop-collection' );
var SpinnerView = require( './views/spinner-view' );
var ContainerView = require( './views/container-view' );

var stops = new StopCollection([]);

// Create the visualization elements
// var visOne = new VisOne({
//   collection: stops
// });
// var visTwo = new VisTwo({
//   collection: stops
// });
var spinner = new SpinnerView({
  el: document.querySelectorAll( '.spinner' ).item( 0 ),
  collection: stops
});
var container = new ContainerView({
  el: document.getElementById( 'container' ),
  collection: stops
});

// DATA RETRIEVAL: and yes this is overly cute
d3.json( '/data', function( data ) {
  stops.reset( data );
});
