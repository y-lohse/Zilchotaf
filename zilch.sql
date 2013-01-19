-- phpMyAdmin SQL Dump
-- version 3.2.0.1
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Lun 29 Août 2011 à 13:05
-- Version du serveur: 5.1.36
-- Version de PHP: 5.3.0

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `dev`
--

-- --------------------------------------------------------

--
-- Structure de la table `zilch_game`
--

CREATE TABLE IF NOT EXISTS `zilch_game` (
  `game_id` int(11) NOT NULL AUTO_INCREMENT,
  `game_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `game_state` int(11) DEFAULT NULL,
  `game_bankable` int(11) DEFAULT NULL,
  `game_dice1` int(11) DEFAULT NULL,
  `game_dice1_lock` tinyint(4) DEFAULT NULL,
  `game_dice2` int(11) DEFAULT NULL,
  `game_dice2_lock` tinyint(4) DEFAULT NULL,
  `game_dice3` int(11) DEFAULT NULL,
  `game_dice3_lock` tinyint(4) DEFAULT NULL,
  `game_dice4` int(11) DEFAULT NULL,
  `game_dice4_lock` tinyint(4) DEFAULT NULL,
  `game_dice5` int(11) DEFAULT NULL,
  `game_dice5_lock` tinyint(4) DEFAULT NULL,
  `game_dice6` int(11) DEFAULT NULL,
  `game_dice6_lock` tinyint(4) DEFAULT NULL,
  `game_lastround` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Contenu de la table `zilch_game`
--

INSERT INTO `zilch_game` (`game_id`, `game_name`, `game_state`, `game_bankable`, `game_dice1`, `game_dice1_lock`, `game_dice2`, `game_dice2_lock`, `game_dice3`, `game_dice3_lock`, `game_dice4`, `game_dice4_lock`, `game_dice5`, `game_dice5_lock`, `game_dice6`, `game_dice6_lock`, `game_lastround`) VALUES
(1, 'a', 2, -1, 2, 0, 1, 0, 2, 0, 5, 0, 1, 0, 2, 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `zilch_player`
--

CREATE TABLE IF NOT EXISTS `zilch_player` (
  `player_id` int(11) NOT NULL AUTO_INCREMENT,
  `player_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `player_keepalive` int(11) DEFAULT NULL,
  `player_score` int(11) DEFAULT NULL,
  `player_game` int(11) NOT NULL,
  PRIMARY KEY (`player_id`,`player_game`),
  KEY `player_game` (`player_game`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Contenu de la table `zilch_player`
--

INSERT INTO `zilch_player` (`player_id`, `player_name`, `player_keepalive`, `player_score`, `player_game`) VALUES
(1, 'j1', 1314351965, 350, 1),
(2, 'j3', 1314351967, 1150, 1);
