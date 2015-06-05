var Patents_Infographic = function( _id ) {

  var $ = jQuery.noConflict();

  var that = this;
  var id = _id;
  var svg;
  var lastState = -1;
  

  that.init = function() {

    // Load external SVG
    d3.xml( $('body').data('url') + '/dist/svg/patentes.svg', 'image/svg+xml', function(xml) {
    
      $(id).append( xml.documentElement );  // Append external SVG to Container

      svg = d3.select(id).select('svg');    // Get SVG Element

      // Initial Setup: all grups hidden
      svg.selectAll('#World, #Doc1, #Doc2').style('opacity', 0);
      svg.selectAll('#Chemistry, #Time').selectAll('g').style('opacity', 0);
      svg.selectAll('#Sign').selectAll('g').style('opacity', function(d,i){ return (i<4) ? 0 : 1; });
    });

    return that;
  };

  that.setState = function(stateID) {

    if( stateID === 0 ){

      svg.select('#Doc1')
        .transition().duration(300)
        .style('opacity', 0);

      fadeOutPath('#Doc1', 300);
      
      svg.select('#Sign').selectAll('g')
        .transition().duration(400).delay( function(d,i){ return 300*(4-i); })
        .style('opacity', 1);
    }
    else if( stateID === 1 ){

      svg.selectAll('#Chemistry').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);

      svg.select('#Sign').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
      
      fadeInPath('#Doc1', 800);
    }
    else if( stateID === 2 ){

      fadeOutPath('#Doc1', 300);
      fadeOutPath('#Doc2', 300);

      svg.selectAll('#Doc2').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
   
      svg.select('#Chemistry').selectAll('g')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }
    else if( stateID === 3 ){

      svg.select('#Time').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);

      fadeOutPath('#Time', 300);

      svg.selectAll('#Chemistry').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);

      fadeInPath('#Doc2', 800);

      svg.select('#Doc2').selectAll('g')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }
    else if( stateID === 4 ){

      svg.selectAll('#World')
        .transition().duration(300)
        .style('opacity', 0);

      fadeOutPath('#Doc2', 300);

      svg.selectAll('#Doc2').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);

      fadeInPath('#Time', 800);

      svg.select('#Time').selectAll('g')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }
    else if( stateID === 5 ){

      svg.select('#Time').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);

      fadeOutPath('#Time', 300);

      svg.select('#World')
        .transition().duration(800)
        .style('opacity', 1);

      /*
      var w = svg.select('#Map').node().getBBox().width;

      svg.select('#Map')
        .transition().duration(1500)
        .attr('transform', 'translate('+w+' 0)');
      */
    }

    lastState = stateID;

    return that;
  };


  // Private Methods
  var fadeInPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .transition().duration(duration)
      .attr('transform', 'translate(0 0) scale(1)')
      .style('opacity', 1);
  };

  var fadeOutPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .transition().duration(duration)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .style('opacity', 0);
  };

  return that;
};
