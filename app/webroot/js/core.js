var APP_PREFIX = '';

var Zilchotaf = {
    bankable: null,
    actions: {  'keepalive': APP_PREFIX+'/game/keepalive',
                'gamestate': APP_PREFIX+'/game/gamestate',
                'roll': APP_PREFIX+'/game/roll',
                'bank': APP_PREFIX+'/game/bank'},
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
            $.getJSON(this.actions[action], data)
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
            Zilchotaf.OutputManager.turnChange(state);
            if (myturn) Zilchotaf.InputManager.propositions.hide();
        }
    }
};

$(function(){
    Zilchotaf.KeepAlive.getStatus();
    //Zilchotaf.GameManager.getGameState();
    Zilchotaf.InputManager.init();
    Zilchotaf.OutputManager.init();
});