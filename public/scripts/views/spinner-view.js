'use strict';

var AmpersandView = require( 'ampersand-view' );

var SpinnerView = AmpersandView.extend({

  /**
   * Initialize the view
   */
  initialize: function() {
    this.el = document.querySelectorAll( '.spinner' ).item( 0 );
    this.listenToOnce( this.collection, 'sync reset', this.fadeOut );
  },

  /**
   * Fade out then remove the view
   */
  fadeOut: function() {
    this.el.classList.add( 'fade-out' );

    // Fully remove the spinner after it finishes fading
    setTimeout( this.remove.bind( this ), 400 );
  }

});

module.exports = SpinnerView;
