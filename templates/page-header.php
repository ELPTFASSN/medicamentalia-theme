<?php use Roots\Sage\Titles; ?>
<?php $origin_post_ID = icl_object_id(get_the_ID(), 'page', false, 'es'); ?>

<?php $bkg = wp_get_attachment_url( get_post_thumbnail_id(), 'large' ); ?>
<?php if( $bkg ) : ?>
<header class="page-<?= $origin_post_ID ?>" style="background-image: url('<?php echo $bkg; ?>')">
<?php else : ?>
<header class="page-<?= $origin_post_ID ?>">
<?php endif; ?>
  <div class="header-overlay"></div>
  <div class="header-content">
    <div class="header-content-inner">
        <h2><?= Titles\title(); ?></h2>
        <h1><?php the_field('subtitle'); ?></h1>
        <p><?php the_field('description'); ?></p>
    </div>
  </div>
</header>
