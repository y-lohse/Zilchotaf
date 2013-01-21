//mechansime de jeux du zilch
Zilchotaf.Zilch = {
    figures: {
        one: {  'name': 'one',
                'value': 100},
        five: { 'name': 'five',
                'value': 50},
        tripple_one: {  'name': 'ones',
                        'value': 1000},
        tripple_two: {  'name': 'twos',
                        'value': 200},
        tripple_three: {'name': 'threes',
                        'value': 300},
        tripple_four: { 'name': 'fours',
                        'value': 400},
        tripple_five: { 'name': 'fives',
                        'value': 500},
        tripple_six: {  'name': 'sixes',
                        'value': 600},
        run: {  'name': 'run',
                'value': 1500},
        threepairs: {   'name': 'three pairs',
                        'value': 1500},
        nothing: {  'name': 'nothing',
                    'value': 500}
    },
    numbers: ['Zero',
              'Single',
              'Two',
              'Three',
              'Four',
              'Five',
              'Six'],
    resolveCombination: function(values){
        var score = 0,
            ones = this.countOccurences(1, values),
            twos = this.countOccurences(2, values),
            threes = this.countOccurences(3, values),
            fours = this.countOccurences(4, values),
            fives = this.countOccurences(5, values),
            sixes = this.countOccurences(6, values);
            
        if (values.length === 6){
            if (ones === 1 &&
                twos === 1 &&
                threes === 1 &&
                fours === 1 &&
                fives === 1 &&
                sixes === 1){
                return this.figures.run.value;
            }
            
            var pairs = 0;
            pairs += Math.floor(ones/2);
            pairs += Math.floor(twos/2);
            pairs += Math.floor(threes/2);
            pairs += Math.floor(fours/2);
            pairs += Math.floor(fives/2);
            pairs += Math.floor(sixes/2);
            
            if (pairs >= 3){
                return this.figures.threepairs.value;
            }
        }
        
        if (ones > 0){
            if (ones >= 3){
                var rest = this.reduceArray(values, 1, ones);
                var score = Math.max(score, this.computeBigScore(this.figures.tripple_one.value, ones)+this.resolveCombination(rest));
                return score;
            }
            else {
                var rest = this.reduceArray(values, 1, 1),
                    add = this.figures.one.value+this.resolveCombination(rest);
                    return Math.max(score, add);
            }
        }
        
        if (fives > 0){
            if (fives >= 3){
                var rest = this.reduceArray(values, 5, fives);
                var score = Math.max(score, this.computeBigScore(this.figures.tripple_five.value, fives)+this.resolveCombination(rest));
                return score;
            }
            else {
                var rest = this.reduceArray(values, 5, 1),
                    add = this.figures.five.value+this.resolveCombination(rest);
                    return Math.max(score, add);
            }
        }
        
        if (twos >= 3){
            var rest = this.reduceArray(values, 2, twos),
                score = Math.max(score, this.computeBigScore(this.figures.tripple_two.value, twos)+this.resolveCombination(rest));
            return score;
        }
        if (threes >= 3){
            var rest = this.reduceArray(values, 3, threes),
                score = Math.max(score, this.computeBigScore(this.figures.tripple_three.value, threes)+this.resolveCombination(rest));
            return score;
        }
        if (fours >= 3){
            var rest = this.reduceArray(values, 4, fours),
                score = Math.max(score, this.computeBigScore(this.figures.tripple_four.value, fours)+this.resolveCombination(rest));
            return score;
        }
        if (sixes >= 3){
            var rest = this.reduceArray(values, 6, sixes),
                score = Math.max(score, this.computeBigScore(this.figures.tripple_six.value, sixes)+this.resolveCombination(rest));
            return score;
        }
        
        if (score == 0 && values.length === 6) return this.figures.nothing.value;
        
        return score;
    },
    eveythingResolves: function(values){
        var ones = this.countOccurences(1, values),
            twos = this.countOccurences(2, values),
            threes = this.countOccurences(3, values),
            fours = this.countOccurences(4, values),
            fives = this.countOccurences(5, values),
            sixes = this.countOccurences(6, values);
            
        if (values.length === 6){
            if (ones === 1 &&
                twos === 1 &&
                threes === 1 &&
                fours === 1 &&
                fives === 1 &&
                sixes === 1){
                return true;
            }
            
            var pairs = 0;
                pairs += Math.floor(ones/2);
                pairs += Math.floor(twos/2);
                pairs += Math.floor(threes/2);
                pairs += Math.floor(fours/2);
                pairs += Math.floor(fives/2);
                pairs += Math.floor(sixes/2);
            if (pairs >= 3){
                return true;
            }
        }
        
        if (ones > 0) values = this.reduceArray(values, 1, ones);
        if (twos > 2) values = this.reduceArray(values, 2, twos);
        if (threes > 2) values = this.reduceArray(values, 3, threes);
        if (fours > 2) values = this.reduceArray(values, 4, fours);
        if (fives > 0) values = this.reduceArray(values, 5, fives);
        if (sixes > 2) values = this.reduceArray(values, 6, sixes);
        
        if (values.length === 0 || values.length === 6) return true;
        else return false;
    },
    getAllCombinations: function(values){
        //on essaye toutes les combinaisons possibles
        var results = [];
        var ones = this.countOccurences(1, values),
            twos = this.countOccurences(2, values),
            threes = this.countOccurences(3, values),
            fours = this.countOccurences(4, values),
            fives = this.countOccurences(5, values),
            sixes = this.countOccurences(6, values);
        
        if (values.length === 6){
            if (ones === 1 &&
                twos === 1 &&
                threes === 1 &&
                fours === 1 &&
                fives === 1 &&
                sixes === 1){
                results.push({'score': this.figures.run.value,
                              'name': this.figures.run.name,
                              'lock': '*'});
            }
            
            var pairs = 0;
                pairs += Math.floor(ones/2);
                pairs += Math.floor(twos/2);
                pairs += Math.floor(threes/2);
                pairs += Math.floor(fours/2);
                pairs += Math.floor(fives/2);
                pairs += Math.floor(sixes/2);
            if (pairs >= 3){
                results.push({'score': this.figures.threepairs.value,
                              'name': this.figures.threepairs.name,
                              'lock': '*'});
            }
        }
        
        if (ones > 0){
            if (ones >= 3) results.push({'score': this.computeBigScore(this.figures.tripple_one.value, ones),
                                        'name': this.numbers[ones]+' '+this.figures.tripple_one.name,
                                        'lock': 1});
            else results.push({'score': this.figures.one.value*ones,
                               'name': this.numbers[ones]+' '+((ones === 1) ? this.figures.one.name : this.figures.tripple_one.name),
                               'lock': '1'});
        }
        if (fives > 0){
            if (fives >= 3) results.push({'score': this.computeBigScore(this.figures.tripple_five.value, fives),
                                         'name': this.numbers[fives]+' '+this.figures.tripple_five.name,
                                         'lock': 5});
            else results.push({'score': this.figures.five.value*fives,
                              'name': this.numbers[fives]+' '+((fives === 1) ? this.figures.five.name : this.figures.tripple_five.name),
                              'lock': 5});
        }
        
        if (twos > 2){
            results.push({'score': this.computeBigScore(this.figures.tripple_two.value, twos),
                         'name': this.numbers[twos]+' '+this.figures.tripple_two.name,
                         'lock': 2});
        }
        if (threes > 2){
            results.push({'score': this.computeBigScore(this.figures.tripple_three.value, threes),
                         'name': this.numbers[threes]+' '+this.figures.tripple_three.name,
                         'lock': 3});
        }
        if (fours > 2){
            results.push({'score': this.computeBigScore(this.figures.tripple_four.value, fours),
                          'name': this.numbers[fours]+' '+this.figures.tripple_four.name,
                          'lock': '4'});
        }
        if (sixes > 2){
            results.push({'score': this.computeBigScore(this.figures.tripple_six.value, sixes),
                         'name': this.numbers[sixes]+' '+this.figures.tripple_six.name,
                         'lock': 6});
        }
        
        if (values.length === 6 && results.length === 0){
            results.push({'score': this.figures.nothing.value,
                         'name': this.figures.nothing.name,
                         'lock': '*'});
        }
        
        //on a besoin que des 3 meilleures
        var maxes = [];
        for (var i = 0, l = results.length-1; i < l; i++){
            if (results[i].score < results[i+1].score) {
                var tmp = results[i];
                results[i] = results[i+1];
                results[i+1] = tmp;
                i = -1;
            }
        }
        
        return results.slice(0, 3);
    },
    countOccurences: function(value, dices){
        var count = 0;
        for (var i = 0; i < dices.length; i++){
            if (dices[i] == value) count++;
        }
        return count;
    },
    reduceArray: function(values, remove, amount){
        var ret = [];
        
        for (var i = 0; i < values.length; i++){
            if (values[i] == remove && amount > 0) amount--;
            else ret.push(values[i]);
        }
        
        return ret;
    },
    computeBigScore: function(base, occurences){
        return base*(Math.pow(2, occurences-3));
    }
};