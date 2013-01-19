<?php
class IndexController extends AppController {
	public $uses = array('Player', 'Game');
	
	public function index(){
		if (isset($this->data)){
			$action = $this->params['form']['action'];
			$pseudo = $this->data['name'];
			$partie = $this->data['gamename'];
			
			if ($this->Player->nameIsTaken($pseudo)){
				if (!$this->Session->check('player')) {
					$this->Session->setFlash("User name allready in use", 'error');
					return;
				}
				else {
					//c'ets le meme utilisateur
					$player = $this->Session->read('player');
					$playerId = $player['id'];
					$this->Player->id = $playerId;
				}
			}
			else {
				//on crée le joueur
				$data = array('player_name'=>$pseudo);
				$this->Player->create($data);
				$this->Player->save();
				$playerId = $this->Player->id;
				//@TODO : ne mettre que l'id, on se sers pas du reste
				$this->Session->write('player', array('id'=>$playerId, 'name'=>$pseudo));
			}
			
			if (strtolower($action) === 'rejoindre') {
				if ($this->Game->nameIsTaken($partie)){
					$gameId = $this->Game->getGameId($partie);
					//on verifie qu'il reste de la place
					$players = $this->Player->getPlayersFromGame($gameId);
					if (count($players) >= 2) {
						$this->Session->setFlash("This game is allready full", 'error');
						return;	
					}
				}
				else {
					$this->Session->setFlash("No game by that name exists", 'error');
					return;
				}
			}
			else {
				//@TODO : veirifer que le nom n'est pas vide
				if ($this->Game->nameIsTaken($partie)){
					$this->Session->setFlash("Game name allready in use", 'error');
					return;
				}
				//on crée la partie
				$data = array('game_name'=>$partie);
				$this->Game->create($data);
				$this->Game->save();
				$gameId = $this->Game->id;
			}
			
			//on rattache le joueur a la partie
			$this->Player->saveField('player_game', $gameId);
			$game = $this->Game->getGame($gameId);
			$this->Session->write('game_id', $gameId);
			
			//et la on démare eventuellement la partie
			if (isset($players) && count($players) === 1){
				//yavais qu'un joueur, si on est arrivé ici il y en a 2 maintenant, donc on lance le jeu
				$this->Game->id = $gameId;
				$this->Game->saveField('game_state', ZILCH_TURN_PLAYER_1);
				$this->Game->saveField('game_bankable', -1);
				$this->Game->save();
			}
			
			//si tout c'est bien passé jusqu'ici, on s'en va rejoindre la partie
			$this->redirect('/game/index/'.$gameId);
		}
		
		if ($this->Session->check('player') && $this->Session->check('game')) {
			//déja dans une partie
			$game = $this->Session->read('game');
			$this->redirect('/game/index/'.$game['game_id']);
		}
	}
	
	public function signoff(){
		$this->Session->destroy();
		$this->redirect('/');
	}
}
?>