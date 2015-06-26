'use strict';

var collection = require( 'ampersand-collection' );
var lodashMixin = require( 'ampersand-collection-lodash-mixin' );
var _ = require( 'lodash' );

var TripModel = require( '../models/trip-model' );

var dayUtils = require( '../lib/day-utils' );

// function filterTripByDay( trip, day ) {
//   return trip.day.toLowerCase() === day;
// }

/**
 * @module StopsCollection
 * @constructor
 * @return {StopsCollection} A stops collection instance
 */
var StopsCollection = collection.extend( lodashMixin, {

  model: TripModel,

  /**
   * Filter by the name of a day (e.g. "Sunday") or the day's index (e.g. 0)
   * @param  {String|Number} day An Snglish day name string or an index from 0 to 6
   * @return {TripModel[]} An array of TripModel objects from the specified day
   */
  byDay: function( day ) {
    if ( typeof day === 'undefined' ) {
      return this.allDays();
    }

    if ( typeof day === 'number' ) {
      day = dayUtils.dayByIndex( day ).toLowerCase();
    }

    return this.filter();
  },

  /**
   * Return an array of arrays, as if calling byDay for every day of the week
   * @return {Array[]} An array of each day's TripModel arrays
   */
  allDays: function() {
    var groupsByDay = this.groupBy(function( trip ) {
      return trip.day;
    });

    // sortBy iterator method returns the numeric index for the group's day
    // name key (e.g. group with key "Sunday" is ordered first, as 0)
    return _.sortBy( groupsByDay, function orderByDayIndex( trip, dayName ) {
      return dayUtils.indexByDay( dayName );
    });
  }
});

module.exports = StopsCollection;
