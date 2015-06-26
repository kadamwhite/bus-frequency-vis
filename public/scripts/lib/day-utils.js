'use strict';

/**
 * Get a day by its index (0-6 for Sunday-Saturday)
 * @param  {Number} idx A numeric index between 0 and 6
 * @return {String}     A human-readable day name string e.g. "Wednesday"
 */
function dayByIndex( idx ) {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ][ idx ];
}

/**
 * Get a day's index by its English name
 * @param  {String} dayName A human-readable day name string e.g. "Wednesday"
 * @return {Number}         A numeric index between 0 and 6
 */
function indexByDay( dayName ) {
  return ({
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  })[ dayName.toLowerCase() ];
}

module.exports = {
  dayByIndex: dayByIndex,
  indexByDay: indexByDay
};
