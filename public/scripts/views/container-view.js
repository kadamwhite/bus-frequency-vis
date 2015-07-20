'use strict';

var AmpersandView = require( 'ampersand-view' );

// Pull in the views wrapped in this container
var visualizations = [
  require( './visualizations/vis-one' ),
  require( './visualizations/vis-two' ),
  require( './visualizations/vis-three' ),
  require( './visualizations/vis-four' ),
  require( './visualizations/vis-five' ),
  require( './visualizations/vis-six' ),
  require( './visualizations/vis-seven' )
];

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
    var collection = this.collection;
    visualizations.forEach(function(vis) {
      vis.render( collection );
    });
  }

});

module.exports = ContainerView;
