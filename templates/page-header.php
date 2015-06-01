<?php use Roots\Sage\Titles; ?>

<header>
  <div class="header-overlay"></div>
  <div class="header-content">
    <div class="header-content-inner">
        <h2><?= Titles\title(); ?></h2>
        <h1><?php the_field('subtitle'); ?></h1>
        <p><?php the_field('description'); ?></p>
    </div>
  </div>
</header>
