<?php use Roots\Sage\Titles; ?>

<?php $bkg = wp_get_attachment_url( get_post_thumbnail_id(), 'large' ); ?>
<?php if( $bkg ) : ?>
<header style="background-image: url('<?php echo $bkg; ?>')">
<?php else : ?>
<header>
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
