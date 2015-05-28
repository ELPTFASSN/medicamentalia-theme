<nav class="nav-page">
  <div class="nav-page-container">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <ul class="nav navbar-nav">
            <?php do_action( 'get_page_menu', get_the_content() ); ?>
          </ul>
        </div>
      </div>
    </div>
  </div>
</nav>

<div class="container page-content">
  <div class="row">
    <div class="col-sm-12">
      <div class="page-content-container">
        <?php the_content(); ?>
      </div>
    </div>
  </div>
</div>