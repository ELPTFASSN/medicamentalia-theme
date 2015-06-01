<?php
/**
 * Template Name: Home Template
 */
?>

<?php while (have_posts()) : the_post(); ?>

  <!-- Home Intro -->
  <header>
    <div class="header-overlay"></div>
    <div class="header-content">
      <div class="header-content-inner">
          <h1><?php bloginfo('name'); ?></h1>
          <p><?php bloginfo('description'); ?></p>
      </div>
    </div>
    <a href="#home" class="btn btn-primary btn-xl btn-scroll-down " title="Scroll down">Scroll down <span class="glyphicon glyphicon-chevron-down"></span><span class="animation"></span></a>
  </header>

  <!-- Home Main Menu -->
  <section class="no-padding" id="home">
    <div class="container-fluid">
      <div class="row no-gutter">
        <?php $i = 0; ?>
        <?php $ids = array(2,8,10,12); ?>
        <?php $home_query = new WP_Query( array('post_type' => 'page', 'post__in' => $ids, 'order' => 'ASC') ); ?>
        <?php  while ( $home_query->have_posts() ) : $home_query->the_post(); ?>
          <?php $class = ($i != 0 ) ? 'col-lg-4 col-sm-6' : 'col-lg-12 col-sm-6'; ?>
          <div <?php post_class($class); ?>>
            <?php get_template_part('templates/home', 'item'); ?>
          </div>
          <?php $i++; ?>
        <?php endwhile; ?>
      </div>
    </div>
  </section>

<?php endwhile; ?>
