<?php $content = get_the_content(); ?>
<?php $origin_post_ID = icl_object_id(get_the_ID(), 'page', false, 'es'); ?>

<?php // Check if there is h2 into content in order to generate Page Menu ?>
<?php if (strpos($content,'h2') !== false) : ?>
<nav class="nav-page page-<?= $origin_post_ID ?>">
  <div class="nav-page-container">
    <div class="container">
      <div class="row">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#page-menu">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <div id="page-menu" class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-left">
            <?php do_action( 'get_page_menu', $content ); ?>
          </ul>
        </div>
        <a href="#top" class="top-btn" title="Top"><i class="glyphicon glyphicon-chevron-up"></i></a>
        <a class="home-btn" href="<?= esc_url(home_url('/')); ?>" title="<?php bloginfo('name'); ?>"><?php bloginfo('name'); ?></a>
      </div>
    </div>
  </div>
</nav>
<?php endif; ?>

<div class="container page-content">
  <div class="row">
    <div class="col-sm-12">
      <div class="page-content-container">
        <p class="author"><?= __('Por', 'sage'); ?> <span><?php the_field('author'); ?></span></p>
        <?php the_content(); ?>
        <?php get_template_part('templates/social'); ?>
      </div>
    </div>
  </div>
</div>