'use strict';

var _ = require( 'lodash' );

var svg = require( '../../elements/svg' ).add();
var addLabel = require( '../../lib/add-label' );
//var TripModel = require( '../../models/trip-model' );
var windowWidth = require( '../../lib/window-width' );
var d3 = require( 'd3' );

svg.attr( 'height', 400 );

/**
 * Helper function for use within renderDayRow
 */
function addNextTripInfo( trip, i, col ) {
  var nextTrip = col[ i + 1 ];
  // var toNextTrip = nextTrip.timeInDay.getTime() - trip.timeInDay.getTime();
  trip.nextTrip = nextTrip || null;
}

function renderVisThree( trips ) {
  addLabel( svg, {
    hr: '',
    p: 'Vis Three'
  });

  var tripsByDay = trips.departingBetween( 7.5, 11 ).allDaysAsCollections();

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

  var xScale = d3.time.scale()
    .domain([ earliestTrip.timeInDay, latestTrip.timeInDay ]);

  // Scale Range: Map to viewport, w/ extra 20px padding on either side
  function updateRange( width ) {
    if ( ! width ) {
      width = windowWidth.get();
    }
    xScale.rangeRound([ 20, width - 40 ]);
  }

  var xAxis = d3.svg.axis()
    .scale( xScale )
    .ticks( d3.time.minutes, 30 )
    .tickFormat( xScale.tickFormat() );

  function renderDayRow( tripsForDay, dayIndex ) {
    // Add next trip info to all trip objects
    tripsForDay.sortBy( 'timeInDay' );
    tripsForDay.forEach( addNextTripInfo );

    var longestWait = tripsForDay.reduce(function( longestWait, trip ) {
      if ( trip.timeToNextTrip > longestWait ) {
        longestWait = trip.timeToNextTrip;
      }
      return longestWait;
    }, 0 );

    var yScale = d3.scale.linear()
      .domain([ 0, longestWait ])
      .range([ 0, 35 ]);

    var colorScale = window.colorScale = d3.scale.linear()
      .domain([ 0, longestWait ])
      .range([ 'green', 'red' ]);

    var group = svg.append( 'g' );
    group.selectAll( 'circle' )
      .data( tripsForDay.models )
      .enter()
      // .append( 'path' )
      //   .attr({
      //     d:
      //   })
      .append( 'rect' )
        .attr({
          x: function( trip, tripIndex ) {
            return xScale( trip.timeInDay );
            // return tripIndex * 8 + 3; // 4 px apart, 4 px wide
          },
          y: function( trip ) {
            return 40 * dayIndex + 2;
          },
          height: function( trip ) {
            return yScale( trip.timeToNextTrip );
          },
          width: function( trip ) {
            if ( ! trip.nextTrip ) {
              return 1;
            }
            return xScale( trip.nextTrip.timeInDay ) - xScale( trip.timeInDay ) - 1;
          },
          fill: function( trip ) {
            return colorScale( trip.timeToNextTrip );
            // return trip.route === '88' ? 'darkgreen' : 'darkorange';
          }
        });
  }

  function render() {
    // Clear any prior renders
    // TODO: Probably a way to update this vs recreating everything
    svg.selectAll( 'g' ).remove();
    tripsByDay.forEach( renderDayRow );

    // Render axis
    svg.append( 'g' )
      .attr( 'class', 'x axis' )
      // 150 = 40 (see "y", above) * 7 + 10 (for space)
      .attr( 'transform', 'translate( 0, 290 )' )
      .call( xAxis );
  }

  function update( width ) {
    updateRange( width );
    render();
  }

  // Update if window is resized
  windowWidth.stream.onValue( update );

  // First render
  update();

  return svg;
}

module.exports = {
  render: renderVisThree
};
