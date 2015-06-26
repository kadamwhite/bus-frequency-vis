'use strict';

var d3 = require( 'd3' );
var _ = require( 'lodash' );

var svgElements = [];

function getWidth() {
  // 30px margin on either side
  return document.body.clientWidth - 60;
}

function recomputeWidth( svg ) {
  var newWidth = getWidth;
  svg.attr( 'width', newWidth );
}

window.onresize = _.debounce(function() {
  svgElements.forEach( recomputeWidth );
}, 16 );

function addSVG() {
  var svg = d3.select( '#container' ).append( 'svg' );

  // Add to SVG array
  svgElements.push( svg );

  // initial width computation
  recomputeWidth( svg );

  return svg;
}

module.exports = {
  add: addSVG
};
