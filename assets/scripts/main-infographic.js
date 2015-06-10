function Main_Infographic( _id ) {

  var $ = jQuery.noConflict();

  var that = this,
      initialized = false,
      DOT_OPACITY = 0.7,
      current = {
        data: 'prices',
        type: 'public',
        label: 'Price'
      },
      tooltipTxt = {
        prices: ' x MPR',
        affordability: ' days of work'
      },
      currentState = 0;

  var margin = {top: 150, right: 50, bottom: 50, left: 50},
      widthCont, heightCont,
      width, height;

  var id = _id,
      $el = $(id),
      $tooltip = d3.select('#main-infographic-tooltip');

  var color = d3.scale.ordinal()
      .range(['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00']);

  var svg,
      x, y, xAxis, yAxis,
      dataPricesPublic, dataPricesPrivate, dataAffordability, dataCountries;


  // Setup Visualization

  that.init = function() {

    initialized = true;

    setDimensions();

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
        .attr('id', 'main-infographic-svg')
        .attr('width', widthCont)
        .attr('height', heightCont)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    // Load CSVs
    d3.csv( $('body').data('url')+'/dist/csv/prices.csv', function(error, prices) {

      d3.csv( $('body').data('url')+'/dist/csv/affordability.csv', function(error, affordability) {

        d3.csv( $('body').data('url')+'/dist/csv/countries.csv', function(error, countries) {

          // Parse Data
          prices = prices.filter(function(d){ return d['Unit/MPR'] === 'MPR'; });
          prices.forEach(function(d) {
            d.Price = (d.Price === 'NO DATA') ? null : ((d.Price !== 'free') ? +d.Price : 0);
          });
          
          affordability.forEach(function(d) {
            d['Public sector']  = (d['Public sector'] !== 'NO DATA') ? +d['Public sector'] : null;
            d['Private sector'] = (d['Private sector'] !== 'NO DATA') ? +d['Private sector'] : null;
          });

          dataCountries = d3.nest()
            .key(function(d) { return d.Pais; })
            .entries(countries);

          dataPricesPublic  = prices.filter(function(d){ return d['Public/Private'] === 'Public'; });
          dataPricesPrivate = prices.filter(function(d){ return d['Public/Private'] === 'Private'; });
          dataAffordability = affordability;

          console.dir(dataCountries);
          console.dir(dataPricesPublic);
          console.dir(dataAffordability);

          prices = affordability = countries = null;  // reset temp variables for garbage collector

          setData();
        });
      });
    });

    // Setup MPR/Affordability Btns
    $('#mpr-btn, #affordability-btn').click(function(e){

      if( $(this).hasClass('active') ){ return; }

      $('#mpr-btn, #affordability-btn').removeClass('active');
      $(this).addClass('active');
      updateData();
    });

    // Setup Public/Private Btns
    $('#public-btn, #private-btn').click(function(e){

      if( $(this).hasClass('active') ){ return; }

      $('#private-btn, #public-btn').removeClass('active');
      $(this).addClass('active');
      updateData();
    });

    return that;
  };

  that.setState = function(stateID) {

    if( stateID === 5 ){

      /*
      d3.select('.overlay')
        .on('mouseout', onOverlayOut)
        .on("mousemove", onOverlayMove);
      */

      // Add dot events
      d3.selectAll('.dot')
        .on('mouseover', onDotOver )
        .on('mouseout', onDotOut );

    } else if( currentState === 5 ){

      // Remove dot events
      d3.selectAll('.dot')
        .on('mouseover', null )
        .on('mouseout', null );
    }

    currentState = stateID;

    return that;
  }; 

  that.resize = function() {

    setDimensions();  // Update width/height

    // Update SVG size
    d3.select('#main-infographic-svg')
      .attr('width', widthCont)
      .attr('height', heightCont);

    //Update Axis
    x.rangePoints([0, width]);
    y.range([height, 0]);

    xAxis.tickSize(-height);
    yAxis.tickSize(-width);

    d3.select('g.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .selectAll('text')
        .data( dataCountries )
        .attr('class', 'label')
        .attr('dy', '1.5em')
        .attr('dx', '-0.5em')
        .text(function(d){ return d.values[0].Code; })
        .style('text-anchor', 'start');

    d3.select('g.y.axis')
      .call(yAxis);

    // Update Dots & Lines
    d3.selectAll('.dot-lines .line')
      .attr('x1', setValueX)
      .attr('y1', height)
      .attr('x2', setValueX)
      .attr('y2', setValueY);

    d3.selectAll('.dot')
      .attr('cx', setValueX)
      .attr('cy', setValueY);
  };

  that.isInitialized = function(){  
    return initialized;
  };


  // Private Methods

  var setData = function(){

    var currentData = getCurrentData();

    var countrieNames = [];
    dataCountries.forEach(function(d) { countrieNames.push( d.key ); });

    x.domain( countrieNames );
    y.domain( d3.extent(currentData, function(d) { return d[ current.label ]; }) ).nice();
    color.domain( d3.extent(currentData, function(d) { return d.Drug; }) );

    xAxis.ticks( dataCountries.length );

    // Setup X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .selectAll('text')
      .data( dataCountries )
      .attr('class', 'label')
      .attr('dy', '1.5em')
      .attr('dx', '-0.5em')
      .text(function(d){ return d.values[0].Code; })
      .style('text-anchor', 'start');

    // Setup Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    /*
    // Mouse events overlay
    svg.append("rect")
      .attr("class", "overlay")
      .style('opacity', 0)
      .attr("width", width)
      .attr("height", height);

    // Country Marker
    svg.append("line")
      .attr("class", "country-marker")
      .attr("x1", 0)
      .attr("y1", height)
      .attr("x2", 0)
      .attr("y2", 0)
      .style('opacity', 0);
    */

    // Setup Lines
    svg.append('g')
      .attr('class', 'dot-lines')
    .selectAll('.dot-line')
      .data( currentData )
    .enter().append('line')
      .attr('id', setId)
      .attr('class', function(d) { return 'line'+setClass(d); })
      .attr('x1', setValueX)
      .attr('y1', height)
      .attr('x2', setValueX)
      .attr('y2', setValueY)
      .style('visibility', setVisibility)
      .style('opacity', 0)
      .style('stroke', setColor);

    // Setup Circles
    svg.append('g')
      .attr('class', 'dots')
    .selectAll('.dot')
      .data( currentData )
    .enter().append('circle')
      .attr('id', setId)
      .attr('class', function(d) { return 'dot'+setClass(d); })
      .attr('r', 7)
      .attr('cx', setValueX)
      .attr('cy', setValueY)
      .style('visibility', setVisibility)
      .style('opacity', DOT_OPACITY)
      .style('fill', setColor);
  };

  var updateData = function(){

    // Setup current data
    current.data = $('#mpr-btn').hasClass('active') ? 'prices' : 'affordability';
    current.type = $('#public-btn').hasClass('active') ? 'public' : 'private';
    current.label = (current.data === 'prices') ? 'Price' : ((current.type === 'public') ? 'Public sector' : 'Private sector');
    
    var item,
        currentData = getCurrentData();

    y.domain( d3.extent(currentData, function(d) { return d[ current.label ]; }) ).nice();

    svg.select('.y.axis')
      .transition().duration(1200).ease('sin-in-out')
        .call(yAxis);

    // Reset visibility for all dots & lines
    svg.selectAll('.dot, .line').style('visibility', 'hidden');

    currentData.forEach(function(d){

      item = svg.select('.dot'+getClass(d));

      // Update item
      if (!item.empty()) {

        item.datum(d)
          .style('visibility', setVisibility)
          .transition().duration(1200)
          .attr('cx', setValueX)
          .attr('cy', setValueY);

        item = svg.select('.line'+getClass(d));
        item.datum(d)
          .style('visibility', setVisibility)
          .attr('y2', setValueY);
      } 
      // Create item
      else{

        // Setup Lines
        d3.select('.dot-lines')
          .append('line')
          .datum(d)
          .attr('id', setId)
          .attr('class', function(d) { return 'line'+setClass(d); })
          .attr('x1', setValueX)
          .attr('y1', height)
          .attr('x2', setValueX)
          .attr('y2', setValueY)
          .style('visibility', setVisibility)
          .style('opacity', 0)
          .style('stroke', setColor);

        // Setup Circles
        d3.select('.dots')
          .append('circle')
          .datum(d)
          .attr('id', setId)
          .attr('class', function(d) { return 'dot'+setClass(d); })
          .attr('r', 7)
          .attr('cx', setValueX)
          .attr('cy', setValueY)
          .style('visibility', setVisibility)
          .style('opacity', DOT_OPACITY)
          .style('fill', setColor)
          .on('mouseover', onDotOver )
          .on('mouseout', onDotOut );
      }
    });
  };

  var onDotOver = function(){

    var item = d3.select(this);
          
    console.log('over dot', item.data() );

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
    $tooltip.select('.price').html( item.data()[0][ current.label ] + tooltipTxt[ current.data ] );

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

    svg.selectAll('.dot')
      .style('fill', function(d) { return color(d.Drug); })
      .style('opacity', DOT_OPACITY );

    $tooltip
      .style('opacity', '0')
      .style('right', 'auto')
      .style('left', '-1000px');
  };

  /*
  var onOverlayMove = function(){

    var xPos = d3.mouse(this)[0],
        leftEdges = x.range(),
        w = width / (dataCountries.length-1),
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
  */

  var niceName = function( drug ){
    return drug.toLowerCase().replace(/[ +,\/]/g,'-');
  };

  var setId = function(d){
    return niceName(d.Drug); 
  };

  var getClass = function(d){
   return '.country-' + niceName(d.Country) + '.drug-' + niceName(d.Drug);
  };

  var setClass = function(d){
   return ' country-' + niceName(d.Country) + ' drug-' + niceName(d.Drug);
  };

  var setValueX = function(d){
    return x(d.Country);
  };

  var setValueY = function(d){
    return (d[ current.label ] !== null) ? y(d[ current.label ]) : height;
  };

  var setVisibility = function(d){
    return (d[ current.label ] !== null) ? 'visible' : 'hidden';
  };

  var setColor = function(d){
    return color(d.Drug);
  };

  var getCurrentData = function(){
    return (current.data === 'affordability') ? dataAffordability : ((current.type === 'public') ? dataPricesPublic : dataPricesPrivate);
  };

  var setDimensions = function(){
    widthCont = $el.width();
    heightCont = $el.height();
    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;
  };


  return that;
}