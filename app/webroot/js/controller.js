Zilchotaf.GameController = {
	bankable: null,
	__gameState: 0,
    getGameState: function(){
        return this.__gameState;
    },
    requestUpdate: function(){
    	Zilchotaf.GameState.getGameState();
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
				Zilchotaf.GameController.setGameState(data.state, data.myturn);
				Zilchotaf.GameController.bankable = parseInt((data.bankable == -1) ? 0 : parseInt(data.bankable));
				Zilchotaf.Output.update(data);
				if (!data.myturn) setTimeout(Zilchotaf.GameState.getGameState, Zilchotaf.GameState.FETCH_RYTHM);
			}
		});
	},
};