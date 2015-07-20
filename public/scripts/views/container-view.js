'use strict';

var AmpersandView = require( 'ampersand-view' );

// Pull in the views wrapped in this container
var VisOne = require( './visualizations/vis-one' );
var VisTwo = require( './visualizations/vis-two' );
var VisThree = require( './visualizations/vis-three' );
var VisFour = require( './visualizations/vis-four' );

var ContainerView = AmpersandView.extend({

  /**
   * Initialize the view
   */
  initialize: function() {
    this.listenToOnce( this.collection, 'sync reset', this.fadeIn );
    this.listenToOnce( this.collection, 'sync reset', this.render );
  },

  /**
   * Fade in the view
   */
  fadeIn: function() {
    var containerNode = this.el;
    setTimeout(function() {
      containerNode.classList.add( 'fade-in' );
    }, 400 );
  },

  /**
   * Render the view
   */
  render: function() {
    VisOne.render( this.collection );
    VisTwo.render( this.collection );
    VisThree.render( this.collection );
    VisFour.render( this.collection );
  }

});

module.exports = ContainerView;
