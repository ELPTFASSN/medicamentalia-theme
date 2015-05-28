<?php

/**
 * Source https://gist.github.com/ms-studio/7108833
 *
 * Rewriting the WordPress gallery shortcode
 *
 * Original WordPress code is located in : wp-includes/media/
 *
 * Customizations:
 * 1) no <br/> for line returns!
 * 2) attachment link should be "large" not full.... 
 * function wp_get_attachment_link
 * function get_attachment_link
 */
 
//deactivate WordPress function
remove_shortcode('gallery', 'gallery_shortcode');

//activate own function
add_shortcode('gallery', 'msdva_gallery_shortcode'); 
 
function msdva_gallery_shortcode($attr) {
  $post = get_post();

  static $instance = 0;
  $instance++;

  if ( ! empty( $attr['ids'] ) ) {
    // 'ids' is explicitly ordered, unless you specify otherwise.
    if ( empty( $attr['orderby'] ) )
      $attr['orderby'] = 'post__in';
    $attr['include'] = $attr['ids'];
  }

  // Allow plugins/themes to override the default gallery template.
  $output = apply_filters('post_gallery', '', $attr);
  if ( $output != '' )
    return $output;

  // We're trusting author input, so let's at least make sure it looks like a valid orderby statement
  if ( isset( $attr['orderby'] ) ) {
    $attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
    if ( !$attr['orderby'] )
      unset( $attr['orderby'] );
  }

  extract(shortcode_atts(array(
    'order'      => 'ASC',
    'orderby'    => 'menu_order ID',
    'id'         => $post ? $post->ID : 0,
    'itemtag'    => 'dl',
    'icontag'    => 'dt',
    'captiontag' => 'dd',
    'columns'    => 3,
    'size'       => 'thumbnail',
    'include'    => '',
    'exclude'    => '',
    'link'       => 'file' // CHANGE #1
  ), $attr, 'gallery'));

  $id = intval($id);
  if ( 'RAND' == $order )
    $orderby = 'none';

  if ( !empty($include) ) {
    $_attachments = get_posts( array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );

    $attachments = array();
    foreach ( $_attachments as $key => $val ) {
      $attachments[$val->ID] = $_attachments[$key];
    }
  } elseif ( !empty($exclude) ) {
    $attachments = get_children( array('post_parent' => $id, 'exclude' => $exclude, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
  } else {
    $attachments = get_children( array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
  }

  if ( empty($attachments) )
    return '';

  $itemtag = tag_escape($itemtag);
  $captiontag = tag_escape($captiontag);
  $icontag = tag_escape($icontag);
  $valid_tags = wp_kses_allowed_html( 'post' );

  $selector = "carousel-{$instance}";

  $gallery_style = $gallery_div = '';
  $size_class = sanitize_html_class( $size );
  $gallery_div = "</div>\n</div>\n</div>\n</div>\n<div id='$selector' class='carousel full-width slide' data-ride='carousel'><div class='carousel-inner' role='listbox'>";
  $output = apply_filters( 'gallery_style', $gallery_style . "\n\t\t" . $gallery_div );

    // NOTE: 
    // wp_get_attachment_link = 
    // takes ($id = 0, $size = 'thumbnail', $permalink = false, $icon = false, $text = false)

  $i = 0;
  
  foreach ( $attachments as $id => $attachment ) {
    $image_output = wp_get_attachment_image_src( $id, 'large' );

    $output .= ($i > 0) ? "<div class='item'>" : "<div class='item active'>";
    $output .= '<div class="fill" style="background-image:url('.$image_output[0].');"></div>';
    if ( $captiontag && trim($attachment->post_excerpt) ) {
      $output .= "
        <div class='carousel-caption'>
        " . wptexturize($attachment->post_excerpt) . "
        </div>";
    }
    $output .= "</div>";
    $i++;
  }

  $output .= "<a class='left carousel-control' href='#carousel-{$instance}' role='button' data-slide='prev'>
        <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>
        <span class='sr-only'>Previous</span>
      </a>
      <a class='right carousel-control' href='#carousel-{$instance}' role='button' data-slide='next'>
        <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>
        <span class='sr-only'>Next</span>
      </a>
      </div>\n
    </div>\n
    <div class='container page-content'>
    <div class='row'>
      <div class='col-sm-12'>
        <div class='page-content-container'>";

  return $output;
}

?>