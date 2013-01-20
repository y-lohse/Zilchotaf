Zilchotaf.View= {};

//gere l'affichage d'informations de jeu au joueur
Zilchotaf.Output = {
    bankable: null,
    p1score: null,
    p2score: null,
    dices: null,
    possibilites: null,
    rollButton: null,
    bankButton: null,
    cssClasses: 'un deux trois quatre cinq six'.split(' '),
    init: function(){
        this.bankable = $('#bankable');
        this.p1score = $('#score1');
        this.p2score = $('#score2');
        this.joueurs = $('#joueurs > div');
        this.dices = $('#des li');
        this.possibilites = $('#possibilites li');
        this.rollButton = $('#roll');
        this.bankButton = $('#bank');
    },
    update: function(data){
        this.bankable.html(Zilchotaf.bankable || 0);
                
        if (this.p1score.html() != data.players[0].score) this.p1score.html(data.players[0].score || 0);
        if (this.p2score.html() != data.players[1].score) this.p2score.html(data.players[1].score || 0);
        this.joueurs.first().find('h2').html(data.players[0].name);
        this.joueurs.last().find('h2').html(data.players[1].name);
        
        var newdices = data.dices;
        for (var i = 0, l = newdices.length; i < l; i++){
            var valeur = this.cssClasses[newdices[i].value-1];
            $(this.dices[i]).removeClass('un deux trois quatre cinq six').html(newdices[i].value).addClass(valeur);
            if (newdices[i].lock) $(this.dices[i]).addClass('used').removeClass('lock');
        }
        
        var values = [];
        this.dices.not('.used').each(function(){
            values.push(this.innerHTML);
        });
        var combinations = Zilchotaf.Zilch.getAllCombinations(values);
        for (var i = 0, l = combinations.length; i < l; i++){
            $(this.possibilites[i]).data('lock', combinations[i].lock).find('p:first').html(combinations[i].name).end().find('p:last').html(combinations[i].score);
        }
        
        if (data.bankable > -1) this.possibilites.show().slice(combinations.length).hide();
    },
    turnChange: function(turn){
        this.joueurs.removeClass('atontour');
        (turn === 1) ? this.joueurs.first().addClass('atontour') : this.joueurs.last().addClass('atontour');
        this.dices.removeClass('used lock');
        this.disableBank(true);
    },
    bankablePreview: function(preview){
        var total = Zilchotaf.GameController.bankable+preview;
        this.bankable.html(total);
        if (total >= 300) this.disableBank(false);
    },
    disableBank: function(disable){
        if (disable) this.bankButton.attr('disabled', 'disabled');
        else this.bankButton.removeAttr('disabled');
    },
    disableRoll: function(disable){
        if (disable) this.rollButton.attr('disabled', 'disabled');
        else this.rollButton.removeAttr('disabled');
    },
    updatePreviews: function(){
        $('#freeroll').hide();
        
        var values = [];
        $('#des li.lock').each(function(){
            values.push(parseInt(this.innerHTML));
        });
        
        var bankable = Zilchotaf.Zilch.resolveCombination(values),
            resolvable = Zilchotaf.Zilch.eveythingResolves(values);
        this.bankablePreview(bankable);
        
        if (!resolvable){
            this.disableRoll(true);
            this.disableBank(true);
        }
        else {
            this.disableRoll(false);
            this.disableBank(false);
            
            if ($('#des').find('li.used').length+values.length === 6) $('#freeroll').show();
        }
    },
};

//gere les commandes envoyées par le joueur
Zilchotaf.Input = {
    rollButton: null,
    bankButton: null,
    propositions: null,
    dices: null,
    init: function(){
        this.rollButton = $('#roll');
        this.bankButton = $('#bank');
        this.propositions = $('#possibilites li');
        this.dices = $('#des li');
        
        this.rollButton.click(this.roll);
        this.bankButton.click(this.bank);
        this.dices.click(this.toggleDiceLock);
        this.propositions.click(this.proposition);
    },
    getLockedDices: function(){
        var dices = [],
            index = 1;
        this.dices.each(function(){
            if (!$(this).hasClass('lock') && !$(this).hasClass('used')) dices.push(index);
            index++;
        });
         
        return dices;
    },
    roll: function(){
        var dices = Zilchotaf.Input.getLockedDices();
        
        Zilchotaf.tryAction('roll', {dices: dices}, function(ok, response){
            if (ok && response.error){
                alert('action interdite');
            }
            else {
                $('#des li').removeClass('lock used');
                $('#possibilites li').removeClass('lock');
                $('#freeroll').hide();
                Zilchotaf.GameState.getGameState();
            }
        });
    },
    bank: function(){
        var dices = Zilchotaf.Input.getLockedDices();
        
        Zilchotaf.tryAction('bank', {dices: dices}, function(ok, response){
            if (ok && response.error){
                //pas possible de banker
                alert('unbankable');
            }
            else Zilchotaf.GameState.getGameState();
        });
    },
    toggleDiceLock: function(){
        if ($(this).hasClass('used')) return;
        else {
        	$(this).toggleClass('lock');
        	Zilchotaf.Output.updatePreviews();
        }
    },
    proposition: function(){
    	$(this).toggleClass('lock');
        var tofind = $(this).data('lock'),
            dices = Zilchotaf.Input.dices;
        if (tofind != '*') dices = dices.filter(':contains("'+tofind+'")');
        dices.each(function(){
            $.proxy(Zilchotaf.Input.toggleDiceLock, this)();
        });
    }
};