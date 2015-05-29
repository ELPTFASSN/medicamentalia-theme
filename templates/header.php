<nav id="top" class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-menu">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="<?= esc_url(home_url('/')); ?>" title="<?php bloginfo('name'); ?>"><?php bloginfo('name'); ?></a>
    </div>
    <div id="main-menu" class="collapse navbar-collapse">
      <?php
      if (has_nav_menu('primary_navigation')) :
        wp_nav_menu(array(
          'theme_location' => 'primary_navigation', 
          'menu_class' => 'nav navbar-nav navbar-right', 
          'container' => false
        ));
      endif;
      ?>
    </div>
  </div>
</nav>
