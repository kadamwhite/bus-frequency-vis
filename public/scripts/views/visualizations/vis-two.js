'use strict';

var _ = require( 'lodash' );

var svg = require( '../../elements/svg' ).add();
var addLabel = require( '../../lib/add-label' );
var TripModel = require( '../../models/trip-model' );
var windowWidth = require( '../../lib/window-width' );

svg.attr( 'height', 200 );

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

  console.log( ( latestTrip.timeInDay - earliestTrip.timeInDay ) / 60 / 60 / 1000 );

  var xScale = window.xScale = d3.time.scale()
    .domain([ earliestTrip.timeInDay, latestTrip.timeInDay ]);
    // .ticks( d3.time.hour, 1 );

  // Scale Range: Map to viewport, w/ extra 20px padding on either side
  function updateRange( width ) {
    if ( ! width ) {
      width = windowWidth.get();
    }
    xScale.rangeRound([ 20, width - 40 ]);
  }
  window.svg = svg;

  var xAxis = d3.svg.axis()
    .scale( xScale )
    .ticks( d3.time.hours, 2 )
    .tickFormat( xScale.tickFormat( '%I %p' ) );

  function renderDayRow( tripsForDay, dayIndex ) {
    var group = svg.append( 'g' );
    group.selectAll( 'circle' )
      .data( tripsForDay.models )
      .enter()
      .append( 'circle' )
        .attr({
          cx: function( trip, tripIndex ) {
            return xScale( trip.timeInDay );
            // return tripIndex * 8 + 3; // 4 px apart, 4 px wide
          },
          cy: function() {
            return 20 * dayIndex + 3;
          },
          r: function() {
            return 2;
          },
          fill: function( trip ) {
            return trip.route === '88' ? 'darkgreen' : 'darkorange';
          }
        });

    // Render axis
    group.append( 'g' )
      // 150 = 20 (see cy, above) * 7 + 10 (for space)
      .attr( 'transform', 'translate( 0, 150 )' )
      .call( xAxis );
  }

  function render() {
    // Clear any prior renders
    // TODO: Probably a way to update this vs recreating everything
    svg.selectAll( 'g' ).remove();
    tripsByDay.forEach( renderDayRow );
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
  render: renderVisTwo
};
