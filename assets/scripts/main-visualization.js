function main_visualization( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;

  var DOT_OPACITY = 0.7;

  var margin = {top: 20, right: 20, bottom: 70, left: 50},
      widthCont = 1140,
      heightCont = 500,
      width, height;

  //var color = d3.scale.category20();

  var color = d3.scale.ordinal()
    .range(['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00']);

  var svg,
      x, y,
      xAxis, yAxis,
      dataPricesPublic, dataPricesPrivate, countries;


  // Setup Visualization

  that.init = function() {

    console.log('vis', widthCont, heightCont );

    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;

    x = d3.scale.ordinal()
      .rangePoints([0, width]);

    y = d3.scale.linear()
      .range([height, 0]);

    xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(-height)
      .tickSubdivide(true)
      .orient('bottom');

    yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(-width)
      .tickPadding(12)
      .orient('left');

    svg = d3.select(id).append('svg')
        .attr('width', widthCont)
        .attr('height', heightCont)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Load CSV
    d3.csv( $('body').data('url')+'/dist/csv/prices.csv', function(error, data) {

      console.log(data);

      var dataPrices = data.filter(function(d){ return d['Unit/MPR'] === 'MPR'; });

      dataPrices = dataPrices.filter(function(d){ return d.Price !== 'NO DATA'; });
      dataPrices.forEach(function(d) {
        d.Price = (d.Price !== 'free') ? +d.Price : 0;
      });
      
      dataPricesPublic = dataPrices.filter(function(d){ return d['Public/Private'] === 'Public'; });
      dataPricesPrivate = dataPrices.filter(function(d){ return d['Public/Private'] === 'Private'; });

      // Set Countries

      var nestedData = d3.nest()
        .key(function(d) { return d.Country; })
        .entries(dataPrices);

      countries = [];
      nestedData.forEach(function(d) { countries.push( d.key ); });

      x.domain( countries );

      //console.dir( dataPricesPublic );
      //console.dir( dataPricesPrivate );

      $('.btn-group').css('visibility', 'visible');

      setData( dataPricesPublic );
    });

    // Setup Public/Private Btns
    $('#public-btn').click(function(e){

      if( $(this).hasClass('active') ){
        return;
      }

      $('#private-btn').removeClass('active');
      $(this).addClass('active');

      updateData( dataPricesPublic );
    });

    $('#private-btn').click(function(e){
      if( $(this).hasClass('active') ){
        return;
      }

      $('#public-btn').removeClass('active');
      $(this).addClass('active');

      updateData( dataPricesPrivate );
    });

    return that;
  };

  // Private Methods

  var setData = function( data ){

    y.domain( d3.extent(data, function(d) { return d.Price; }) ).nice();

    color.domain( d3.extent(data, function(d) { return d.Drug; }) );

    xAxis.ticks( countries.length );

    // Setup X Axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      .selectAll('text')
        .attr('class', 'label')
        .attr('y', 7)
        .attr('x', 7)
        .attr('transform', 'rotate(45)')
        .style('text-anchor', 'start');

    // Setup Y Axis
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('class', 'label')
        .attr('dy', '-1em')
        .style('text-anchor', 'end')
        .text('Price (MPR)');

    // Setup Lines
    svg.append('g')
        .attr('class', 'dot-lines')
      .selectAll('.dot-line')
        .data(data)
      .enter().append('line')
        .attr('id', function(d) { return niceName(d.Drug); })
        .attr('class', function(d) { return 'line country-'+niceName(d.Country)+' drug-'+niceName(d.Drug); })
        .attr('x1', function(d) { return x(d.Country); })
        .attr('y1', height)
        .attr('x2', function(d) { return x(d.Country); })
        .attr('y2', function(d) { return y(d.Price); })
        .style('opacity', 0)
        .style('stroke', function(d) { return color(d.Drug); });

    // Setup Circles
    svg.append('g')
        .attr('class', 'dots')
      .selectAll('.dot')
        .data(data)
      .enter().append('circle')
        .attr('id', function(d) { return niceName(d.Drug); })
        .attr('class', function(d) { return 'dot country-'+niceName(d.Country)+' drug-'+niceName(d.Drug); })
        .attr('r', 7)
        .attr('cx', function(d) { return x(d.Country); })
        .attr('cy', function(d) { return y(d.Price); })
        .style('opacity', DOT_OPACITY)
        .style('fill', function(d) { return color(d.Drug); })
        .on('mouseover', onOverDot )
        .on('mouseout', onOutDot );
  };

  var onOverDot = function(){

    var item = d3.select(this);
          
    // Update opacity
    svg.selectAll('.dot').transition().style('opacity', 0.15).duration(400);
    svg.selectAll('.dot.drug-'+item.attr('id')).transition().style('opacity', 1).duration(400);

    // Show lines
    svg.selectAll('.line.drug-'+item.attr('id')).transition().style('opacity', 1).duration(400);

    // Set selected dots on top
    svg.selectAll('.dot').sort(function (a, b) {  
      return ( item.attr('id') === niceName(a.Drug) ) ? 1 : -1;
    });

    // Setup tooltip
    d3.selectAll('#graph-tooltip .country').html( item.data()[0].Country );
    d3.selectAll('#graph-tooltip .drug').html( item.data()[0].Drug );
    d3.selectAll('#graph-tooltip .price').html( item.data()[0].Price );

    d3.selectAll('#graph-tooltip')
      .style('left', (Math.round(item.attr('cx'))+margin.left)+'px')
      .style('top', (Math.round(item.attr('cy'))+margin.top)+'px')
      .style('opacity', '1');
  };

  var onOutDot = function(){
    
    svg.selectAll('.dot').transition().style('opacity', DOT_OPACITY).duration(200);
    svg.selectAll('.line').transition().style('opacity', 0).duration(200);

    d3.selectAll('#graph-tooltip')
      .style('opacity', '0')
      .style('left', '-1000px');
  };

  var updateData = function( data ){

    y.domain(d3.extent(data, function(d) { return d.Price; })).nice();

    svg.select('.y.axis')
      .transition().duration(1200).ease('sin-in-out')
      .call(yAxis);

    var item;

    data.forEach(function(d){

      item = svg.select('.dot.country-'+niceName(d.Country)+'.drug-'+niceName(d.Drug));

      if( !item.empty() ){
        item.datum(d)
          .transition().duration(1200)
          .attr('cx', function(d) { return x(d.Country); })
          .attr('cy', function(d) { return y(d.Price); });

        item = svg.select('.line.country-'+niceName(d.Country)+'.drug-'+niceName(d.Drug));
        item.datum(d)
          .attr('y2', function(d) { return y(d.Price); });
      }
    });
  };

  var niceName = function( drug ){
    return drug.toLowerCase().replace(/[ +\/]/g,'-');
  };


  // Public Methods

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
