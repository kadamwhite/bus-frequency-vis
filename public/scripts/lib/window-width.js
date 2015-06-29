'use strict';

var $ = require( './bjq' );

function getSvgWidth() {
  // SVGs are window width less a 30px margin on either side
  return document.body.clientWidth - 60;
}

var resizeStream = $( window )
  .asEventStream( 'resize' )
  .debounce( 16 )
  // Throw out the event in favor of returning the window width directly
  .map( getSvgWidth );

module.exports = {
  /**
   * Expose window resize event as a Bacon stream
   * @property {Bacon.EventStream} stream
   */
  stream: resizeStream,
  /**
   * Expose a method to get the window width on-demand
   * @method get
   * @returns {Number} The width of the document's content area
   */
  get: getSvgWidth
};
