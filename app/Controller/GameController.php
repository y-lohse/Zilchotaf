<?php
class GameController extends AppController {
	public $uses = array('Player', 'Game');
	
	public function index($id=NULL){
		//@TODO : verifier que le game id est le bon
		if ($id === NULL || !$this->Session->check('player')) {
			$this->redirect('/');
			return;
		}
		
		/*$player = $this->Session->read('player');
		$this->Player->id = $player['id'];
		$this->Player->set('player_keepalive', time());
		$this->Player->save();*/
	}
	
	private function checkAllowed(){
		if (!$this->Session->check('game_id')) return false;
		else {
			$id = $this->Session->read('game_id');
		}
		if ($id === NULL || !$this->Session->check('player')) return false;
		else return true;
	}
	
	private function responseJSON($error, $data=array()){
		$this->set('data', $data);
		$this->set('error', $error);
		$this->layout = '';
		$this->render(null, null, VIEWS.'elements'.DS.'json.ctp');
	}
	
	private function getGameStatus($gameid){
		$status = true;
		$players = $this->Player->getPlayersFromGame($gameid);
		
		//deja, est ce qu'il y a 2 joueurs?
		if (count($players) !== 2) $status = false;
		
		//bon apres faut qu'ils soient alive
		define('MAX_KEEPALIVE', 6);
		$now = time();
		
		foreach ($players as $player){
			if ($now-(int)$player['Player']['player_keepalive'] > MAX_KEEPALIVE){
				$status = false;
				break;
			}
		}
		
		return $status;
	}
	
	public function status(){
		if (!$this->checkAllowed()){
			$this->responseJSON(true);
			return;
		}
		
		//on remet a jout le timestamp, ca résoud un bug pour le 2eme qui rejoins, j'ai pas trop compris pourquoi
		$player = $this->Session->read('player');
		$this->Player->id = $player['id'];
		$this->Player->set('player_keepalive', time());
		$this->Player->save();
		
		$gameId = $this->Session->read('game_id');
		$status = $this->getGameStatus($gameId);
		
		$data = array('status'=>$status);
		$this->responseJSON(false, $data);
	}
	
	public function keepalive(){
		if (!$this->checkAllowed()){
			$this->responseJSON(true);
			return;
		}
		
		//déja on se met a jour
		$player = $this->Session->read('player');
		$this->Player->id = $player['id'];
		$this->Player->set('player_keepalive', time());
		$this->Player->save();
		
		$gameId = $this->Session->read('game_id');
		$status = $this->getGameStatus($gameId);
		
		$data = array('status'=>$status);
		$this->responseJSON(false, $data);
	}
	
	public function gamestate(){
		if (!$this->checkAllowed()){
			$this->responseJSON(true);
			return;
		}
		
		$gameId = $this->Session->read('game_id');
		$game = $this->Game->getGame($gameId);
		$players = $this->Player->getPlayersFromGame($gameId);
		
		$myturn = $this->isPlayersTurn($players, $game);
		$state = ($game['game_state'] == ZILCH_TURN_PLAYER_1) ? 1 : 2;
		
		$data = array();
		$data['state'] = $state;
		$data['myturn'] = $myturn;
		$data['bankable'] = $game['game_bankable'];
		
		$joueurs = array();
		foreach ($players as $player){
			$joueur = array('name'=>$player['Player']['player_name'],
					'score'=>$player['Player']['player_score'],);
			array_push($joueurs, $joueur);
		}
		$data['players'] = $joueurs;
		
		$dices = array();
		for ($i = 1; $i < 7; $i++){
			$dice = array('value'=>(int)$game['game_dice'.$i],
				      'lock'=>(bool)$game['game_dice'.$i.'_lock']);
			array_push($dices, $dice);
		}
		$data['dices'] = $dices;
		
		$this->responseJSON(false, $data);
	}
	
	private function isPlayersTurn($players, $game){
		$playerOrder = 0;
		$player = $this->Session->read('player');
		if ($players[0]['Player']['player_id'] == $player['id']) $playerOrder = 1;
		else $playerOrder = 2;
		
		$state = (($game['game_state'] == ZILCH_TURN_PLAYER_1 && $playerOrder === 1) || ($game['game_state'] == ZILCH_TURN_PLAYER_2 && $playerOrder === 2)) ? true : false;
		
		return $state;
	}
	
	private function createZilch($game){
		$dices = array();
		for ($i = 1; $i < 7; $i++){
			$dice = new Dice($game['game_dice'.$i], $game['game_dice'.$i.'_lock']);
			array_push($dices, $dice);
		}
		
		return new Zilch($dices);
	}
	
	public function roll(){
		if (!$this->checkAllowed()){
			$this->responseJSON(true);
			return;
		}
		
		$dices = isset($_GET['dices']) ? $_GET['dices'] : array();
		
		//on regarde si le joueurs est autorisé a faire cette action
		$player = $this->Session->read('player');
		$gameId = $this->Session->read('game_id');
		
		$game = $this->Game->getGame($gameId);
		$players = $this->Player->getPlayersFromGame($gameId);
		
		$myturn = $this->isPlayersTurn($players, $game);
		
		if ($myturn){
			App::import('Vendor', 'zilch');
			App::import('Vendor', 'dice');
			$zilch = $this->createZilch($game);
			$freeroll = false;
			
			if ($game['game_bankable'] == -1 && count($dices) != 6){
				//premier roll, mais le mec essaye déja de faire des locks, va crever
				$this->responseJSON(true);
				return;
			}
			else if ((6-count($dices))+$zilch->countLocked() === 6){
				//en additionant les dès déja utilisés et les dès lockés ce tour ci, tous sont utisés -> freeroll si c'est confirmé
				$freeroll = true;
			}
			
			//il va falloir mettre a jour les dès
			$this->Game->id = $gameId;
			$modified = array();
			$values = array();
			
			foreach ($dices as $dice){
				array_push($modified, $dice);
				$value = $zilch->rollDice($dice);
				array_push($values, $value);
				$this->Game->set('game_dice'.$dice, $value);
			}
			
			//on lock les dès restants
			$diff = array_diff(array(1,2,3,4,5,6), $modified);
			
			//bon la on a fini les rolls, et $zilch a des valeurs de dès a jour, mais les locks ne sont pas encore a jour
			//c'est le moment de regarder si tous les dès lockés sont valide
			if (!$zilch->everythingResolves($diff)){
				$this->responseJSON(true);
				return;
			}
			
			//on calcule la valeur bankable
			$bankable = $zilch->getBankable($diff);
			
			//il faut que les des que le joueur essaye de banker aient une valeur, sauf au premier tour
			if ($bankable === 0 && $game['game_bankable'] != -1){
				$this->responseJSON(true);
				return;
			}
			
			//on procede aux locks
			$newlock = false;
			foreach ($diff as $lock){
				if (!$zilch->getDiceLock($lock)) $newlock = true;//compara a l'état précédent
				
				$zilch->lockDice($lock);
				$this->Game->set('game_dice'.$lock.'_lock', 1);
			}
			
			//aucun dès n'a été locké, on envoi chier
			if (!$newlock && $game['game_bankable'] != -1){
				$this->responseJSON(true);
				return;
			}
			
			//la, on a fini la plupart des mises a jour
			//les dès sont lockés, la somme bankable est calculée, on a déja envoyé chié pour la plupart des cas
			
			//ce qu'il reste a faire, c'est déterminer si le tour est terminé ou non, sachant que le joueur viens de demander un roll
			if ($freeroll && $zilch->countLocked() === 6){
				//echo 'okkkkkkkk';
				//freeroll réussi
				//on dévérouille tous les dès et on les rerolls
				for ($i = 1; $i < 7; $i++){
					$zilch->unlockDice($i);
					$this->Game->set('game_dice'.$i.'_lock', 0);
					$value = $zilch->rollDice($i);
					$this->Game->set('game_dice'.$i, $value);
				}
			}
			
			//la, on a mis a jour la banque possible pour le joueur
			//la derniere chose a faire, c'est voir si le tour est terminé ou non
			//globalement c'est pas compliqué, on considere les des ouverts, si une combinaison est possible, on laisse jouer
			if (!$freeroll && !$zilch->resolvable()){
				if ($game['game_lastround']) $this->endGame();
				else $this->endTurn($game['game_state']);
				return;
			}
			
			//tout ets ok, on sauvegarde
			if ($game['game_bankable'] == -1) $game['game_bankable'] = 0;
			$this->Game->set('game_bankable', $game['game_bankable']+$bankable);
			
			$this->Game->save();
			$this->responseJSON(false, array('values'=>$values));
		}
		else {
			
			$this->responseJSON(true);
		}
	}
	
	public function bank(){
		if (!$this->checkAllowed()){
			$this->responseJSON(true);
			return;
		}
		
		//on regarde si le joueurs est autorisé a faire cette action
		$player = $this->Session->read('player');
		$gameId = $this->Session->read('game_id');
		
		$game = $this->Game->getGame($gameId);
		$players = $this->Player->getPlayersFromGame($gameId);
		
		$myturn = $this->isPlayersTurn($players, $game);
		$dices = isset($_GET['dices']) ? $_GET['dices'] : array();
		
		//il faut que ce soit a nous de jouer et qu'on ai fais au moins un roll
		if ($myturn && $game['game_bankable'] != -1){
			App::import('Vendor', 'zilch');
			App::import('Vendor', 'dice');
			$zilch = $this->createZilch($game);
			
			$dices = array_diff(array(1,2,3,4,5,6), $dices);
			$selected = array();
			
			foreach ($dices as $index){
				if (!$zilch->getDiceLock($index)) array_push($selected, $index);
			}
			
			$bankable = $zilch->getBankable($selected);
			$bankable += $game['game_bankable'];
			
			if ($bankable < ZILCH_MIN_BANK){
				$this->responseJSON(true);
				return;
			}
			
			$this->Player->id = $player['id'];
			$this->Player->set('player_score', $bankable+$this->Player->getPlayerScore($player['id']));
			$this->Player->save();
			$this->responseJSON(false);
			
			foreach ($players as $player){
				if ((int)$player['Player']['player_score']+$bankable >= ZILCH_WIN) {
					//on en a au moins un au dessus de 10000, processus de fin de jeu
					if ($game['game_lastround'] == 1){
						$this->endGame();
						return;
					}
					else {
						//il viens de l'atteindre, encore un tour
						$this->Game->id = $gameId;
						$this->Game->set('game_lastround', 1);
					}
				}
			}
			
			$this->endTurn($game['game_state']);
		}
		else {
			$this->responseJSON(true);
		}
	}
	
	private function endTurn($state){
		$gameId = $this->Session->read('game_id');
		$this->Game->id = $gameId;
		
		$turn = ($state == ZILCH_TURN_PLAYER_1) ? ZILCH_TURN_PLAYER_2 : ZILCH_TURN_PLAYER_1;
		
		$data = array('game_state'=>$turn,
			      'game_bankable'=>-1,
			      'game_dice1_lock'=>0,
			      'game_dice2_lock'=>0,
			      'game_dice3_lock'=>0,
			      'game_dice4_lock'=>0,
			      'game_dice5_lock'=>0,
			      'game_dice6_lock'=>0);
		$this->Game->set($data);
		$this->Game->save();
	}
	
	private function endGame(){
		$gameId = $this->Session->read('game_id');
		$this->Game->id = $gameId;
		
		//@TODO : fin de match, remise a 0 des scores, ec
		$this->Game->set('game_state', ZILCH_TURN_ENDED);
		$this->Game->save();
		$this->responseJSON(true);
	}
}
?>