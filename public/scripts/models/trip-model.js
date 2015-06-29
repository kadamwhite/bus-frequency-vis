'use strict';

var model = require( 'ampersand-model' );

var dayUtils = require( '../lib/day-utils' );

var TripModel = model.extend({
  props: {
    day: 'number',
    name: 'string',
    route: 'string',
    routeId: 'string',
    time: 'number',
    tripId: 'number'
  },

  derived: {
    dayName: {
      deps: [ 'day' ],
      fn: function() {
        return dayUtils.dayByIndex( this.day );
      }
    }
  }
});

module.exports = TripModel;
