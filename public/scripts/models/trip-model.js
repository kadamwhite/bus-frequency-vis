var model = require( 'ampersand-model' );

var TripModel = model.extend({
  props: {
    day: 'string',
    routeId: 'string',
    routeName: 'string',
    schedArrDT: 'string',
    schedDepDT: 'string',
    tripId: 'string',
    tripName: 'string'
  }
});

module.exports = TripModel;
