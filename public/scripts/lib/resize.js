'use strict';

var $ = require( './bjq' );

var resizeStream = $( window )
  .asEventStream( 'resize' )
  .debounce( 16 )
  .map(function() {
    // Throw out the event in favor of returning the window width, less a
    // 30px margin on either side
    return document.body.clientWidth - 60;
  });

/**
 * Expose window resize event as a Bacon stream
 * @type {Bacon.EventStream}
 */
module.exports = resizeStream;
