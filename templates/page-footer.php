<!-- Home Main Menu -->
  <section class="no-padding page-footer" id="home">
    <div class="container-fluid">
      <div class="row no-gutter">
        <?php $ids = array(2,8,10,12); ?>
        <?php $originID = icl_object_id(get_the_ID(), 'page', false, 'es'); ?>
        <?php $ids = array_diff($ids, array($originID)); // remove current page id ?>
        <?php $home_query = new WP_Query( array('post_type' => 'page', 'post__in' => $ids) ); ?>
        <?php  while ( $home_query->have_posts() ) : $home_query->the_post(); ?>
          <div <?php post_class('col-md-4'); ?>>
            <?php get_template_part('templates/home', 'item'); ?>
          </div>
        <?php endwhile; ?>
      </div>
    </div>
  </section>