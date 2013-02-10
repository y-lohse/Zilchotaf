Zilchotaf.GameController = {
	bankable: null,
	__gameState: 0,
	players: [],
	init: function(){
		this.players.push(new Zilchotaf.Player());
		this.players.push(new Zilchotaf.Player());
	},
    getGameState: function(){
        return this.__gameState;
    },
    requestUpdate: function(){
    	Zilchotaf.GameState.getGameState();
    },
    update: function(data){
    	this.setGameState(data.state, data.myturn);
    	this.bankable = parseInt((data.bankable == -1) ? 0 : data.bankable);
    	
    	this.players[0].name = data.players[0].name;
    	this.players[0].score = data.players[0].score || 0;
    	for (var index in data.players[0].lastScore){
    		this.players[0].pushHistory(index, data.players[0].lastScore[index]);
    	}
    	
    	this.players[1].name = data.players[1].name;
    	this.players[1].score = data.players[1].score || 0;
    	for (var index in data.players[1].lastScore){
    		this.players[1].pushHistory(index, data.players[1].lastScore[index]);
    	}
    	
    	Zilchotaf.PlayerOutput.update(0, this.players[0]);
    	Zilchotaf.PlayerOutput.update(1, this.players[1]);
    	
    	var values = [];
    	for (var i = 0; i < data.dices.length; i++){
    		if (!data.dices[i].lock) values.push(data.dices[i].value);
    	}
    	var combinaisons = Zilchotaf.Zilch.getAllCombinations(values);
    	
    	Zilchotaf.GameOutput.update(this.bankable, (data.bankable > -1), data.dices, combinaisons);
    },
    setGameState: function(state, myturn){
        if (state != this.__gameState){
            this.__gameState = state;
            
            if (state != 3){
            	Zilchotaf.PlayerOutput.turnChange(state);
            	Zilchotaf.GameOutput.turnChange();
                Zilchotaf.Input.propositions.hide();
            }
            else{
            	$('#game').hide();
            	$('#end').show();
            }
        }
    }
};

Zilchotaf.GameState = {
	FETCH_RYTHM: 500,
	getGameState: function(){
		Zilchotaf.retrieve('gamestate', function(ok, data){
			if (ok){
				Zilchotaf.GameController.update(data);
				if (!data.myturn) setTimeout(Zilchotaf.GameState.getGameState, Zilchotaf.GameState.FETCH_RYTHM);
			}
		});
	},
};

Zilchotaf.Player = function(){
	this.name = '';
	this.score = 0;
	this.history = [];
	this.latestHistoryId = 0;
	
	this.pushHistory = function(id, score){
		if (id != this.latestHistoryId){
			this.history.push((score === 0) ? 'zilch' : score);
			this.latestHistoryId = id;
		}
	}
};