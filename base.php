<?php

use Roots\Sage\Config;
use Roots\Sage\Wrapper;

?>

<?php get_template_part('templates/head'); ?>
  <body <?php body_class(); ?> data-url="<?php echo get_template_directory_uri(); ?>">
    <!--[if lt IE 9]>
      <div class="alert alert-warning">
        <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'sage'); ?>
      </div>
    <![endif]-->
    <?php
    if(!is_page_template('template-iframe.php')){
      do_action('get_header');
      get_template_part('templates/header');
    }
    ?>
    
    <?php include Wrapper\template_path(); ?>

    <?php
    if(!is_page_template('template-iframe.php')){
      do_action('get_footer');
      get_template_part('templates/footer');
    }
    wp_footer();
    ?>

    <!-- Analytics Code -->
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-28946840-11', 'auto');
      ga('send', 'pageview');
    </script>
  </body>
</html>
