'use strict';

var d3 = require( 'd3' );
/* var _ =*/ window._ = require( 'lodash' );

// ELEMENTS

var spinnerNode = document.querySelectorAll( '.spinner' ).item( 0 );
var containerNode = document.getElementById( 'container' );

// Fade in the spinner
spinnerNode.classList.add( 'fade-in' );

// DATA STRUCTURE

var StopCollection = require( './collections/stop-collection' );
var parseData = require( './lib/parse-data' );

// DATA RETRIEVAL
function renderVis( data ) {
  var stops = new StopCollection( parseData( data ) );

  spinnerNode.classList.add( 'fade-out' );

  // Timeout to fade out the spinner
  setTimeout(function renderAllVisualizations() {
    // Fully remove the spinner
    spinnerNode.remove();

    // Create the visualization elements
    require( './visualizations/vis-one' ).render( stops );
    require( './visualizations/vis-two' ).render( stops );

    // Show container
    containerNode.classList.add( 'fade-in' );
  }, 300 );
}

d3.json( '/data', renderVis );
