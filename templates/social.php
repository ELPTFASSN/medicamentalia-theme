<?php 
$subtitle = get_field('subtitle');
$title = ( $subtitle ) ? $subtitle : get_the_title();
$title = urlencode( $title.'. Un proyecto de @civio' );
?>
<ul class="social-share">
  <li>
    <a class="btn btn-social-icon btn-twitter" onclick="window.open('https://twitter.com/intent/tweet?text=<?php echo $title ?>&amp;url=<?php the_permalink(); ?>','sharer','toolbar=0,status=0,width=548,height=500');" href="javascript: void(0)" title="Comparte esta página en Twitter">
      <i class="fa fa-twitter"></i>
    </a>
  </li>
  <li>
    <a class="btn btn-social-icon btn-facebook" onclick="window.open('https://www.facebook.com/dialog/share?app_id=620090684758872&amp;display=popup&amp;href=<?php the_permalink(); ?>&amp;redirect_uri=<?php the_permalink(); ?>','sharer','toolbar=0,status=0,width=548,height=500');" href="javascript: void(0)" title="Comparte esta página en Facebook">
      <i class="fa fa-facebook"></i>
    </a>
  </li>
  <li>
    <a class="btn btn-social-icon btn-google" onclick="window.open('https://plus.google.com/share?url=<?php the_permalink(); ?>','sharer','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=548,height=500');" href="javascript: void(0)" title="Comparte en Google Plus">
      <i class="fa fa-google-plus"></i>
    </a>
  </li>
</ul>