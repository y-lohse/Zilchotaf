//namespace général, gere tout ce qui est l'initalisation et la périphérie de jeu
var Zilchotaf = {
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
};

//garde le contact avec le serveur et vérifie que tout le monde en fais autant
Zilchotaf.KeepAlive = {
    KEEPALIVE_RYTHM: 8000,
    //getStatus tourne pendant que le jeu n'est pas en cours
    getStatus: function(){
        Zilchotaf.retrieve('keepalive', function(ok, status){
            if (ok){
                if (status.status === true){
                    Zilchotaf.setGameStatus(true);
                    Zilchotaf.KeepAlive.keepAlive();
                    Zilchotaf.GameState.getGameState();
                }
                else Zilchotaf.KeepAlive.getStatus();
            }
            else {
                //erreur de keepalive, pas grand chose a faire...
                Zilchotaf.KeepAlive.getStatus();
            }
        });
    },
    //appelé régulierement pour notifier le serveur que l'on est encore la
    keepAlive: function(){
        Zilchotaf.retrieve('keepalive', function(ok, status){
            if (ok) {
                //la maj a bien eu lieu, peut etre que le statut a changé
                if (status.status != Zilchotaf.getGameStatus()){
                    Zilchotaf.setGameStatus(status.status);
                }
            }
            //on relance le bouzin
            setTimeout(Zilchotaf.KeepAlive.keepAlive, Zilchotaf.KeepAlive.KEEPALIVE_RYTHM);
        });
    }
};

$(function(){
    Zilchotaf.KeepAlive.getStatus();
    Zilchotaf.GameController.init();
    Zilchotaf.Input.init();
    Zilchotaf.GameOutput.init();
    Zilchotaf.PlayerOutput.init();
});