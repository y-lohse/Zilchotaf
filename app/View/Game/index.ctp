<?php
$this->Html->script('/js/core.js', false);
$this->Html->script('/js/controller.js', false);
$this->Html->script('/js/view.js', false);
$this->Html->script('/js/zilch.js', false);
?>
<div id="waiting">Waiting for other players</div>

<div id="end" class="hidden">
	<a href="/index/signoff"> Fin de partie </a>
</div>

<div id="game" class="hidden">
	<div id="col1">
		<img src="/img/logo_partie.png" alt="Zilchotaf Beta" />
		<div>
			<input type="button" value="Roll" id="roll" /> 
			<span id="freeroll" class="hidden">free</span>
			<input type="button" value="Bank" id="bank" /> 
			<span id="bankable">2500</span>
		</div>
	</div>
	<!--col1-->

	<div id="col2">

		<div id="joueurs">
			<div>
				<h2>Robert</h2>
				<h3>Score :</h3>
				<p id="score1">8987</p>
				<h3>Last three turns :</h3>
				<ul>
					<li>500</li>
					<li>400</li>
					<li class="score_zilch">zilch</li>
				</ul>

			</div>

			<div>
				<h2>George</h2>
				<h3>Score :</h3>
				<p id="score2">8987</p>
				<h3>Last three turns :</h3>
				<ul>
					<li>500</li>
					<li>400</li>
					<li class="score_zilch">zilch</li>
				</ul>
			</div>

		</div>
		<!--joueurs-->

		<div id="possibilites">
			<ul>
				<li>
					<p>Nom figure</p>
					<p>500</p>
				</li>
				<li>
					<p>Nom figure</p>
					<p>500</p>
				</li>
				<li>
					<p>Nom figure</p>
					<p>500</p>
				</li>
			</ul>
		</div>
		<!--possibilites-->

	</div>
	<!--col2-->

	<div id="des">
		<ul>
			<li class="un used">1</li>
			<li class="deux lock">2</li>
			<li class="trois des_roll">3</li>
			<li class="quatre">4</li>
			<li class="cinq">5</li>
			<li class="six">6</li>
		</ul>
	</div>
	<!--des-->
</div>