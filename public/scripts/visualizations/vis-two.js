'use strict';

var svg = require( '../elements/svg' ).add();

function renderVisOne( stops ) {
  var vis = svg.append( 'g' )
  // A little lower down on the page
    .attr( 'cy', 200 );

  stops.allDays().forEach(function renderDay( tripsForDay, dayIndex ) {
    vis.append( 'g' ).selectAll( 'circle' )
      .data( tripsForDay )
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

  return vis;
}

module.exports = {
  render: renderVisOne
};
