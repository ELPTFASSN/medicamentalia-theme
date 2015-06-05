/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages

        // Smooth page scroll to an anchor on the same page.
        $(function() {
          $('a[href*=#]:not([href=#]):not(.carousel-control)').click(function() {
            if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
              if (target.length) {
                $('html,body').animate({
                  scrollTop: target.offset().top
                }, 1000);
                return false;
              }
            }
          });
        });
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Pages
    'page': {
      init: function() {

        var lastId,
            $navPage = $('.nav-page');

        var menuItems = $navPage.find('.navbar-nav li a');

        menuItems.click(function(e){
          menuItems.parent().removeClass('active');
          $(this).parent().addClass('active');
        });

        // Anchors corresponding to menu items
        var scrollItems = menuItems.map(function(){
            var item = $($(this).attr("href"));
            if (item.length) { return item; }
          });

        // Fix Nav Page & activate items when scroll down
        $(window).scroll(function(e) {
          
          if ($(this).scrollTop() > $('body > header').height()+50) {
            $navPage.addClass("fixed");
          } else {
            $navPage.removeClass("fixed");
          }

          // Get container scroll position
          var fromTop = $(this).scrollTop();
         
          // Get id of current scroll item
          var cur = scrollItems.map(function(){
           if ($(this).offset().top <= fromTop){
             return this;
           }
          });
          // Get the id of the current element
          cur = cur[cur.length-1];
          var id = cur && cur.length ? cur[0].id : "";

          if (lastId !== id) {
            lastId = id;
            // Set/remove active class
            menuItems
              .parent().removeClass("active")
              .end().filter("[href=#"+id+"]").parent().addClass("active");
          }

        });
      }
    },
    // Prices Page
    'prices': {
      init: function() {

        var w = $('.page-content').width();
        var vis = main_visualization('#main-vis').width( w ).height( Math.round(w*9/16) ).init();
      }
    },
    // Ghana Page
    'ghana': {
      init: function() {

        var fakes_infographic = new Infographic('#fakes-infographic', 'fakes');

        $(window).scroll( fakes_infographic.onScroll );
        $(window).resize( fakes_infographic.onResize );
      }
    },
    // Brasil Page
    'brasil': {
      init: function() {

        var w = $('#patents-vis').width();
        var vis = patents_visualization('#patents-vis').width( w ).height( w*0.5625 ).init();
      }
    },
    // Patents Page
    'patents': {
      init: function() {

        var patentes_infographic = new Infographic('#patentes-infographic', 'patentes');
        var antimalaricos_infographic = new Infographic('#antimalaricos-infographic', 'antimalaricos');

        $(window).scroll( function(e){
          patentes_infographic.onScroll();
          antimalaricos_infographic.onScroll();
        });
        $(window).resize( function(){
          patentes_infographic.onResize();
          antimalaricos_infographic.onResize(); 
        });
      }
    },
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
