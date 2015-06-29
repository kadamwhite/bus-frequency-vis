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
      fn: function getDayNameFromDayIndex() {
        return dayUtils.dayByIndex( this.day );
      }
    },
    dt: {
      deps: [ 'time' ],
      fn: function getDateFromApiTime() {
        return new Date( this.time * 1000 );
      }
    },
    timeInDay: {
      deps: [ 'dt' ],
      fn: function getTimeInDay() {
        var time = this.dt - moment( this.dt ).startOf( 'day' ).toDate();
        // We have to account for departures after midnight, which count for the
        // preceding service day. If we're before 3am, we're actually "after"
        // midnight: wrap around. 86400000 == one day, in ms (1000*60*60*24)
        return time < 10800000 ? time + 86400000 : time;
      }
    }
  }
});

module.exports = TripModel;
