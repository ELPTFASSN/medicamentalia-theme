<?php
/**
 * Template Name: Iframe Template
 */
?>

<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/content', 'iframe'); ?>
<?php endwhile; ?>
