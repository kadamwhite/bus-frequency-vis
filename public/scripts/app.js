'use strict';

var d3 = require( 'd3' );

// ELEMENTS

var containerNode = document.getElementById( 'container' );

// DATA STRUCTURE

var StopCollection = require( './collections/stop-collection' );
// var VisOne = require( './views/visualizations/vis-one' );
// var VisTwo = require( './views/visualizations/vis-two' );
var SpinnerView = require( './views/spinner-view' );

var stops = new StopCollection([]);

// Create the visualization elements
// var visOne = new VisOne({
//   collection: stops
// });
// var visTwo = new VisTwo({
//   collection: stops
// });
var spinnerVis = new SpinnerView({
  collection: stops
});

// DATA RETRIEVAL
function renderVis( data ) {

  console.log( data );

  // Timeout to fade out the spinner
  setTimeout(function renderAllVisualizations() {
    // Structure the data from the server, triggering all linked views
    stops.reset( data );

    // Show container
    containerNode.classList.add( 'fade-in' );
  }, 300 );
}

d3.json( '/data', renderVis );
