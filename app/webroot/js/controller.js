Zilchotaf.GameController = {
	bankable: null,
	__gameState: 0,
    getGameState: function(){
        return this.__gameState;
    },
    requestUpdate: function(){
    	Zilchotaf.GameState.getGameState();
    },
    update: function(data){
    	this.setGameState(data.state, data.myturn);
    	this.bankable = parseInt((data.bankable == -1) ? 0 : data.bankable);
    	
    	var player1 = {	score: data.players[0].score || 0, 
    					name: data.players[0].name};
    	var player2 = {	score: data.players[1].score || 0, 
    					name: data.players[1].name};
    	
    	Zilchotaf.Output.update(this.bankable, player1, player2, data.dices, (data.bankable > -1));
    },
    setGameState: function(state, myturn){
        if (state != this.__gameState){
            this.__gameState = state;
            
            if (state != 3){
            	Zilchotaf.Output.turnChange(state);
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