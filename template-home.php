<?php
/**
 * Template Name: Home Template
 */
?>

<?php do_action('icl_language_selector'); ?>

<?php while (have_posts()) : the_post(); ?>

  <!-- Home Intro -->
  <header>
    <video autoplay loop poster="<?php echo get_site_url(); ?>/wp-content/uploads/2015/06/home-bkg.jpg" id="home-bkg">
      <source src="<?php echo get_site_url(); ?>/wp-content/uploads/2015/06/home-bkg.m4v" type="video/mp4">
      <source src="<?php echo get_site_url(); ?>/wp-content/uploads/2015/06/home-bkg.webm" type="video/webm">
      <source src="<?php echo get_site_url(); ?>/wp-content/uploads/2015/06/home-bkg.ogv" type="video/ogg">
    </video>
    <div class="header-content">
      <div class="header-content-inner">
          <h1><?php bloginfo('name'); ?></h1>
          <p><?= __('Proyecto periodístico internacional sobre los precios de los medicamentos', 'sage'); ?></p>
      </div>
    </div>
    <a href="#home" class="btn btn-primary btn-xl btn-scroll-down " title="<?= __('Scroll down'); ?>"><?= __('Scroll down'); ?><span class="glyphicon glyphicon-chevron-down"></span><span class="animation"></span></a>
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
