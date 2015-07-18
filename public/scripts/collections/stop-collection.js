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
 * @module TripsCollection
 * @constructor
 * @return {TripsCollection} A stops collection instance
 */
var TripsCollection = collection.extend( lodashMixin, {

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
   * Get the chronologically first trip in the collection
   * @return {TripModel} The trip departing the earliest
   */
  earliest: function() {
    return this.min(function( trip ) {
      return trip.dt;
    });
  },

  /**
   * Get the chronologically last trip in the collection
   * @return {TripModel} The trip departing the latest
   */
  latest: function() {
    return this.max(function( trip ) {
      return trip.dt;
    });
  },

  /**
   * Return an array of arrays, as if calling byDay for every day of the week
   * @return {Array[]} An array of each day's TripModel arrays
   */
  allDays: function() {
    // Group trips by day index (e.g. { '0': [], '1': [], ... })
    var groupsByDay = this.groupBy(function( trip ) {
      return trip.day;
    });

    // Use numeric ordering of group keys (day indices) to convert object to array
    return _.sortBy( groupsByDay, function orderByDayIndex( group, dayIndex ) {
      // coerce e.g. '1' -> 1; change '0' (Sunday, falsy) to '7' so week starts on a Monday
      return +dayIndex ? +dayIndex : 7;
    });
  },

  /**
   * Return an array of TripsCollection instances instead of vanilla arrays
   * @return {TripsCollection[]} An array of TripsCollection instances, one per day
   */
  allDaysAsCollections: function() {
    return _.map( this.allDays(), function( dayGroup ) {
      return new TripsCollection( dayGroup );
    });
  },

  /**
   * Return a TripsCollection filtered to only trips that occur between the provided hours
   * @method departingBetween
   * @param {Number} hour Return all trips departing after this hour (0-24)
   * @return {TripsCollection} A TripsCollection instance with the filtered data
   */
  departingBetween: function( startHour, endHour ) {
    var filteredTrips = this.filter(function leavesBetweenTimes( trip ) {
      var hourOfTrip = trip.timeInMs / 1000 / 60 / 60;
      return startHour < hourOfTrip && hourOfTrip < endHour;
    });

    // Return a new TripsCollection to maintain access to the collection methods
    return new TripsCollection( filteredTrips );
  },

  /**
   * Return a TripsCollection filtered to only trips before the provided hour in the day
   * @method departingBefore
   * @param {Number} hour Return all trips departing before this hour (0-24)
   * @return {TripsCollection} A TripsCollection instance with the filtered data
   */
  departingBefore: function( hour ) {
    // No trips before 3am so it's a safe lower bound
    return this.departingBetween( 4, hour );
  },

  /**
   * Return a TripsCollection filtered to only trips after the provided hour in the day
   * @method departingAfter
   * @param {Number} hour Return all trips departing after this hour (0-24)
   * @return {TripsCollection} A TripsCollection instance with the filtered data
   */
  departingAfter: function( hour ) {
    // No buses after 3 of the following day so it's a safe upper bound
    return this.departingBetween( hour, 27 );
  }
});

module.exports = TripsCollection;
