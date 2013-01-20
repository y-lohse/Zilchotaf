//garde le contact avec le serveur et vérifie que tout le monde en fais autant
Zilchotaf.KeepAlive = {
    KEEPALIVE_RYTHM: 8000,
    getStatus: function(){
        Zilchotaf.retrieve('keepalive', function(ok, status){
            if (ok){
                if (status.status === true){
                    Zilchotaf.setGameStatus(true);
                    Zilchotaf.KeepAlive.keepAlive();
                    Zilchotaf.GameManager.getGameState();
                }
                else Zilchotaf.KeepAlive.getStatus();
            }
            else {
                //erreur de keepalive, pas grand chose a faire...
                Zilchotaf.KeepAlive.getStatus();
            }
        });
    },
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