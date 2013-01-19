<?php

class Dice{
    private $value = 0;
    private $lock = false;
    
    public function __construct($value, $lock){
        $this->value = (int)$value;
        $this->lock = (bool)$lock;
    }
    
    public function getValue(){
        return $this->value;
    }
    public function roll(){
        if (!$this->lock) $this->value = rand(1, 6);
        return $this->value;
    }
    
    public function getLock(){
        return $this->lock;
    }
    public function setLock($lock){
        $this->lock = (bool)$lock;
    }
}