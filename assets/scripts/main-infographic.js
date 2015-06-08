function Main_Infographic( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;
  var $el = $(id);
  var $tooltip = d3.select('#main-infographic-tooltip');

  var initialized = false;

  var DOT_OPACITY = 0.7;

  var margin = {top: 150, right: 50, bottom: 50, left: 50},
      widthCont, heightCont,
      width, height;

  var color = d3.scale.ordinal()
    .range(['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00']);

  var svg,
      x, y,
      xAxis, yAxis,
      dataPricesPublic, dataPricesPrivate, countries;

  var bisectDate = d3.bisector( function(d) { return d.Country; } ).left;


  // Setup Visualization

  that.init = function() {

    initialized = true;

    console.log('vis', widthCont, heightCont );

    widthCont = $el.width();
    heightCont = $el.height();

    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;

    x = d3.scale.ordinal()
      .rangePoints([0, width]);

    y = d3.scale.pow().exponent(0.5)
      .range([height, 0]);

    xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(-height)
      .tickSubdivide(true)
      .orient('bottom');

    yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(-width)
        .tickPadding(8)
        .orient('left');

    svg = d3.select(id).append('svg')
        .attr('id', 'main-vis-svg')
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


  that.setState = function(stateID) {

    console.log('main visualization state', stateID);

    return that;
  };

  this.isInitialized = function(){
    
    return initialized;
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
       // .attr('transform', 'rotate(45)')
        .style('text-anchor', 'start');

    // Setup Y Axis
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('class', 'label')
        .attr('dy', '-1em')
        .attr('dx', '-0.75em')
        .style('text-anchor', 'end')
        .text('$');

    // Mouse events overlay
    svg.append("rect")
        .attr("class", "overlay")
        .style('opacity', 0)
        .attr("width", width)
        .attr("height", height)
          .on('mouseout', onOverlayOut)
          .on("mousemove", onOverlayMove);

    // Country Marker
    svg.append("line")
        .attr("class", "country-marker")
        .attr("x1", 0)
        .attr("y1", height)
        .attr("x2", 0)
        .attr("y2", 0)
        .style('opacity', 0);

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
        .on('mouseover', onDotOver )
        .on('mouseout', onDotOut );
  };

  var onDotOver = function(){

    var item = d3.select(this);
          
    console.log('over dot', item);

    d3.select('.country-marker').style('opacity', 0);

    // Update opacity
    svg.selectAll('.dot')
      .style('fill', '#cacaca')
      .style('opacity', DOT_OPACITY);

    svg.selectAll('.dot.drug-'+item.attr('id'))
      .style('fill', function(d) { return color(d.Drug); }).style('opacity', 1);

    // Show lines
    svg.selectAll('.line.drug-'+item.attr('id')).style('opacity', 1);

    // Set selected dots on top
    svg.selectAll('.dot').sort(function (a, b) {  
      return ( item.attr('id') === niceName(a.Drug) ) ? 1 : -1;
    });

    // Setup tooltip
    $tooltip.select('.country').html( item.data()[0].Country );
    $tooltip.select('.drug').html( item.data()[0].Drug );
    $tooltip.select('.price').html( item.data()[0].Price );

    var left = item.attr('cx') > width*0.5;

    if( left ){
      $tooltip
        .style('right', (widthCont-Math.round(item.attr('cx'))-margin.left)+'px')
        .style('left', 'auto');
    } else{
      $tooltip
        .style('right', 'auto')
        .style('left', (Math.round(item.attr('cx'))+margin.left)+'px');
    }

    $tooltip
      .classed('left', left)
      .style('top', (Math.round(item.attr('cy'))+margin.top)+'px')
      .style('opacity', '1');
  };

  var onDotOut = function(){

    svg.selectAll('.line')
      .style('opacity', 0);

    $tooltip
      .style('opacity', '0')
      .style('right', 'auto')
      .style('left', '-1000px');

    onOverlayMove();
  };

  var onOverlayMove = function(){

    var xPos = d3.mouse(this)[0],
        leftEdges = x.range(),
        w = width / (countries.length-1),
        j = 0;

    while(xPos > (leftEdges[j] + (w*0.5))){ j++; }

    d3.select('.country-marker')
      .style('opacity', 1)
      .attr('transform', 'translate('+ x(x.domain()[j]) +' 0)');

    svg.selectAll('.dot')
      .style('fill', '#cacaca')
      .style('opacity', DOT_OPACITY );

    svg.selectAll('.dot.country-'+niceName(x.domain()[j]))
      .style('fill', function(d) { return color(d.Drug); })
      .style('opacity', 1);
  };

  var onOverlayOut = function(){

    svg.select('.country-marker').style('opacity', 0);

    svg.selectAll('.dot')
      .style('fill', function(d) { return color(d.Drug); })
      .style('opacity', DOT_OPACITY );
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
    return drug.toLowerCase().replace(/[ +,\/]/g,'-');
  };


  // Public Methods

  that.resize = function() {

    console.log('resize main vis');

    // Update variables
    widthCont = $el.width();
    heightCont = $el.height();
    
    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;

    // Update SVG size
    d3.select('#main-vis-svg')
      .attr('width', widthCont)
      .attr('height', heightCont);

    //Update Axis
    x.rangePoints([0, width]);
    y.range([height, 0]);

    xAxis.tickSize(-height);
    yAxis.tickSize(-width);

    d3.select('g.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    d3.select('g.y.axis')
      .call(yAxis);

    // Update Dots & Lines
    d3.selectAll('.dot-lines .line')
      .attr('x1', function(d) { return x(d.Country); })
      .attr('y1', height)
      .attr('x2', function(d) { return x(d.Country); })
      .attr('y2', function(d) { return y(d.Price); });

    d3.selectAll('.dot')
      .attr('cx', function(d) { return x(d.Country); })
      .attr('cy', function(d) { return y(d.Price); });
  };

  return that;
}
