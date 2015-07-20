'use strict';

var _ = require( 'lodash' );

var svg = require( '../../elements/svg' ).add();
var addLabel = require( '../../lib/add-label' );
//var TripModel = require( '../../models/trip-model' );
var windowWidth = require( '../../lib/window-width' );
var d3 = require( 'd3' );
var ROW_HEIGHT = 70;

svg.attr( 'height', ROW_HEIGHT * 7 + 40 );

/**
 * Helper function for use within renderDayRow
 */
function addNextTripInfo( trip, i, col ) {
  var nextTrip = col[ i + 1 ];
  // var toNextTrip = nextTrip.timeInDay.getTime() - trip.timeInDay.getTime();
  trip.nextTrip = nextTrip || null;
}

function renderVisFive( trips ) {
  addLabel( svg, {
    hr: '',
    p: 'Vis Seven'
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

  trips.forEach( addNextTripInfo );

  // We look for the longest wait irrespective of the day: the worst day will
  // put the easier ones in perspective, right?
  var longestWait = trips.reduce(function( longestWait, trip ) {
    // Only care about waits within a single service day
    if ( trip.nextTrip && trip.nextTrip.day !== trip.day ) {
      return longestWait;
    }
    if ( trip.timeToNextTrip > longestWait ) {
      longestWait = trip.timeToNextTrip;
    }
    return longestWait;
  }, 0 );

  var xAxis = d3.svg.axis()
    .scale( xScale )
    .ticks( d3.time.minutes, 30 )
    .tickFormat( xScale.tickFormat() );

  function renderDayRow( tripsForDay, dayIndex ) {
    // Add next trip info to all trip objects
    tripsForDay.sortBy( 'timeInDay' );

    var yScale = d3.scale.linear()
      .domain([ 0, longestWait ])
      .range([ 0, ROW_HEIGHT - 5 ]);

    var colorScale = d3.scale.linear()
      // half-way b/w red and green is actually 3/4 across the space
      .domain([ 0, longestWait / 4, longestWait ])
      .range([ 'green', '#464000', 'darkred' ]);

    var group = svg.append( 'g' );
    group.selectAll( 'circle' )
      .data( tripsForDay.models )
      .enter()
      // .append( 'path' )
      //   .attr({
      //     d:
      //   })
      .append( 'g' )
        .attr( 'transform', function( trip ) {
          return [
            'translate(',
            xScale( trip.timeInDay ),
            ',',
            ROW_HEIGHT * dayIndex + 2,
            ')'
          ].join( '' );
        })
        .each(function( trip ) {
          var width = xScale( trip.nextTrip.timeInDay ) - xScale( trip.timeInDay );
          var maxY = yScale( trip.timeToNextTrip );
          var group = d3.select( this );
          var i = 0;

          var localScale = window.localScale = d3.scale.linear()
            .domain([ 0, width ])
            .range([ maxY, 0 ]);

          var localColorScale = d3.scale.linear()
            .domain([ 0, width ])
            .range([ colorScale( trip.timeToNextTrip ), 'green' ]);

          // The goal:
          // |
          // ||
          // ||| (etc)
          /* jshint loopfunc:true */
          var lineFunction = d3.svg.line()
            .x(function() {
              return i; // Static per iteration
            })
            .y(function( n ) {
              // n is one element of a linear number array to be passed in
              // THERE HAS TO BE A BETTER WAY TO DO THIS
              return n;
            })
            .interpolate( 'linear' );

          function strokeColorFn() {
            return localColorScale( i );
          }

          for ( i; i < width; i++ ) {
            group.append( 'path' )
              .attr( 'd', lineFunction([ ROW_HEIGHT - localScale( i ), ROW_HEIGHT ]) )
              .attr( 'stroke', strokeColorFn )
              .attr( 'stroke-width', 1 )
              .attr( 'fill', 'none' );
          }
        });

    var tripsByHalfHour = tripsForDay.groupBy(function( trip ) {
      var hourOfTrip = trip.timeInMs / 1000 / 60 / 60;
      var roundedToHalfHour = Math.floor( hourOfTrip * 2 ) / 2;
      return roundedToHalfHour.toFixed( 1 );
    });

    // Figure out the peak number of trips for any half-hour period this day
    var maxTripsPerPeriod = _.chain( tripsByHalfHour )
      .map(function( tripGroup ) {
        return tripGroup.length;
      })
      .max()
      .value();

    // Make a scale based on the trip count per period
    var tripFrequencyScale = d3.scale.linear()
      .domain([ 0, maxTripsPerPeriod ])
      .range([ ROW_HEIGHT - 5, 0 ]);

    // Clumsily get the first and last half-hour windows we're interested in
    function asNum( val ) {
      return +val;
    }
    var firstPeriod = +_.first( _.keys( tripsByHalfHour ) );
    var lastPeriod = +_.last( _.keys( tripsByHalfHour ) );

    // Make an array representing every period
    var allPeriods = _.range( firstPeriod, lastPeriod, 0.5 );

    // var lineCoords = _.map( allPeriods, function( period ) {
    //   var tripsInPeriod = tripsByHalfHour[ period ];
    //   if ( ! tripsInPeriod ) {}
    //   return {
    //     x: xScale( _.first( tripsInPeriod ).timeInDay ),
    //     y: tripFrequencyScale( tripsInPeriod ? tripsInPeriod.length : 0 )
    //   };
    // });

    // console.log( lineCoords );

    // var tripFrequencyLine = d3.svg.line()
    //   .x(function( d ) {
    //     return d.x;
    //   })
    //   .y(function( d ) {
    //     return d.y;
    //   })
    //   .interpolate( 'basis' );

    // // group.append( 'path' )
    // //   .attr( 'd', tripFrequencyLine( lineCoords ) )
    // //   .attr( 'stroke', 'black' )
    // //   .attr( 'stroke-width', 1 )
    // //   .attr( 'fill', 'none' );

    // console.log( tripsByHalfHour );
  }

  function render() {
    // Clear any prior renders
    // TODO: Probably a way to update this vs recreating everything
    svg.selectAll( 'g' ).remove();
    tripsByDay.forEach( renderDayRow );

    // Render axis
    svg.append( 'g' )
      .attr( 'class', 'x axis' )
      // Axis should be below all rows, ergo ROW_HEIGHT * 7 + 10 (for space)
      .attr( 'transform', 'translate( 0, ' + ( ROW_HEIGHT * 7 + 10 ) + ' )' )
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
  render: renderVisFive
};
