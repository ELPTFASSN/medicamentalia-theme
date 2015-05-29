<?php $content = get_the_content(); ?>

<?php // Check if there is h2 into content in order to generate Page Menu ?>
<?php if (strpos($content,'h2') !== false) : ?>
<nav class="nav-page">
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
      </div>
    </div>
  </div>
</nav>
<?php endif; ?>

<div class="container page-content">
  <div class="row">
    <div class="col-sm-12">
      <div class="page-content-container">
        <?php the_content(); ?>
      </div>
    </div>
  </div>
</div>