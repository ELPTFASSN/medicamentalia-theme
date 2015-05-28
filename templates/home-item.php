<a class="portfolio-box" href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
  <div class="portfolio-box-background"></div>
  <div class="portfolio-box-overlay"></div>
  <div class="portfolio-box-caption">
    <div class="portfolio-box-caption-content">
      <h3><?php the_title(); ?></h3>
      <div class="portfolio-box-caption-description"><?php the_field('home_description'); ?></div>
      <button class="read-more-btn btn">Leer Más</button>
    </div>
  </div>
</a>