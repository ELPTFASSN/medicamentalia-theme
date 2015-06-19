function Main_Infographic( _id ) {

  var $ = jQuery.noConflict();

  var that = this,
      initialized = false,
      DOT_OPACITY = 0.7,
      DOT_GRAY = '#cacaca',
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
      dotClicked = null,
      currentState = 0;

  var margin = {top: 150, right: 50, bottom: 50, left: 50},
      widthCont, heightCont,
      width, height;

  var id = _id,
      $el = $(id),
      $menu = $('#main-infographic-menu'),
      $tooltip = $('#main-infographic-tooltip'),
      $regionDropdownInputs = $('#region-dropdown-menu .checkbox input'),
      $drugDropdownInputs = $('#drug-dropdown-menu .checkbox input');

  var lang = $el.parent().data('lang');

  var color = d3.scale.ordinal()
      .range(['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00']);

  var svg,
      x, y, xAxis, yAxis,
      drugsFiltered, drugsFilteredAll,
      dataPricesPublic, dataPricesPrivate, dataAffordability, dataCountries, dataCountriesAll;

  var $dots, $lines, $countryMarker, $countryLabel, $countryLabelCode, $overlay, $mprLine, $yAxis, $xAxis, $yLabel;

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

    // Set drug filtered
    drugsFilteredAll = '';
    $drugDropdownInputs.each(function(){
      drugsFilteredAll += $(this).attr('name')+' ';
    });
    drugsFiltered = drugsFilteredAll;

    // Load CSVs
    queue()
      .defer(d3.csv, $('body').data('url')+'/dist/csv/prices.csv')
      .defer(d3.csv, $('body').data('url')+'/dist/csv/affordability.csv')
      .defer(d3.csv, $('body').data('url')+'/dist/csv/countries.csv')
      .await( onDataReady );

    return that;
  };

  that.setState = function(stateID) {

    console.log( stateID );

    if( stateID === 0 ){

      //current.data = 'affordability';
      //current.type = 'private';
      //current.order = 'pib';
      drugsFiltered = drugsFilteredAll;
      
      updateData( 'affordability', 'private' );
      reorderData( 'pib' );

      // Show only Salbutamol dots
      $dots.transition(1000)
        .style('fill', function(d){ return (d.Drug !== 'Salbutamol') ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (d.Drug !== 'Salbutamol') ? DOT_OPACITY : 1; });

      // Set selected dots on top
      $dots.sort(function (a, b) {  
        return (a.Drug === 'Salbutamol') ? 1 : -1;
      });

    } else if( stateID === 1 ){

      //current.data = 'affordability';
      //current.type = 'private';
      //current.order = 'pib';
      drugsFiltered = drugsFilteredAll;

      updateData( 'affordability', 'private' );
      reorderData( 'pib' );

      // Show all dots
      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY );

    } else if( stateID === 2 ){

      //current.data = 'affordability';
      //current.type = 'private';
      //current.order = 'area';
      drugsFiltered = 'Simvastatin Omeprazole';

      updateData( 'affordability', 'private' );
      reorderData( 'area' );

      // Show only drugsFiltered dots
      $dots.transition(1000)
        .style('fill', function(d){ return (drugsFiltered.indexOf(d.Drug) === -1) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (drugsFiltered.indexOf(d.Drug) === -1) ? DOT_OPACITY : 1; });

      // Set selected dots on top
      $dots.sort(function (a, b) {  
        return (drugsFiltered.indexOf(a.Drug) > -1) ? 1 : -1;
      });

    } else if( stateID === 3 ){

      //current.data = 'affordability';
      //current.type = 'private';
      //current.order = 'pib';
      drugsFiltered = drugsFilteredAll;

      var countries = 'São Tomé and Príncipe Kuwait Italy Spain';

      updateData( 'affordability', 'private' );
      reorderData( 'pib' );

      $dots.transition(1000)
        .style('fill', function(d){ return (countries.indexOf( d.Country ) === -1 ) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (countries.indexOf( d.Country ) === -1 ) ? DOT_OPACITY : 1; });

    } else if( stateID === 4 ){

      //current.data = 'prices';
      //current.type = 'private';
      //current.order = 'pib';
      drugsFiltered = drugsFilteredAll;

      updateData( 'prices', 'private' );
      reorderData( 'pib' );

      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);

    } else if( stateID === 5 ){

      //current.data = 'prices';
      //current.type = 'private';
      //current.order = 'pib';
      drugsFiltered = drugsFilteredAll;

      updateData( 'prices', 'private' );
      reorderData( 'pib' );

      $dots.transition(1000)
        .style('fill', DOT_GRAY)
        .style('opacity',DOT_OPACITY);

      svg.selectAll('.dot.drug-ciprofloxacin.country-kuwait')
        .transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', 1);

    } else if( stateID === 6 ){

      //current.data = 'affordability';
      //current.type = 'public';
      //current.order = 'pib';
      drugsFiltered = drugsFilteredAll;

      updateData( 'affordability', 'public' );
      reorderData( 'pib' );

      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);

    } else if( stateID === 7 ){

      //current.data = 'prices';
      //current.type = 'public';
      //current.order = 'pib';
      drugsFiltered = drugsFilteredAll;

      updateData( 'prices', 'public' );
      reorderData( 'pib' );

      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);

    } else if( stateID === 8 ){

      //current.data = 'prices';
      //current.type = 'private';
      //current.order = 'pib';
      drugsFiltered = drugsFilteredAll;

      updateData( 'prices', 'private' );
      reorderData( 'pib' );

      // Show only drugsFiltered dots
      $dots.transition(1000)
        .style('fill', function(d){ return ('Ciprofloxacin' !== d.Drug) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return ('Ciprofloxacin' !== d.Drug) ? DOT_OPACITY : 1; });

      // Set selected dots on top
      $dots.sort(function (a, b) {  
        return ('Ciprofloxacin' === a.Drug) ? 1 : -1;
      });

    } else if( stateID === 9 ){

      //current.data = 'prices';
      //current.type = 'public';
      //current.order = 'area';
      drugsFiltered = drugsFilteredAll;

      updateData( 'prices', 'public' );
      reorderData( 'area' );

      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);
    }

    console.log( drugsFiltered );

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

    $xAxis
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    $yAxis.call(yAxis);

    // Country Marker
    $countryMarker.attr('y1', height);
    $countryLabelCode.attr('y', height+21);
    $countryLabel.attr('y', height+36);

    // MPR Line
    $mprLine.attr('transform', 'translate(0 ' + y(1) + ')');
    $mprLine.selectAll('line').attr('x2', width);

    // Mouse events overlay
    $overlay
      .attr('width', width)
      .attr('height', height);

    // Update Dots & Lines
    $lines
      .attr('x1', setValueX)
      .attr('y1', height)
      .attr('x2', setValueX)
      .attr('y2', setValueY);

    $dots
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
    $menu.find('.'+current.data+'-'+current.type).show();

    x.domain( dataCountries.map(function(d){ return d.Code; }) );
    y.domain( d3.extent(currentData, function(d) { return d[ current.label ]; }) ).nice();
    color.domain( d3.extent(currentData, function(d) { return d.Drug; }) );

    xAxis.ticks( dataCountries.length );

    // Setup X Axis
    $xAxis = svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // Setup Y Axis
    $yAxis = svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    $yLabel = $yAxis.append('text')
        .attr('class', 'y-label')
        .attr('y', -15)
        .style('opacity', 0)
        .style('text-anchor', 'end')
        .text( txt[lang].dias );

    // Country Marker
    $countryMarker = svg.append('line')
      .attr('class', 'country-marker')
      .attr('x1', 0)
      .attr('y1', height)
      .attr('x2', 0)
      .attr('y2', 0)
      .style('opacity', 0);

    $countryLabelCode = svg.append('text')
      .attr('class', 'country-label-code')
      .attr('y', height+21)
      .style('opacity', 0);

    $countryLabel = svg.append('text')
      .attr('class', 'country-label')
      .attr('y', height+36)
      .style('opacity', 0);

    // MPR Line
    $mprLine = svg.append('g')
      .attr('class', 'mpr-line')
      .attr('transform', 'translate(0 ' + y(1) + ')');
    $mprLine.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', 0);
    $mprLine.append('text')
      .attr('x', -8)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .text('MPR');

    // Mouse events overlay
    $overlay = svg.append('rect')
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

    $dots = d3.selectAll('.dot');
    $lines = d3.selectAll('.line');

    // Add Events
    $overlay
      .on('mouseout', onOverlayOut)
      .on('mousemove', onOverlayMove)
      .on('click', resetDotClicked);

    // Add dot events
    $dots
      .on('mouseover', onDotOver )
      .on('mouseout', onDotOut );
  };

  var updateData = function( _data, _type ){

    _data = typeof _data !== 'undefined' ? _data : false;
    _type = typeof _type !== 'undefined' ? _type : false;

    // Setup current data
    if( _data && _type ){
      if (current.data === _data && current.type === _type) {
        return that;
      } else {
        current.data = _data;
        current.type = _type;
      }
    }
    else{
      current.data = $('#mpr-btn').hasClass('active') ? 'prices' : 'affordability';
      current.type = $('#public-btn').hasClass('active') ? 'public' : 'private';
    }

    if( !initialized ){ return that; }

    current.label = (current.data === 'prices') ? 'Price' : ((current.type === 'public') ? 'Public sector - number of days' : 'Private sector - number of days');

    console.log( 'update data', current );

    resetDotClicked();

    // Set title
    if( !_data || !_type ){  
      $menu.find('h4').hide();
      $menu.find('.'+current.data+'-'+current.type).show();
    }

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

    $yAxis.transition().duration(1200).ease('sin-in-out').call(yAxis);

    if (current.data === 'prices') {
      $mprLine
        .transition().duration(1200)
        .attr('transform', 'translate(0 ' + y(1) + ')')
        .style('opacity', 1);
    } else {
      $mprLine
        .transition().duration(1200)
        .style('opacity', 0);
    }

    // Reset visibility for all dots & lines
    $dots.style('visibility', 'hidden');
    $lines.style('visibility', 'hidden');

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

    $dots = d3.selectAll('.dot');
    $lines = d3.selectAll('.line');

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

    $regionDropdownInputs.change(function(e){ filterByRegion(); });

    $drugDropdownInputs.change(function(e){ filterByDrug(); });
  };

  var reorderData = function( _order ){

    _order = typeof _order !== 'undefined' ? _order : false;

    // Set order
    if( _order ){
      if (current.order === _order){
        return that;
      } else {
        current.order = _order;
      }
    }
    else{
      current.order = $('#area-btn').hasClass('active') ? 'area' : 'pib';
    }

    console.log('reorderData', current.order );

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

    $lines
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
  
  var filterByRegion = function( _regions ){

    var regions = '';

    if( _regions){

      regions = _regions;

    } else{

      $regionDropdownInputs.each(function(){
        if( $(this).is(':checked') ){
          regions += $(this).attr('name')+' ';
        }
      });

      // Select all regions if there's no one
      if (regions === '') {
        $regionDropdownInputs.each(function(){
          $(this).attr('checked',true);
          regions += $(this).attr('name')+' ';
        });
      }
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

    $dots.style('visibility', setVisibility);
   
    $lines
      .attr('x1', setValueX)
      .attr('x2', setValueX)
      .style('visibility', setVisibility);

    var transition = svg.transition().duration(1000);
  
    transition.selectAll('.dot')
      .attr('cx', setValueX);

    transition.select('.x.axis')
      .call(xAxis)
      .selectAll('g');
  };

  var filterByDrug = function(){

    drugsFiltered = '';

    $drugDropdownInputs.each(function(){
      if( $(this).is(':checked') ){
        drugsFiltered += $(this).attr('name')+' ';
      }
    });

    // Select all regions if there's no one
    if (drugsFiltered === '') {
      drugsFiltered = drugsFilteredAll;
      $drugDropdownInputs.each(function(){ $(this).attr('checked',true); });
    }

    $dots.style('visibility', setVisibility);
  };

  var onDotOver = function(){

    $dots.on('click', onDotClick );

    var item = d3.select(this);

    // Update opacity
    $dots
      .style('fill', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_GRAY : color(d.Drug); })
      .style('opacity', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_OPACITY : 1; });

    svg.selectAll('.dot.drug-'+item.attr('id'))
      .style('fill', function(d) { return color(d.Drug); }).style('opacity', 1);

    // Show lines & country marker labels
    svg.selectAll('.line.drug-'+item.attr('id')).style('opacity', 1);
    $countryLabel.style('opacity', 1);
    $countryLabelCode.style('opacity', 1);

    // Set selected dots on top
    $dots.sort(function (a, b) {  
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

    $dots.on('click', null );

    if (dotClicked === null) {
      $dots
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);

      $lines.style('opacity', 0);
    }
    else {
      $dots
        .style('fill', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_OPACITY : 1; });
      
      $lines.style('opacity', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? 0 : 1; });
    }
  
    $tooltip.css({'opacity': '0', 'right': 'auto', 'left': '-1000px'});
  };

  var onDotClick = function(){

    var id = d3.select(this).attr('id');
    dotClicked = ( id !== dotClicked ) ? id : null;
  };

  var onOverlayMove = function(){

    var xPos = d3.mouse(this)[0],
        leftEdges = x.range(),
        w = width / (dataCountries.length-1),
        j = 0;

    while(xPos > (leftEdges[j] + (w*0.5))){ j++; }

    var countryCode = x.domain()[j];

    $countryMarker
      .style('opacity', 1)
      .attr('transform', 'translate('+ x(countryCode) +' 0)');

    var countryData = dataCountries.filter(function(d){ return d.Code === countryCode; });

    $countryLabelCode
      .attr('x', x(countryCode))
      .style('opacity', 1)
      .text( countryCode );

    $countryLabel
      .attr('x', x(countryCode))  //-6)
      .style('opacity', 1)
      .text( countryData[0]['Country_'+lang] );

    /*
    svg.selectAll('.dot')
      .style('fill', DOT_GRAY)
      .style('opacity', DOT_OPACITY );

    svg.selectAll('.dot.country-'+niceName(x.domain()[j]))
      .style('fill', function(d) { return color(d.Drug); })
      .style('opacity', 1);
    */
  };

  var onOverlayOut = function(){

    $countryMarker.style('opacity', 0);
    $countryLabel.style('opacity', 0);
    $countryLabelCode.style('opacity', 0);
  };

  var resetDotClicked = function(){
    if (dotClicked !== null) {
      dotClicked = null;
      $dots
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);
      $lines.style('opacity', 0);
    }
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
    return (d[ current.label ] !== null && drugsFiltered.indexOf( d.Drug ) > -1 && dataCountries.some(function(e){ return e.Region_en === d.Country; }) ) ? 'visible' : 'hidden';
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
