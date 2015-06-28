'use strict';

var _ = require( 'lodash' );

function addLabel( d3Element, label ) {
  var svgElement = _.chain( d3Element )
    .flattenDeep()
    .first()
    .value();

  // Insert each specified label
  _.map( label, function( contents, tagName ) {
    var labelNode = document.createElement( tagName );
    labelNode.textContent = contents;
    svgElement.parentNode.insertBefore( labelNode, svgElement );
  });
}

module.exports = addLabel;
