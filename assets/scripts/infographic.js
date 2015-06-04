function infographic( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;

  var vis,
      scrollTop,
      endPosition,
      currentItem = -1,
      $el, $frame, $nav, $fixedEl, $contentList;


  // Public Methods

  that.init = function( type ) {

    $el = $( id );
    $contentList = $('.infographic-content li');

    setItems();

    $fixedEl = $('.infographic-content, .infographic-nav, .infographic-graph');

    // Setup Infographic by Type
    if( type === 'antimalaricos'){
      vis = antimalaricos_infographic( id+' .infographic-graph' ).init(); 
    }
    else if( type === 'fakes'){
      vis = fakes_infographic( id+' .infographic-graph' ).init(); 
    }

    that.onResize();
    
    $contentList.first().addClass('active');

    // Nav Buttons
    $nav.find('li a').click(function(e){
      e.preventDefault();
       
      $('html, body').animate({
        scrollTop: $('.infographic-frame li.frame-'+$(this).attr('href').substring(1)).offset().top + 2
      }, '200');
    });

    return that;
  };

  that.onScroll = function(e) {

    scrollTop = $(this).scrollTop();

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

    return that;
  };

  that.onResize = function() {

    $('.infographic-content, .infographic-nav, .infographic-frame li').height( $(window).height() );
    $('.infographic-graph').height( $(window).height() - $('.infographic-graph').position().top - 30 );

    endPosition = $el.offset().top+$el.height()-$(window).height();

    return that;
  };


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

  return that;
}