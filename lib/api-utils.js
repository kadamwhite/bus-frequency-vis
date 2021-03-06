'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var express = require( 'express' );
var router = express.Router();

var config = require( '../lib/config' );
var mbtapi = require( 'mbtapi' ).create( config );

var cache = require( '../lib/short-cache' );

var rsvp = require( 'rsvp' );
var moment = require( 'moment' );
var _ = require( 'lodash' );

var BENTON_RD = 2681;



/**
 * What day of the week it is
 * @return {Number} A number between 0 (sun) and 6 (sat)
 */
function getCurrentDay() {
  return moment().day();
}

/**
 * Get a moment object for the requested day, within the next seven days
 * @param  {Number} requestedDay The index of the day to get (0: sun, 6: sat)
 * @return {Moment}              A moment instance for the requested day
 */
function getDayInNextWeek( requestedDay ) {
  if ( requestedDay > 6 ) {
    throw new Error( 'Day must be between 0 (Sunday) and 6 (Saturday)' );
  }
  var currentDay = getCurrentDay();
  var day = moment();

  // Coerce to number
  requestedDay = +requestedDay;

  // Requested day has already passed in the current week: wrap to next
  if ( requestedDay < currentDay ) {
    // Add 1 to account for zero-index: requestedDay "5" is 6 days past this current week
    requestedDay = requestedDay + currentDay + 1;
  }

  // Set moment instance to 4am (to get all active service) for the requested day
  day.day( requestedDay ).hour( 4 );

  console.log( 'Selected day ' + day.format( 'ddd D, ha' ) + ' (' + day.fromNow() + ')' );

  // Unix epoch time, for the API
  return day.unix()
}

function getDateTimeForDay( day ) {
  return getDayInNextWeek( day );
}

function schedule( busRoute ) {
  var schedulePromise = cache.get( busRoute );
  if ( ! schedulePromise ) {
    schedulePromise = mbtapi.scheduleByRoute( busRoute );
    cache.set( busRoute, schedulePromise );
  }

  return schedulePromise;
}

function scheduleForStop( stopId, params ) {
  var schedulePromise = cache.get( stopId );
  if ( ! schedulePromise ) {
    schedulePromise = mbtapi.scheduleByStop(_.extend( params, {
      stop: stopId,
      max_time: 1440, // 24 hours
      max_trips: 100 // max possible value
    }));
    cache.set( stopId, schedulePromise );
  }

  return schedulePromise;
}

function scheduleForDay( day ) {
  var stopId = BENTON_RD;
  var schedulePromise = cache.get( 'day-' + day );
  if ( ! schedulePromise ) {
    schedulePromise = mbtapi.scheduleByStop({
      stop: stopId,
      datetime: getDateTimeForDay( day ),
      max_time: 1440, // 24 hours
      max_trips: 100 // max possible value
    });
    cache.set( 'day-' + day, schedulePromise );
  }

  return schedulePromise;
}

module.exports = {
  getCurrentDay: getCurrentDay,
  getDayInNextWeek: getDayInNextWeek,
  getDateTimeForDay: getDateTimeForDay,
  schedule: schedule,
  scheduleForStop: scheduleForStop,
  scheduleForDay: scheduleForDay
}
