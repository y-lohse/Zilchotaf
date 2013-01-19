<!DOCTYPE HTML>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Zilchotaf</title>
    <link rel="stylesheet" href="<?php echo APP_PREFIX; ?>/css/style.css" />
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
  </head>
  <body>
    <?php echo $session->flash(); ?>
    <div id="content">
			<?php echo $content_for_layout ?>
    </div><!--#content-->
    <?php echo $scripts_for_layout ?>
  </body>
</html>