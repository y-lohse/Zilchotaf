Zilchotaf.View = {
	lockClass: 'lock',
	usedClass: 'used'
};

//gere l'affichage d'informations de jeu
Zilchotaf.PlayerOutput = {
	joueurs: null,
	scores: [],
	histories: [],
    init: function(){
    	this.joueurs = $('#joueurs > div');
    	this.scores.push($('#score1'));
    	this.scores.push($('#score2'));
    	this.histories.push($('#joueurs > div:first ul'));
    	this.histories.push($('#joueurs > div:last ul'));
    },
    update: function(index, info){
    	this.scores[index].html(info.score);
        
        this.joueurs.eq(index).find('h2').html(info.name);
        
        this.histories[index].empty();
        for (var i = 0; i < Math.min(3, info.history.length); i++){
        	var li = $('<li>').html(info.history[info.history.length-1-i]);
        	if (info.history[info.history.length-1-i] === 'zilch') li.addClass('score_zilch');
        	this.histories[index].append(li);
        }
    },
    turnChange: function(turn){
        this.joueurs.removeClass('atontour');
        (turn === 1) ? this.joueurs.first().addClass('atontour') : this.joueurs.last().addClass('atontour');
    },
};

Zilchotaf.GameOutput = {
    bankable: null,
    dices: null,
    possibilites: null,
    rollButton: null,
    bankButton: null,
    cssClasses: 'un deux trois quatre cinq six',
    init: function(){
        this.bankable = $('#bankable');
        this.dices = $('#des li');
        this.possibilites = $('#possibilites li');
        this.rollButton = $('#roll');
        this.bankButton = $('#bank');
    },
    update: function(bankable, bankingAllowed, dices, combinaisons){
        this.bankable.html(bankable);        
        
        this.dices.removeClass(Zilchotaf.View.usedClass+' '+Zilchotaf.View.lockClass);
        for (var i = 0, l = dices.length; i < l; i++){
            var diceClass = this.cssClasses.split(' ')[dices[i].value-1];
            $(this.dices[i]).removeClass(this.cssClasses).html(dices[i].value).addClass(diceClass);
            if (dices[i].lock) $(this.dices[i]).addClass(Zilchotaf.View.usedClass);
        }
        
        this.possibilites.removeClass(Zilchotaf.View.lockClass);
        
        this.possibilites.removeClass(Zilchotaf.View.lockClass);
        for (var i = 0, l = combinaisons.length; i < l; i++){
            $(this.possibilites[i]).data('lock', combinaisons[i].lock).find('p:first').html(combinaisons[i].name).end().find('p:last').html(combinaisons[i].score);
        }
        
        $('#freeroll').hide();
        
        if (bankingAllowed) this.possibilites.show().slice(combinaisons.length).hide();
    },
    turnChange: function(){
        this.dices.removeClass(Zilchotaf.View.usedClass+' '+Zilchotaf.View.lockClass);
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
        $('#des li.'+Zilchotaf.View.lockClass).each(function(){
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
            
            if ($('#des').find('li.'+Zilchotaf.View.usedClass).length+values.length === 6) $('#freeroll').show();
        }
    },
};

//gere les commandes envoyées par le joueur
Zilchotaf.Input = {
    propositions: null,
    dices: null,
    init: function(){
        this.propositions = $('#possibilites li');
        this.dices = $('#des li');
        
        $('#roll').click(this.roll);
        $('#bank').click(this.bank);
        this.dices.click(this.toggleDiceLock);
        this.propositions.click(this.proposition);
    },
    getLockedDices: function(){
        var dices = [];
        this.dices.each(function(index){
            if (!$(this).hasClass(Zilchotaf.View.lockClass) && !$(this).hasClass(Zilchotaf.View.usedClass)) dices.push(++index);
        });
         
        return dices;
    },
    roll: function(){
        var dices = Zilchotaf.Input.getLockedDices();
        
        Zilchotaf.tryAction('roll', {dices: dices}, function(ok, response){
            //s'il y a une erreur, il n'y a pas grand chose à faire... donc dans tous les 
            //cas on recharge la partie
            Zilchotaf.GameController.requestUpdate();
        });
    },
    bank: function(){
        var dices = Zilchotaf.Input.getLockedDices();
        
        Zilchotaf.tryAction('bank', {dices: dices}, function(ok, response){
            if (ok && response.error){
                //pas possible de banker
                alert('unbankable');
            }
            else Zilchotaf.GameController.requestUpdate();
        });
    },
    toggleDiceLock: function(){
        if ($(this).hasClass(Zilchotaf.View.usedClass)) return;
        else {
        	$(this).toggleClass(Zilchotaf.View.lockClass);
        	Zilchotaf.Output.updatePreviews();
        }
    },
    proposition: function(){
    	$(this).toggleClass(Zilchotaf.View.lockClass);
        var tofind = $(this).data('lock'),
            dices = Zilchotaf.Input.dices;
        if (tofind != '*') dices = dices.filter(':contains("'+tofind+'")');
        dices.each(function(){
            ($.proxy(Zilchotaf.Input.toggleDiceLock, this))();
        });
    }
};