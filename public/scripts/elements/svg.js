'use strict';

var d3 = require( 'd3' );

var resizeStream = require( '../lib/resize.js' );

var svgElements = [];

function recomputeWidth( width ) {
  svgElements.forEach(function( svg ) {
    svg.attr( 'width', width );
  });
}

resizeStream.onValue( recomputeWidth );

function addSVG() {
  var svg = d3.select( '#container' ).append( 'svg' );

  // Add to SVG array
  svgElements.push( svg );

  // initial width computation
  // TODO: Some duplication b/w this and resize.js: can we force that stream to fire?
  recomputeWidth( document.body.clientWidth - 60 );

  return svg;
}

module.exports = {
  add: addSVG
};
