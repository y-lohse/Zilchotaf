<?php

class History extends AppModel {
	public $useTable = 'history';
	public $primaryKey = 'history_id';
	
	public function push($game, $player, $score){
		$this->create();
		$this->set('game_id', $game);
		$this->set('player_id', $player);
		$this->set('history_score', $score);
		$this->save();
	}
}
?>