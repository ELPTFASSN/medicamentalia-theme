<?php

namespace Roots\Sage\Extras;

use Roots\Sage\Config;

/**
 * Add <body> classes
 */
function body_class($classes) {
  // Add page slug if it doesn't exist
  if (is_single() || is_page() && !is_front_page()) {
    if (!in_array(basename(get_permalink()), $classes)) {
      $classes[] = basename(get_permalink());
    }
  }

  // Add class if sidebar is active
  if (Config\display_sidebar()) {
    $classes[] = 'sidebar-primary';
  }

  return $classes;
}
add_filter('body_class', __NAMESPACE__ . '\\body_class');

/**
 * Clean up the_excerpt()
 */
function excerpt_more() {
  return ' &hellip; <a href="' . get_permalink() . '">' . __('Continued', 'sage') . '</a>';
}
add_filter('excerpt_more', __NAMESPACE__ . '\\excerpt_more');


function getUrlFriendlyString($str)
{
   // convert spaces to '-', remove characters that are not alphanumeric
   // or a '-', combine multiple dashes (i.e., '---') into one dash '-'.
   $str = preg_replace("/[-]+/", "-", preg_replace("/[^a-z0-9-]/", "",
      strtolower( str_replace(" ", "-", $str) ) ) );
   return $str;
}


 /* Generate Page Menu by h2 items */

function get_page_menu( $content ) {
  // Setup menu width h2 content
  $menuStr = '';
  preg_match_all('/<h2>(.+?)<\/h2>/', $content, $matches);
  foreach ($matches[1] as $match) {
    $menuStr .= '<li><a href="#'.getUrlFriendlyString($match).'" title="'.$match.'">'.$match.'</a></li>';
  }

  echo $menuStr;
}
add_action( 'get_page_menu', __NAMESPACE__ . '\\get_page_menu', 10, 1 );


 /* Add Anchor Links to h2 */

function the_content_add_anchor_links($content){

  // Add ids to h2
  $content = preg_replace_callback(
    '#\<h2\>(.+?)\<\/h2\>#s',
    function($m) {
      return '<a id="'.getUrlFriendlyString($m[1]).'" class="page-anchor"></a><h2>'.$m[1].'</h2>'; 
    },
    $content
  );

  return $content;
}

add_filter( 'the_content', __NAMESPACE__ . '\\the_content_add_anchor_links' );

