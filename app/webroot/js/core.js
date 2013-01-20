var Zilchotaf = {
    bankable: null,
    actions: {  'keepalive': '/game/keepalive',
                'gamestate': '/game/gamestate',
                'roll': '/game/roll',
                'bank': '/game/bank'},
    retrieve: function(action, callback){
        if (this.actions[action]){
            $.getJSON(this.actions[action]+'.json')
            .success(function(response){
                callback(true, response);
            }).error(function(){
                callback(false);
            });
        }
        else {
            //appel non défini, ca devrait pas ariver mais bon
            callback(false);
        }
    },
    tryAction: function(action, data, callback){
        if (this.actions[action]){
            $.getJSON(this.actions[action]+'.json', data)
            .success(function(response){
                callback(true, response);
            }).error(function(){
                callback(false);
            });
        }
        else {
            //appel non défini, ca devrait pas ariver mais bon
            callback(false);
        }
    },
    __gameStatus: false,
    getGameStatus: function(){
        return this.__gameStatus;
    },
    setGameStatus: function(status){
        if (status != this.__gameStatus) {
            this.__gameStatus = status;
            if (status){
              $('#waiting').hide();
              $('#game').show();
            }
            else {
              $('#waiting').show();
              $('#game').hide();
            }
        }
    },
    __gameState: 0,
    getGameState: function(){
        return this.__gameState;
    },
    setGameState: function(state, myturn){
        if (state != this.__gameState){
            this.__gameState = state;
            
            if (state != 3){
            	Zilchotaf.OutputManager.turnChange(state);
                Zilchotaf.InputManager.propositions.hide();
            }
            else{
            	$('#game').hide();
            	$('#end').show();
            }
        }
    }
};

$(function(){
    Zilchotaf.KeepAlive.getStatus();
    //Zilchotaf.GameManager.getGameState();
    Zilchotaf.InputManager.init();
    Zilchotaf.OutputManager.init();
});