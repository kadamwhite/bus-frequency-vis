'use strict';

var model = require( 'ampersand-model' );
var moment = require( 'moment' );
var d3 = require( 'd3' );

var dayUtils = require( '../lib/day-utils' );

// We will need the number of ms in epoch time for the start of today later on
var startOfToday = d3.time.day.floor( new Date() ).getTime();

// Also get the user's current timezone offset, in ms
var timezoneOffsetOfToday = ( new Date() ).getTimezoneOffset() * 60 * 1000;

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

    startOfDay: {
      deps: [ 'dt' ],
      fn: function getStartOfDay() {
        var startOfDay = d3.time.day.floor( this.dt );

        // Late-night departures after midnight count as part of the preceding
        // service day. If we're before 3am, we're actually "after" midnight:
        // wrap around by subtracting one day (86400000 in ms: 1000*60*60*24)
        if ( ( this.dt - startOfDay ) < 10800000 ) {
          startOfDay = startOfDay - 86400000;
        }

        return startOfDay;
      }
    },

    /**
     * Returns the number of milliseconds between midnight of this service day, and
     * the actual departure time of the trip. e.g., for a 9:40 train this would
     * return 9 * 60 * 60 * 1000 + 40 * 60 * 1000 = 34,800,000
     * @type {Number}
     */
    timeInMs: {
      deps: [ 'dt' ],
      fn: function getTimeInDay() {
        // Get a number representing the milliseconds of this.dt that have
        // occurred within the current calendar day: do so by subtracting
        // the time object representing the start of that calendar day
        // (startOfDay handles wrapping late night trips back to the prior day)
        var timeInDay = this.dt - this.startOfDay;

        return timeInDay;
      }
    },

    /**
     * Returns a date object representing the time of day this trip would occur were
     * it to happen today: e.g. if the trip was 9am on a Tuesday, this will return
     * 9am for the user's current day
     * @type {Date}
     */
    timeInDay: {
      deps: [ 'dt' ],
      fn: function getTimeInDay() {
        var timeInDay = this.timeInMs;

        // There's a chance that the timezone offset of the time as-scheduled,
        // and the timezone offset of now will be different, so we must normalize.
        // First, get this.dt's timezone offset (returned in minutes), as ms:
        var timezoneOffset = this.dt.getTimezoneOffset() * 60 * 1000;

        // Then figure out the difference between the scheduled time offset & ours:
        var timezoneOffsetDelta = timezoneOffset - timezoneOffsetOfToday;

        // Add that value in to the date to account for the change:
        timeInDay = timeInDay + timezoneOffsetDelta;

        // If we used timeInDay as-is it would be relative to Epoch time, which
        // is in UTC: this would lead to weird axis values. To compensate, use
        // the user's current calendar day as a common baseline:
        timeInDay = startOfToday + timeInDay;

        // Done!
        return new Date( timeInDay );
      }
    }
  }
});

module.exports = TripModel;
