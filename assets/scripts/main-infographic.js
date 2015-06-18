function Main_Infographic( _id ) {

  var $ = jQuery.noConflict();

  var that = this,
      initialized = false,
      DOT_OPACITY = 0.7,
      current = {
        data: 'prices',
        type: 'public',
        order: 'area',
        label: 'Price'
      },
      txt = {
        'es': {
          'gratis': 'gratis',
          'dias': 'Días',
          'horas': 'horas'
        },
        'en': {
          'gratis': 'free',
          'dias': 'Days',
          'horas': 'hours'
        }
      },
      currentState = 0;

  var margin = {top: 150, right: 50, bottom: 50, left: 50},
      widthCont, heightCont,
      width, height;

  var id = _id,
      $el = $(id),
      $tooltip = $('#main-infographic-tooltip');

  var lang = $el.parent().data('lang');

  var color = d3.scale.ordinal()
      .range(['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00']);

  var svg,
      x, y, xAxis, yAxis,
      dataPricesPublic, dataPricesPrivate, dataAffordability, dataCountries, dataCountriesAll;

  var tickFormatPrices = function(d){ 
        if (d === 0) {
          return txt[lang].gratis; 
        }
        return d+'x'; 
      };

  var tickFormatAffordability = function(d){ 
        if (d === 0) {
          return txt[lang].gratis;
        }
        return d; 
      };

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
      .tickPadding(12)
      .tickSubdivide(true)
      .orient('bottom');

    yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(-width)
      .tickPadding(8)
      .tickFormat(tickFormatPrices)
      .orient('left');

    svg = d3.select(id).append('svg')
        .attr('id', 'main-infographic-svg')
        .attr('width', widthCont)
        .attr('height', heightCont)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Load CSVs
    queue()
      .defer(d3.csv, $('body').data('url')+'/dist/csv/prices.csv')
      .defer(d3.csv, $('body').data('url')+'/dist/csv/affordability.csv')
      .defer(d3.csv, $('body').data('url')+'/dist/csv/countries.csv')
      .await( onDataReady );

    return that;
  };

  that.setState = function(stateID) {

    if( stateID === 5 ){

      d3.select('.overlay')
        .on('mouseout', onOverlayOut)
        .on('mousemove', onOverlayMove);

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
      .call(xAxis);

    d3.select('g.y.axis')
      .call(yAxis);

    // Country Marker
    d3.select('.country-marker').attr('y1', height);
    d3.select('.country-label-code').attr('y', height+21);
    d3.select('.country-label').attr('y', height+36);

    // MPR Line
    d3.select('.mpr-line').attr('transform', 'translate(0 ' + y(1) + ')');
    d3.select('.mpr-line line').attr('x2', width);

    // Mouse events overlay
    d3.select('.overlay')
      .attr('width', width)
      .attr('height', height);

    // Update Dots & Lines
    d3.selectAll('.dot-lines .line')
      .attr('x1', setValueX)
      .attr('y1', height)
      .attr('x2', setValueX)
      .attr('y2', setValueY);

    d3.selectAll('.dot')
      .attr('cx', setValueX)
      .attr('cy', setValueY);

    return that;
  };

  that.isInitialized = function(){  
    return initialized;
  };


  // Private Methods

  var onDataReady = function( error, prices, affordability, countries ){

    prices = prices.filter(function(d){ return d['Unit/MPR'] === 'MPR'; });
    prices.forEach(function(d) {
      d.Price = (d.Price === 'NO DATA') ? null : ((d.Price !== 'free') ? +d.Price : 0);
    });
    
    affordability.forEach(function(d) {
      var affordabilityPublic =  d['Public sector - number of days'];
      var affordabilityPrivate =  d['Private sector - number of days'];
      d['Public sector - number of days']  = (affordabilityPublic !== 'NO DATA' && affordabilityPublic !== '') ? +affordabilityPublic : null;
      d['Private sector - number of days'] = (affordabilityPrivate !== 'NO DATA' && affordabilityPrivate !== '') ? +affordabilityPrivate : null;
    });

    dataCountries = dataCountriesAll = countries;
    dataPricesPublic  = prices.filter(function(d){ return d['Public/Private'] === 'Public'; });
    dataPricesPrivate = prices.filter(function(d){ return d['Public/Private'] === 'Private'; });
    dataAffordability = affordability;

    reorderCountriesByArea();

    /*
    console.dir(dataCountries);
    console.dir(dataPricesPublic);
    console.dir(dataAffordability);
    */

    prices = affordability = countries = null;  // reset temp variables for garbage collector

    setData();
    setupMenuBtns();
  };

  var setData = function(){

    var currentData = getCurrentData();

    // Set title
    $('#main-infographic-menu .'+current.data+'-'+current.type).show();

    x.domain( dataCountries.map(function(d){ return d.Code; }) );
    y.domain( d3.extent(currentData, function(d) { return d[ current.label ]; }) ).nice();
    color.domain( d3.extent(currentData, function(d) { return d.Drug; }) );

    xAxis.ticks( dataCountries.length );

    // Setup X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // Setup Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
        .attr('class', 'y-label')
        .attr('y', -15)
        .style('opacity', 0)
        .style('text-anchor', 'end')
        .text( txt[lang].dias );

    // Country Marker
    svg.append('line')
      .attr('class', 'country-marker')
      .attr('x1', 0)
      .attr('y1', height)
      .attr('x2', 0)
      .attr('y2', 0)
      .style('opacity', 0);

    svg.append('text')
      .attr('class', 'country-label-code')
      .attr('y', height+21)
      .style('opacity', 0);

    svg.append('text')
      .attr('class', 'country-label')
      .attr('y', height+36)
      .style('opacity', 0);

    // MPR Line
    svg.append('g')
      .attr('class', 'mpr-line')
      .attr('transform', 'translate(0 ' + y(1) + ')')
    .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', 0);

    d3.select('.mpr-line')
      .append('text')
      .attr('x', -8)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .text('MPR');

    // Mouse events overlay
    svg.append('rect')
      .attr('class', 'overlay')
      .style('opacity', 0)
      .attr('width', width)
      .attr('height', height);

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
    current.label = (current.data === 'prices') ? 'Price' : ((current.type === 'public') ? 'Public sector - number of days' : 'Private sector - number of days');

    if( !initialized ){ return that; }

    // Set title
    $('#main-infographic-menu h4').hide();
    $('#main-infographic-menu .'+current.data+'-'+current.type).show();

    var item,
        currentData = getCurrentData();

    if (current.data === 'prices') {
      yAxis.tickFormat(tickFormatPrices);
      d3.select('.y-label')
        .transition().duration(1000)
        .style('opacity', 0);
    } else {
      yAxis.tickFormat(tickFormatAffordability);
      d3.select('.y-label')
        .transition().duration(1000)
        .style('opacity', 1);
    }

    y.domain( d3.extent(currentData, function(d) { return d[ current.label ]; }) ).nice();

    svg.select('.y.axis')
      .transition().duration(1200).ease('sin-in-out')
        .call(yAxis);

    if (current.data === 'prices') {
      d3.select('.mpr-line')
        .transition().duration(1200)
        .attr('transform', 'translate(0 ' + y(1) + ')')
        .style('opacity', 1);
    } else {
      d3.select('.mpr-line')
        .transition().duration(1200)
        .style('opacity', 0);
    }

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

    return that;
  };

  var setupMenuBtns = function(){

    // MPR/Affordability Btns
    $('#mpr-btn, #affordability-btn').click(function(e){
      if( $(this).hasClass('active') ){ return; }
      $('#mpr-btn, #affordability-btn').removeClass('active');
      $(this).addClass('active');
      updateData();
    });

    // Public/Private Btns
    $('#public-btn, #private-btn').click(function(e){
      if( $(this).hasClass('active') ){ return; }
      $('#public-btn, #private-btn').removeClass('active');
      $(this).addClass('active');
      updateData();
    });

    // Order Btns
    $('#area-btn, #pib-btn').click(function(e){
      if( $(this).hasClass('active') ){ return; }
      $('#area-btn, #pib-btn').removeClass('active');
      $(this).addClass('active');
      reorderData();
    });

    $('#region-dropdown-menu .checkbox input').change(function(e){
      filterByRegion();
    });
  };

  var reorderData = function(){

    current.order = $('#area-btn').hasClass('active') ? 'area' : 'pib';

    // Order Countries
    if (current.order === 'area') {
      reorderCountriesByArea();
    } else {
      dataCountries.sort(function(x, y){
        return d3.ascending(+x.PIB, +y.PIB);
      });
    }

    // Update X Axis
    x.domain( dataCountries.map(function(d){ return d.Code; }) );

    d3.selectAll('.line')
      .attr('x1', setValueX)
      .attr('x2', setValueX);

    var transition = svg.transition().duration(1000);
    
    transition.selectAll('.dot')
      .attr('cx', setValueX);

    transition.select('.x.axis')
      .call(xAxis)
      .selectAll('g');

    return that;
  };

  var reorderCountriesByArea = function(){
    dataCountries.sort(function(x, y){
      if (x.Area === y.Area){
        return d3.ascending(x['Country_'+lang], y['Country_'+lang]);
      }
      return d3.ascending(x.Area, y.Area);
    });
  };
  
  var filterByRegion = function(){

    var regions = '';

    $('#region-dropdown-menu .checkbox input').each(function(){
      if( $(this).is(':checked') ){
        regions += $(this).attr('name')+' ';
      }
    });

    // Select all regions if there's no one
    if (regions === '') {
      $('#region-dropdown-menu .checkbox input').each(function(){
        $(this).attr('checked',true);
        regions += $(this).attr('name')+' ';
      });
    }

    // Filter Countries
    dataCountries = dataCountriesAll.filter(function(d){
      return regions.indexOf( d.Area ) > -1;
    });

    // Reorder Countries if order is PIB
    if (current.order === 'pib') {
      dataCountries.sort(function(x, y){
        return d3.ascending(+x.PIB, +y.PIB);
      });
    }

    // Update X Axis
    x.domain( dataCountries.map(function(d){ return d.Code; }) );

    d3.selectAll('.dot, .line')
      .style('visibility', setVisibility);

    d3.selectAll('.line')
      .attr('x1', setValueX)
      .attr('x2', setValueX);

    var transition = svg.transition().duration(1000);
  
    transition.selectAll('.dot')
      .attr('cx', setValueX);

    transition.select('.x.axis')
      .call(xAxis)
      .selectAll('g');
  };

  var onDotOver = function(){

    var item = d3.select(this);

    // Update opacity
    svg.selectAll('.dot')
      .style('fill', '#cacaca')
      .style('opacity', DOT_OPACITY);

    svg.selectAll('.dot.drug-'+item.attr('id'))
      .style('fill', function(d) { return color(d.Drug); }).style('opacity', 1);

    // Show lines & country marker labels
    svg.selectAll('.line.drug-'+item.attr('id')+', .country-label, .country-label-code').style('opacity', 1);

    // Set selected dots on top
    svg.selectAll('.dot').sort(function (a, b) {  
      return ( item.attr('id') === niceName(a.Drug) ) ? 1 : -1;
    });

    var data = +item.data()[0][ current.label ];
    var dataIcon = (current.data !== 'prices') ? 'glyphicon-time' : ( (data < 1) ? 'glyphicon-arrow-down' : 'glyphicon-arrow-up' );

    // Setup tooltip
    $tooltip.find('.country').html( getCountryData( item.data()[0].Country )[0]['Region_'+lang] ); 
    $tooltip.find('.year').html( '('+item.data()[0].Year+')' );
    $tooltip.find('.drug, .green .glyphicon, .green .txt').hide();
    $tooltip.find('.drug-'+item.data()[0].Drug.toLowerCase()).show();
    $tooltip.find('.green .'+dataIcon).show();

    if( data !== 0 ){
      $tooltip.find('.price').html( niceData(data) );
      $tooltip.find('.green .'+current.data+'-txt').show();
    } else {
      $tooltip.find('.price').html( 'gratis' );
    }

    if (current.data !== 'prices' && data < 1 && data !== 0) {
      $tooltip.find('.affordability-txt-hour').html( '  ('+Math.round(data*8)+' '+txt[lang].horas+')' ).show();
    }

    var left = item.attr('cx') > width*0.5;

    if( left ){
      $tooltip.addClass('left').css({'right': (widthCont-Math.round(item.attr('cx'))-margin.left)+'px', 'left': 'auto'});
    } else{
      $tooltip.removeClass('left').css({'right': 'auto', 'left': (Math.round(item.attr('cx'))+margin.left)+'px'});
    }

    $tooltip.css({'top': (Math.round(item.attr('cy'))+margin.top-8-($tooltip.height()*0.5))+'px', 'opacity': '1'});
  };

  var onDotOut = function(){

    svg.selectAll('.line')
      .style('opacity', 0);

    svg.selectAll('.dot')
      .style('fill', function(d) { return color(d.Drug); })
      .style('opacity', DOT_OPACITY );

    $tooltip.css({'opacity': '0', 'right': 'auto', 'left': '-1000px'});
  };

  var onOverlayMove = function(){

    var xPos = d3.mouse(this)[0],
        leftEdges = x.range(),
        w = width / (dataCountries.length-1),
        j = 0;

    while(xPos > (leftEdges[j] + (w*0.5))){ j++; }

    var countryCode = x.domain()[j];

    d3.select('.country-marker')
      .style('opacity', 1)
      .attr('transform', 'translate('+ x(countryCode) +' 0)');

    var countryData = dataCountries.filter(function(d){ return d.Code === countryCode; });

    d3.select('.country-label-code')
      .attr('x', x(countryCode))
      .style('opacity', 1)
      .text( countryCode );

    d3.select('.country-label')
      .attr('x', x(countryCode))  //-6)
      .style('opacity', 1)
      .text( countryData[0]['Country_'+lang] );

    /*
    svg.selectAll('.dot')
      .style('fill', '#cacaca')
      .style('opacity', DOT_OPACITY );

    svg.selectAll('.dot.country-'+niceName(x.domain()[j]))
      .style('fill', function(d) { return color(d.Drug); })
      .style('opacity', 1);
    */
  };

  var onOverlayOut = function(){

    d3.selectAll('.country-marker, .country-label, .country-label-code').style('opacity', 0);

    /*
    svg.selectAll('.dot')
      .style('fill', function(d) { return color(d.Drug); })
      .style('opacity', DOT_OPACITY );
    */
  };

  var niceName = function( drug ) {
    return drug.toLowerCase().replace(/[ +,\/]/g,'-');
  };

  var niceData = function( data ) {
    return (lang !== 'es') ? data.toFixed(2) : data.toFixed(2).toString().replace(/\./g,',');
  };

  var setId = function(d) {
    return niceName(d.Drug); 
  };

  var getClass = function(d) {
   return '.country-' + niceName(d.Country) + '.drug-' + niceName(d.Drug);
  };

  var setClass = function(d) {
   return ' country-' + niceName(d.Country) + ' drug-' + niceName(d.Drug);
  };

  var setValueX = function(d) {
    var countryData = getCountryData(d.Country);
    return ( countryData.length > 0 ) ? x(countryData[0].Code) : 0;
  };

  var setValueY = function(d) {
    return (d[ current.label ] !== null) ? y(d[ current.label ]) : height;
  };

  var setVisibility = function(d) {
    return (d[ current.label ] !== null && dataCountries.some(function(e){ return e.Region_en === d.Country; }) ) ? 'visible' : 'hidden';
  };

  var setColor = function(d) {
    return color(d.Drug);
  };

  var getCurrentData = function() {
    return (current.data === 'affordability') ? dataAffordability : ((current.type === 'public') ? dataPricesPublic : dataPricesPrivate);
  };

  var getCountryData = function( region ) {
    return dataCountries.filter(function(e){ return e.Region_en === region; });
  };

  var setDimensions = function() {
    widthCont = $el.width();
    heightCont = $el.height();
    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;
  };


  return that;
}
