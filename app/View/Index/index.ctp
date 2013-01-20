<header>
	<img src="/img/logo_connec.jpg" alt="Zilchotaf beta" />
</header>

<?php echo $this->Form->create(false, array('action'=>'index')); ?>

<div id="entrees">
	<label for="name">Pseudo du joueur</label>
	<?php echo $this->Form->text('name'); ?>

	<label for="gamename">Nom de la partie</label>
	<?php echo $this->Form->text('gamename'); ?>
</div>
<!--#entrees-->

<div id="les_bt">
	<?php echo $this->Form->submit('Créer', array('name'=>'action')); ?>
	<?php echo $this->Form->submit('Rejoindre', array('name'=>'action')); ?>
</div>
<!--#les_bt-->

<?php echo $this->Form->end(); ?>