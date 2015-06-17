<?php $origin_post_ID = icl_object_id(get_the_ID(), 'page', false, 'es'); ?>
<a class="portfolio-box portfolio-id-<?= $origin_post_ID; ?>" href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
  <?php $bkg = wp_get_attachment_url( get_post_thumbnail_id(), 'large' ); ?>
  <?php if( $bkg ) : ?>
  <div class="portfolio-box-background" style="background-image: url('<?php echo $bkg; ?>')"></div>
  <?php else : ?>
  <div class="portfolio-box-background"></div>
  <?php endif; ?>
  <div class="portfolio-box-overlay"></div>
  <div class="portfolio-box-caption">
    <div class="portfolio-box-caption-content">
      <h3><?php the_title(); ?></h3>
      <div class="portfolio-box-caption-description"><?php the_field('home_description'); ?></div>
      <?php if( $origin_post_ID != 2 ) :  ?>
      <button class="read-more-btn btn"><?= __('Leer Más', 'sage'); ?></button>
      <?php else: ?>
      <button class="read-more-btn btn"><?= __('Explora los datos', 'sage'); ?></button>
      <?php endif; ?>
    </div>
  </div>
</a>