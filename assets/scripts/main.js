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
        $('#main-menu .navbar-nav>li.menu-item-language>a').click(function(e){
          $('#main-menu .submenu-languages').toggle();
        });

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
          $('#page-menu').removeClass('in');
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

        setupInfographics();
      }
    },
  };

  var setupInfographics = function(){

    $('[data-toggle="tooltip"]').tooltip(); // Init Tooltips
    $('.dropdown-toggle').dropdown();       // Init Dropdown
    $('#region-dropdown-menu, #drug-dropdown-menu').click(function(e){ e.stopPropagation(); });

    if ($('#main-infographic').size() > 0) {
      var main_infographic = new Infographic('#main-infographic', 'main');
      $(window).scroll( main_infographic.onScroll );
      $(window).resize( main_infographic.onResize );
    } 
    else if ($('#fakes-infographic').size() > 0) {
      var fakes_infographic = new Infographic('#fakes-infographic', 'fakes');
      $(window).scroll( fakes_infographic.onScroll );
      $(window).resize( fakes_infographic.onResize );
    }
    else if ($('#patents-graph').size() > 0) {
      var graph = patents_graph('#patents-graph').init();
      $(window).resize( graph.onResize );
    }
    else if ($('#patentes-infographic').size() > 0) {
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
