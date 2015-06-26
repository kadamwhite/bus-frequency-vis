'use strict';

var _ = require( 'lodash' );

var dayByIndex = require( './day-utils' ).dayByIndex;

/* RESPONSE DATA STRUCTURE
==========================================================================
data = [ ..., {                               // Day Object
  stop_id: '2681',
  stop_name: 'Highland Ave @ Benton Rd',
  mode: [ ..., {                              // Mode Object
    mode_name: 'Bus',
    route_type: '3',
    route: [ ..., {                           // Route Object
      route_id: '88',
      route_name: '88',
      direction: [ ..., {                     // Direction Object
        direction_id: '1',
        direction_name: 'Inbound',
        trip: [ ..., {                        // Trip Object
          sch_arr_dt: '1434278820',
          sch_dep_dt: '1434278820',
          trip_id: '26616679',
          trip_name: '6:40 am from Clarendon Hill Busway to Lechmere'
        }]
      }]
    }]
  }]
}]
*/

/**
 * Convert from a Day Object to a flat array of data objects representing trips
 * @param  {Number} dayIndex A numeric index for a weekday, from 0 to 6
 * @param  {Object} route    A route object from the API response
 * @return {Array}           A flat array of trip data objects
 */
function convertRouteToTripsArray( dayIndex, route ) {
  /* jshint camelcase: false */
  var routeId = route.route_id;
  var routeName = route.route_name;
  return _.map( route.direction, function( direction ) {
    return _.map( direction.trip, function( trip ) {
      return {
        day: dayByIndex( dayIndex ),
        routeId: routeId,
        routeName: routeName,
        schedArrDT: trip.sch_arr_dt,
        schedDepDT: trip.sch_dep_dt,
        tripId: trip.trip_id,
        tripName: trip.trip_name
      };
    });
  });
}

/**
 * Convert the raw API responses into a flat array of trips
 * @param  {Array} data The API response object
 * @return {Array}      A flat array of object literals describing trips
 */
function parseData( data ) {
  return _.reduce( data, function( memo, day, dayIndex ) {
    var trips = _.chain( day.mode )
      .pluck( 'route' )
      .flatten()
      // Create the mapper method for the relevant day
      .map( _.partial( convertRouteToTripsArray, dayIndex ) )
      .flattenDeep() // Deep flatten
      .value();

    // Concatenate with the prior results
    return memo.concat( trips );
  }, []);
}

module.exports = parseData;
