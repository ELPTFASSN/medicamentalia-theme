<div class="partners">
  <div class="container">
    <?php dynamic_sidebar('sidebar-footer'); ?>

    <div class="row main-partners">
      <div class="col-sm-6">
        <p><?= __('Medicamentalia es un proyecto de', 'sage'); ?></p>
        <a class="partner-logo" href="http://www.civio.es" target="_blank" title="Fundación Ciudadana Civio">
          <img src="<?php echo get_template_directory_uri() ?>/assets/images/logo-civio.png" alt="Fundación Ciudadana Civio">
        </a>
      </div>
      <div class="col-sm-6">
        <p><?= __('Financiado por', 'sage'); ?></p>
        <a class="partner-logo" href="http://dev.journalismgrants.org/projects/third-world-treatments-first-world-prices" target="_blank" title="Journalism Grants">
          <img src="<?php echo get_template_directory_uri() ?>/assets/images/journalismgrants.png" alt="Journalism Grants">
        </a>
      </div>
      <div class="col-sm-12">
        <hr>
      </div>
    </div>

    <div class="row">
      <p><?= __('Cuenta con media partners como', 'sage'); ?></p>
      <div class="col-sm-3">
        <a href="http://www.20minutos.es/" class="logo" target="_blank" title="20Minutos">
          <img class="img-responsive" src="<?php echo get_template_directory_uri() ?>/assets/images/20minutos.png" alt="20Minutos">
        </a>
      </div>
      <div class="col-sm-3">
        <a href="http://cadenaser.com/" class="logo" target="_blank" title="Cadena SER">
          <img class="img-responsive" src="<?php echo get_template_directory_uri() ?>/assets/images/cadenaser.png" alt="Cadena SER">
        </a>
      </div>
      <div class="col-sm-3">
        <a href="http://www.corriere.it/" class="logo" target="_blank" title="Corriere della Sera">
          <img class="img-responsive" src="<?php echo get_template_directory_uri() ?>/assets/images/corrieredellasera.png" alt="Corriere della Sera">
        </a>
      </div>
      <div class="col-sm-3">
        <a href="https://correctiv.org/" class="logo" target="_blank" title="Correctiv">
          <img class="img-responsive" src="<?php echo get_template_directory_uri() ?>/assets/images/correctiv.png" alt="Correctiv">
        </a>
      </div>
      <div class="col-sm-12">
        <hr>
      </div>
    </div>
        
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <a href="/nosotros" class="nosotros" title="<?= __('Metodología y equipo', 'sage'); ?>"><?= __('Metodología y equipo', 'sage'); ?></a>
        <p><?= __('Si quieres más información, suscríbete a nuestro boletín o escríbenos a', 'sage'); ?> <a href="mailto:contacto@civio.es">contacto@civio.es</a></p>
        <form target="_blank" class="validate" name="mc-embedded-subscribe-form" id="mc-embedded-subscribe-form" method="post" action="http://civio.us4.list-manage1.com/subscribe/post?u=9416fe6b76f2c3f985c1f8e0f&amp;id=9d5b4c8cda">         
          <input id="mce-EMAIL" class="email" type="email" required="" placeholder="correo" name="EMAIL" value="<?= __('SUSCRÍBETE AL BOLETÍN', 'sage'); ?>">           
          <button type="submit" id="btn-newsletter-header" class="btn btn-submit"><i class="glyphicon glyphicon-chevron-right"></i><span><?= __('Enviar', 'sage'); ?></span></button>   
        </form>
      </div>
    </div>
  </div>
</div>

<footer class="footer">
  <div class="container">
    <p>© <time datetime="2015-05-22T10:41:19+02:00">2015</time> · <a href="http://civio.es" target="_blank" title="Fundación Ciudadana Civio">Fundación Ciudadana Civio</a></p>
  </div>
</footer>
