var model = require( 'ampersand-model' );

var dayUtils = require( '../lib/day-utils' );

var TripModel = model.extend({
  props: {
    day: 'number',
    id: 'number',
    name: 'string',
    route: 'string',
    routeId: 'string',
    time: 'number'
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
