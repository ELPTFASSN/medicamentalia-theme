function antimalaricos_visualization( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;


  var margin = {top: 30, right: 20, bottom: 50, left: 50},
      widthCont = 1140,
      heightCont = 500,
      width, height;

  var svg;


  // Public Methods

  that.init = function() {

    console.log('antimalaricos');

    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;

    d3.xml( $('body').data('url') + '/wp-content/uploads/svg/antimalaricos.svg', 'image/svg+xml', function(xml) {
    
      // Append external SVG
      $(id).append( xml.documentElement );

      // Select SVG
      svg = d3.select(id).select('svg');

      // Initial Setup: all grups hidden
      svg.selectAll('#Bubble1, #Bubble2, #Bubble3, #Brasil, #Bolivia, #Venezuela, #World, #India, #PathIndia, #Ginebra').style('opacity', 0);
      svg.select('#Markers').selectAll('image').style('opacity', 0);
      svg.select('#MarkersIndia').selectAll('image').style('opacity', 0);
    });

    return that;
  };

  var bubbleIn = function( id ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.8) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .transition().duration(400).delay(300)
      .attr('transform', 'translate(0 0) scale(1)')
      .style('opacity', 1);
  };

  var bubbleOut = function( id ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .transition().duration(400)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.8) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .style('opacity', 0);
  };

  var markersIn = function( id, offset, delay ){

    svg.select(id).selectAll('image')
      //.attr('transform', 'translate(0 -10)')
      .transition().duration(500).delay( function(d,i){ return offset+(delay*i); })
      //.attr('transform', 'translate(0 0)')
      .style('opacity', 1);
  };

  var markersOut = function( id ){
  
    svg.select(id).selectAll('image')
      .transition().duration(300)
      //.attr('transform', 'translate(0 -10)')
      .style('opacity', 0);
  };

  that.setState = function(stateID) {

    console.log('state', stateID);

    if( stateID === 0 ){

      bubbleOut('#Bubble2');

      svg.selectAll('#Brasil')
        .transition().duration(1000)
        .style('opacity', 1);

      bubbleIn('#Bubble1');
    }
    if( stateID === 1 ){

      bubbleOut('#Bubble1');
      markersOut('#Markers');

      svg.selectAll('#Brasil, #Bolivia, #Venezuela')
        .transition().duration(300)
        .style('opacity', 0);

      bubbleIn('#Bubble2');
    }
    else if( stateID === 2 ){

      bubbleOut('#Bubble2');
      markersOut('#Markers');
      markersOut('#MarkersIndia');

      svg.selectAll('#Brasil, #Bolivia, #Venezuela, #World, #India, #PathIndia')
        .transition().duration(300)
        .style('opacity', 0);

      svg.selectAll('#Continent, #Brasil, #Bolivia, #Venezuela')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);

      markersIn('#Markers', 200, 300);
    }
    else if( stateID === 3 ){

      bubbleOut('#Bubble3');
      markersOut('#Markers');
      markersOut('#MarkersIndia');

      svg.selectAll('#Continent, #Brasil, #Bolivia, #Venezuela, #Ginebra')
        .transition().duration(300)
        .style('opacity', 0);

      svg.select('#World')
        .transition().duration(1000)
        .style('opacity', 1);

      svg.select('#India')
        .transition().duration(500).delay(600)
        .style('opacity', 1);

      markersIn('#MarkersIndia', 300, 1500);

      var w = svg.select('#PathIndia').select('#SVGID_1_').attr('width');

      svg.select('#PathIndia')
        .style('opacity', 1);

      svg.select('#PathIndia').select('#SVGID_1_')
        .attr('transform', 'translate('+w+' 0)')
        .transition().duration(1500).delay(600)
        .attr('transform', 'translate(0 0)');
    }
    else if( stateID === 4 ){

      markersOut('#MarkersIndia');

      svg.selectAll('#India, #PathIndia')
        .transition().duration(300)
        .style('opacity', 0);

      svg.select('#Ginebra')
        .transition().duration(400)
        .style('opacity', 1);

      bubbleIn('#Bubble3');
    }

    return that;
  };

  that.width = function(value) {
    if (!arguments.length) {
      return widthCont;
    }
    widthCont = value;
    return that;
  };

  that.height = function(value) {
    if (!arguments.length) {
      return heightCont;
    }
    heightCont = value;
    return that;
  };

  return that;
}
