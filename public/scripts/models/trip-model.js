'use strict';

var model = require( 'ampersand-model' );
var moment = require( 'moment' );

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
    },
    dt: {
      deps: [ 'time' ],
      fn: function() {
        return new Date( this.time * 1000 );
      }
    },
    timeInDay: {
      deps: [ 'dt' ],
      fn: function() {
        return this.dt - moment( this.dt ).startOf( 'day' ).toDate();
      }
    }
  }
});

/**
 * @static
 */
TripModel.timeFrom = function timeFrom( earlierTrip, laterTrip ) {
  console.log( earlierTrip.timeInDay, laterTrip.timeInDay );
  // Assume trips are passed in order: need to do this to account for times after midnight
  if ( laterTrip.timeInDay < earlierTrip.timeInDay ) {
    // 86400000 == one day, in milliseconds (1000*60*60*24)
    return laterTrip.timeInDay + 86400000 - earlierTrip.timeInDay;
  }
  return laterTrip.timeInDay - earlierTrip.timeInDay;
}

module.exports = TripModel;
