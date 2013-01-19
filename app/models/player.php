<?php

class Player extends AppModel {
	public $useTable = 'player';
	public $primaryKey = 'player_id';
	
	public function nameIsTaken($name){
		$result = $this->findByPlayerName($name);
		return ($result === false) ? false : true;
	}
	
	public function getPlayersFromGame($gameId){
		$result = $this->findAllByPlayerGame($gameId);
		if ($result) return $result;
		else return array();
	}
	
	public function getPlayerScore($id){
		$result = $this->findByPlayerId($id, array('player_score'));
		if ($result) return (int)$result['Player']['player_score'];
		else return 0;
	}
}
?>