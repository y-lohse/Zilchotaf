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
	
	public function getLatestScore($game, $player){
		$fields = array('history_id', 'history_score');
		
		$conditions = array();
		$conditions['game_id'] = $game;
		$conditions['player_id'] = $player;
		
		$order= array('history_id DESC');
		
		$result = $this->find('first', array('fields'=>$fields,
											  'conditions'=>$conditions,
											  'order'=>$order));
		return (count($result) > 0) ? array((int)$result['History']['history_id']=>(int)$result['History']['history_score']) : array();
	}
}
?>