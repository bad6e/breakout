const Sounds = require('./sounds');

function Listener() {
  this.paddleCollision =  function(){
    Sounds.paddle();
  },

  this.brickCollision = function(){
    Sounds.brick();
  },

  this.wallCollision = function(){
    Sounds.wall();
  },

  this.topCollision = function(){
    Sounds.top();
  },

  this.stopTheme = function(){
    Sounds.stopTheme();
  },

  this.win = function(){
    Sounds.win();
  },

  this.death = function(){
    Sounds.death();
  },

  this.stopWall = function(){
    Sounds.stopWall();
  }
}

module.exports = Listener;
