var Infographic = function( _id, _type ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;
  var type = _type;

  var vis,
      scrollTop,
      endPosition,
      currentItem = -1,
      $el, $frame, $nav, $fixedEl, $contentList;


  // Private Methods

  var setItems = function(){

    $frame = $('<ul class="infographic-frame"></ul>');
    $nav = $('<ul class="infographic-nav"></ul>');

    var i = 1;

    $contentList.each(function(){
      $frame.append('<li class="frame-'+i+'"></li>');
      $nav.append('<li><a href="#'+i+'"></a></li>');
      i++;
    });

    $frame.append('<li class="frame-'+i+'"></li>');   // Add last frame item

    $el.append( $frame );
    $el.append( $nav );
  };


  // Public Methods

  that.init = function(){

    console.log('infographic', id, type);

    $el = $( id );
    $contentList = $el.find('.infographic-content li');

    setItems();   // Setup Frame & Navigation Items

    $fixedEl = $el.find('.infographic-content, .infographic-nav, .infographic-graph');

    // Setup Infographic by Type
    if( type === 'antimalaricos'){
      vis = new Antimalaricos_Infographic( id+' .infographic-graph' ).init(); 
    }
    else if( type === 'patentes'){
      vis = new Patents_Infographic( id+' .infographic-graph' ).init(); 
    }
    else if( type === 'fakes'){
      vis = new Fakes_Infographic( id+' .infographic-graph' ).init(); 
    }

    console.log('vis', vis.setState );

    that.onResize();
    
    $contentList.first().addClass('active');    // Setup firs content item as active

    // Nav Buttons Click Interaction
    $nav.find('li a').click(function(e){
      e.preventDefault();
       
      $('html, body').animate({
        scrollTop: $('.infographic-frame li.frame-'+$(this).attr('href').substring(1)).offset().top + 2
      }, '200');
    });
  };


  that.onScroll = function(e) {

    scrollTop = $(window).scrollTop();

    if ( scrollTop >= $el.offset().top && scrollTop < endPosition ) {
      $fixedEl.addClass('fixed');
    } else {
      $fixedEl.removeClass('fixed');
    }

    if ( scrollTop >= endPosition ) {
      $fixedEl.addClass('bottom');
    }
    else{
      $fixedEl.removeClass('bottom');
    }

    var lastItem = currentItem,
        temp = Math.floor((scrollTop-$el.offset().top) / $(window).height());

    if( currentItem !== temp ) {

      currentItem = temp;

      if( currentItem >= 0 ){

        console.log('state', type, currentItem);

        vis.setState( currentItem );

        if( lastItem < currentItem ){
          $contentList.not('.active').css('top', '40px');
          $contentList.filter('.active').css('top', '-40px').removeClass('active');
        }
        else{
          $contentList.not('.active').css('top', '-40px');
          $contentList.filter('.active').css('top', '40px').removeClass('active');
        }

        $contentList.eq(currentItem).css('top', '0px').addClass('active');

        $nav.find('li').removeClass('active');
        $nav.find('li').eq(currentItem).addClass('active');
      }
    }
  };

  that.onResize = function() {

    $el.find('.infographic-content, .infographic-nav, .infographic-frame li').height( $(window).height() );
    $el.find('.infographic-graph').height( $(window).height() - $('.infographic-graph').position().top - 30 );

    endPosition = $el.offset().top + $el.height() - $(window).height();
  };

  // Init
  that.init();
};