'use strict';

var _ = require( 'lodash' );
var d3 = require( 'd3' );

// Private counter to use when making default grandient IDs
var counter = 0;

// SVG fill X/Y attributes to handle the four cardinal directions of gradient
var DIRECTIONS = {
  right: { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
  left: { x1: '100%', y1: '0%', x2: '0%', y2: '0%' },
  down: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
  up: { x1: '0%', y1: '100%', x2: '0%', y2: '0%' }
};

/**
 * Utility method to return a url(#id) string
 * @param  {String} id The ID attribute of an SVG element
 * @return {String} The formatted URL string for use as a fill attribute
 */
function fillAttr( id ) {
  return 'url(#' + id + ')';
}

/**
 * Make and append an SVG gradient definition, and return a descriptive object
 *
 * @module svg-gradient
 * @method gradient
 * @param {d3}     svg              A d3-wrapped SVG node
 * @param {Object} opts             A configuration object
 * @param {String} opts.from        A string representation of the gradient's start color
 * @param {String} opts.to          A string representation of the gradient's end color
 * @param {String} [opts.direction] Direction of gradient, one of 'right', 'left', 'up', 'down'
 * @param {String} [opts.id]        A string ID attribute to give the generated gradient
 * @return {Object} An object with properties .id (string), .fillAttr (string),
 *                  and .gradient (d3-wrapped svg object)
 */
function generate( svg, opts ) {
  if ( ! svg || ! ( svg instanceof d3.constructor ) ) {
    throw new Error( 'A d3-wrapped SVG node must be provided' );
  }
  if ( ! _.isObject( opts ) ) {
    throw new Error( 'An options object is required' );
  }

  var attrs = {
    // This is the only immutable option for the :linearGradient itself
    spreadMethod: 'pad'
  };
  var gradient;
  var colorFrom = opts.from;
  var colorTo = opts.to;

  if ( ! _.isString( colorFrom ) || ! _.isString( colorTo ) ) {
    throw new Error( 'options ".from" and ".to" must both be color strings' );
  }

  // Set or generate an ID for this gradient, to be used as a fill param
  if ( opts.id ) {
    attrs.id = opts.id;
  } else {
    // Make a unique-so-long-as-nobody-used-this-naming-scheme ID
    attrs.id = 'gradient' + counter++;
  }

  // Pick the direction in which to render the gradient
  if ( opts.direction && DIRECTIONS[ opts.direction ] ) {
    // If we passed in a direction, try to set it:
    _.extend( attrs, DIRECTIONS[ opts.direction ] );
  } else {
    // Default to a left-to-right gradient if no or invalid opts.gradient
    _.extend( attrs, DIRECTIONS.right );
  }

  gradient = svg.append( 'svg:defs' )
    .append( 'svg:linearGradient' )
      .attr( attrs ); // Set ID, gradient X/Y directions, and spreadMethod

  // Add the SVG stop for the gradient's start
  gradient.append( 'svg:stop' )
    .attr( 'offset', '0%' )
    .attr( 'stop-color', colorFrom )
    .attr( 'stop-opacity', 1 );

  // Add the SVG stop for the gradient's end
  // [SVG is weird. - ed]
  gradient.append( 'svg:stop' )
    .attr( 'offset', '100%' )
    .attr( 'stop-color', colorTo )
    .attr( 'stop-opacity', 1 );

  console.log( fillAttr( attrs.id ) );

  return {
    id: attrs.id,
    fillAttr: fillAttr( attrs.id ),
    gradient: gradient
  };
}

module.exports = {
  generate: generate
};
