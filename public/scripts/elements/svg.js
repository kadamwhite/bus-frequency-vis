'use strict';

var d3 = require( 'd3' );

var windowWidth = require( '../lib/window-width' );

var svgElements = [];

function recomputeWidth( width ) {
  svgElements.forEach(function( svg ) {
    svg.attr( 'width', width );
  });
}

windowWidth.stream.onValue( recomputeWidth );

function addSVG() {
  var svg = d3.select( '#container' ).append( 'svg' );

  // Add to SVG array
  svgElements.push( svg );

  // initial width computation
  // TODO: Some duplication b/w this and resize.js: can we force that stream to fire?
  recomputeWidth( windowWidth.get() );

  return svg;
}

module.exports = {
  add: addSVG
};
