'use strict';

var _ = require( 'lodash' );

var svg = require( '../../elements/svg' ).add();
var addLabel = require( '../../lib/add-label' );
var TripModel = require( '../../models/trip-model' );

function renderVisTwo( trips ) {
  addLabel( svg, {
    hr: '',
    p: 'Vis Two'
  });

  var tripsByDay = trips.allDaysAsCollections();

  var earliestTrip = _.reduce( tripsByDay, function( earliestTrip, tripsForDay ) {
    var earliestForDay = tripsForDay.earliest();
    if ( ! earliestTrip ) {
      return earliestForDay;
    }
    // Determine whether previous latest trip or current day's latest trip is later
    return earliestForDay.timeInDay < earliestTrip.timeInDay ? earliestForDay : earliestTrip;
  }, null );

  var latestTrip = _.reduce( tripsByDay, function( latestTrip, tripsForDay ) {
    var latestForDay = tripsForDay.latest();
    if ( ! latestTrip ) {
      return latestForDay;
    }
    // Determine whether previous latest trip or current day's latest trip is later
    return latestForDay.timeInDay > latestTrip.timeInDay ? latestForDay : latestTrip;
  }, null );

  tripsByDay.forEach(function renderDay( tripsForDay, dayIndex ) {
    svg.append( 'g' ).selectAll( 'circle' )
      .data( tripsForDay.models )
      .enter()
      .append( 'circle' )
        .attr({
          cx: function( trip, tripIndex ) {
            return tripIndex * 8 + 3; // 4 px apart, 4 px wide
          },
          cy: function() {
            return 10 * dayIndex + 3;
          },
          r: function() {
            return 3;
          },
          fill: 'black'
        });
  });

  return svg;
}

module.exports = {
  render: renderVisTwo
};
