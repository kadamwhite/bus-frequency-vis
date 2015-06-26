var model = require( 'ampersand-model' );

var TripModel = model.extend({
  props: {
    day: 'string',
    id: 'string',
    name: 'string',
    routeId: 'string',
    route: 'string',
    time: 'string'
  }
});

module.exports = TripModel;
