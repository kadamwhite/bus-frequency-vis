'use strict';

var $ = require( 'jquery' );
var Bacon = require( 'baconjs' );
$.fn.asEventStream = Bacon.$.asEventStream;

/**
 * Expose jQuery with the BaconJS add-in
 * @type {jQuery}
 */
module.exports = $;
