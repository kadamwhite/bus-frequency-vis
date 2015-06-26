'use strict';

var d3 = require( 'd3' );
var _ = require( 'lodash' );

var svg = d3.select( 'body' ).append( 'svg' );

function getWidth() {
  // 30px margin on either side
  return document.body.clientWidth - 60;
}

function recomputeWidth() {
  var newWidth = getWidth;
  svg.attr( 'width', newWidth );
}

window.onresize = _.debounce( recomputeWidth, 16 );

// initial width computation
recomputeWidth();

module.exports = svg;
