<?php

class Zilch{
    private $dices = array();
    private $scores = array(ZILCH_FIGURE_ZILCH=>0,
                            ZILCH_FIGURE_ONE=>100,
                            ZILCH_FIGURE_FIVE=>50,
                            ZILCH_FIGURE_TRIPLEONE=>1000,
                            ZILCH_FIGURE_TRIPLETWO=>200,
                            ZILCH_FIGURE_TRIPLETHREE=>300,
                            ZILCH_FIGURE_TRIPLEFOUR=>400,
                            ZILCH_FIGURE_TRIPLEFIVE=>500,
                            ZILCH_FIGURE_TRIPLESIX=>600,
                            ZILCH_FIGURE_RUN=>1500,
                            ZILCH_FIGURE_THREEPAIRS=>1500,
                            ZILCH_FIGURE_NOTHING=>500);
    
    public function __construct($dices){
        $this->dices = $dices;
    }
    
    public function rollDice($i){
        return $this->dices[$i-1]->roll();
    }
    
    public function lockDice($i){
        $this->dices[$i-1]->setLock(true);
    }
    
    public function unlockDice($i){
        $this->dices[$i-1]->setLock(false);
    }
    
    public function getDiceValue($i){
        return $this->dices[$i-1]->getValue();
    }
    
    public function getDiceLock($i){
        return $this->dices[$i-1]->getLock();
    }
    
    public function countLocked(){
        $count = 0;
        
        foreach ($this->dices as $dice){
            if ($dice->getLock()) $count++;
        }
        
        return $count;
    }
    
    /**
     * Calcul la nouvelle somme bankable
    */
    public function getBankable($dices){
        //la, on va juste prendre en comtpe les dès que l'on veux locker, mais qui ne le sont pas encore
        $values = array();
        foreach ($dices as $dice){
            if (!$this->dices[$dice-1]->getLock()) array_push($values, $this->dices[$dice-1]->getValue());
        }
        
        return $this->resolveCombination($values);
    }
    
    /**
     * Regarde si les dès restants permettent de faire une combinaison
    */
    public function resolvable(){
        $values = array();
        
        foreach ($this->dices as $dice){
            if (!$dice->getLock()) array_push($values, $dice->getValue());
        }
        
        if ($this->resolveCombination($values) > 0) return true;
        else return false;
    }
    
    /**
     * Vérifie si tous les dès passés en parametre sont utiles
    */
    public function everythingResolves($indexes){
        $dices = array();
        foreach ($indexes as $index){
            array_push($dices, $this->dices[$index-1]->getValue());
        }
        
        $ones = $this->countOccurences(1, $dices);
        $twos = $this->countOccurences(2, $dices);
        $threes = $this->countOccurences(3, $dices);
        $fours = $this->countOccurences(4, $dices);
        $fives = $this->countOccurences(5, $dices);
        $sixes = $this->countOccurences(6, $dices);
        
        if (count($dices) === 6){
            //on teste les combinaisons a 6 chiffres
            if ($ones === 1 &&
                $twos === 1 &&
                $threes === 1 &&
                $fours === 1 &&
                $fives === 1 &&
                $sixes === 1){
                //run, tout est utilisé
                $dices = array();
            }
            
            $pairs = 0;
            $pairs += floor($ones/2);
            $pairs += floor($twos/2);
            $pairs += floor($threes/2);
            $pairs += floor($fours/2);
            $pairs += floor($fives/2);
            $pairs += floor($sixes/2);
            
            if ($pairs >= 3){
                $dices = array();
            }
        }
        
        //on vire les 1, les 5 et les triples
        if ($ones > 0) $dices = array_diff($dices, array(1));
        if ($twos >= 3) $dices = array_diff($dices, array(2));
        if ($threes >= 3) $dices = array_diff($dices, array(3));
        if ($fours >= 3) $dices = array_diff($dices, array(4));
        if ($fives > 0) $dices = array_diff($dices, array(5));
        if ($sixes >= 3) $dices = array_diff($dices, array(6));
        
        if (count($dices) === 6){
            //il reste les 6 dès, c'est un nothing, beau gosse.
            $dices = array();
        }
        
        return (count($dices) === 0) ? true : false;
    }
    
    /**
     *Analyse une combinaison de valeurs et renvoi le plus gros score faisable
    */
    private function resolveCombination($values){
        $score = 0;
        $ones = $this->countOccurences(1, $values);
        $twos = $this->countOccurences(2, $values);
        $threes = $this->countOccurences(3, $values);
        $fours = $this->countOccurences(4, $values);
        $fives = $this->countOccurences(5, $values);
        $sixes = $this->countOccurences(6, $values);
        
        if (count($values) === 6){
            //analyser les figures qui ont besoin de 6 dès
            if ($ones === 1 &&
                $twos === 1 &&
                $threes === 1 &&
                $fours === 1 &&
                $fives === 1 &&
                $sixes === 1){
                
                //suite 123456
                $score = $this->scores[ZILCH_FIGURE_RUN];
                //bon et puis on peut arreter la, pas d'autres combinaisons possibles
                return $score;
            }
            
            //3 paires
            $pairs = 0;
            $pairs += floor($ones/2);
            $pairs += floor($twos/2);
            $pairs += floor($threes/2);
            $pairs += floor($fours/2);
            $pairs += floor($fives/2);
            $pairs += floor($sixes/2);
            
            if ($pairs >= 3){
                $score = $this->scores[ZILCH_FIGURE_THREEPAIRS];
                return $score;
            }
        }
        
        //combinsisons a moins de 6 des, il faut compter les machins
        //on peut peut etre factoriser un peu plus
        if ($ones > 0){
            if ($ones >= 3){
                $rest = $this->reduceArray($values, 1, $ones);
                $score = max($score, $this->computeBigScore($this->scores[ZILCH_FIGURE_TRIPLEONE], $ones)+$this->resolveCombination($rest));
                return $score;
            }
            else {
                $rest = $this->reduceArray($values, 1, 1);
                $add = $this->scores[ZILCH_FIGURE_ONE]+$this->resolveCombination($rest);
                $score = max($score, $add);
                return $score;
            }
        }
        
        if ($fives > 0){
            if ($fives >= 3){
                $rest = $this->reduceArray($values, 5, $fives);
                $score = max($score, $this->computeBigScore($this->scores[ZILCH_FIGURE_TRIPLEFIVE], $fives)+$this->resolveCombination($rest));
                return $score;
            }
            else {
                $rest = $this->reduceArray($values, 5, 1);
                $add = $this->scores[ZILCH_FIGURE_FIVE]+$this->resolveCombination($rest);
                $score = max($score, $add);
                return $score;
            }
        }
        
        if ($twos >= 3){
            $rest = $this->reduceArray($values, 2, $twos);
            $score = max($score, $this->computeBigScore($this->scores[ZILCH_FIGURE_TRIPLETWO], $twos)+$this->resolveCombination($rest));
            return $score;
        }
        
        if ($threes >= 3){
            $rest = $this->reduceArray($values, 3, $threes);
            $score = max($score, $this->computeBigScore($this->scores[ZILCH_FIGURE_TRIPLETHREE], $threes)+$this->resolveCombination($rest));
            return $score;
        }
        
        if ($fours >= 3){
            $rest = $this->reduceArray($values, 4, $fours);
            $score = max($score, $this->computeBigScore($this->scores[ZILCH_FIGURE_TRIPLEFOUR], $fours)+$this->resolveCombination($rest));
            return $score;
        }
        
        if ($sixes >= 3){
            $rest = $this->reduceArray($values, 6, $sixes);
            $score = max($score, $this->computeBigScore($this->scores[ZILCH_FIGURE_TRIPLESIX], $sixes)+$this->resolveCombination($rest));
            return $score;
        }
        
        if ($score === 0 && count($values) === 6){
            $score = $this->scores[ZILCH_FIGURE_NOTHING];
            return $score;
        }
        
        return $score;
    }
    
    private function reduceArray($array, $remove, $amount){
        $return = array();
        
        foreach ($array as $value){
            if ($value === $remove && $amount > 0) $amount--;
            else array_push($return, $value);
        }
        
        return $return;
    }
    
    private function countOccurences($value, $dices){
        $count = 0;
        foreach ($dices as $dice){
            if ($dice === $value) $count++;
        }
        return $count;
    }
    
    private function computeBigScore($base, $occurences){
        return $base*(pow(2, $occurences-3));
    }
}