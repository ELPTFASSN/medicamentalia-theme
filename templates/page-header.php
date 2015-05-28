<?php use Roots\Sage\Titles; ?>

<header>
  <div class="header-overlay"></div>
  <div class="header-content">
    <div class="header-content-inner">
        <h1><?= Titles\title(); ?></h1>
        <h2><?php the_field('subtitle'); ?></h2>
        <p><?php the_field('description'); ?></p>
    </div>
  </div>
</header>
