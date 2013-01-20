<?php

class Game extends AppModel {
	public $useTable = 'game';
	public $primaryKey = 'game_id';
	
	public function nameIsTaken($name){
		$result = $this->findByGameName($name);
		return (count($result) === 0) ? false : true;
	}
	
	public function getGameId($name){
		$result = $this->findByGameName($name, array('game_id'));
		if ($result) return $result['Game']['game_id'];
		else return 0;
	}
	
	public function getGame($id){
		$result = $this->findByGameId($id);
		return $result['Game'];
	}
}
?>