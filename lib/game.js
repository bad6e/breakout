const Ball = require('./balls');
const Paddle = require('./paddle');
const Brick = require('./brick');
const Canvas = require('./canvas');
const Styles = require('./styles');
const inherits = require('util').inherits;
const EventEmitter = require('events');
const Listener = require('./listener')

var Game = function(){
  var canvas = new Canvas();
  this.size = { x: canvas.canvas.width, y: canvas.canvas.height };
  var paddle = new Paddle(this);
  var bricks = createBricks(this);
  this.ball = new Ball(this, paddle, bricks);
  this.bodies = [this.ball].concat(paddle).concat(bricks);
  this.listener = new Listener();
  this.score = 0;
  this.lives = 3;
  this.status = true;
  Styles.displayStyles('click-start', 'inline');
  Styles.countDownText("#delay-title", '3 2 1', 0, 600);


  this.on('stopTheme', this.listener.stopTheme);
  this.on('win', this.listener.win);
  this.on('death', this.listener.death);
  this.on('stopWall', this.listener.stopWall);


  setTimeout(function () {
    this.tick(canvas);
    Styles.displayStyles('click-start', 'none');
  }.bind(this), 4500);
};

inherits(Game, EventEmitter)

var createBricks = function(game) {
  var bricks = [];
  for (var i = 0; i < 54; i++) {
    var x = (Math.floor(i / 6)) * 87;
    var y = 70 + (i % 6) * 18;
    bricks.push(new Brick(game, {x: x, y: y}));
  }
  return bricks;
};


Game.prototype.tick = function(canvas) {
  this.move();
  this.draw(canvas);
  this.drawScore(canvas);
  this.drawLives(canvas);
  requestAnimationFrame(this.tick.bind(this, canvas));
},

Game.prototype.move = function() {
  if (!this.status) { return; }
  for (var i = 0; i < this.bodies.length; i++) {
    if (this.bodies[i].move !== undefined) {
      this.bodies[i].move();
    }
  }
},

Game.prototype.draw = function(canvas) {
  canvas.clearRect(0, 0, this.size.x, this.size.y);
  for (var i = 0; i < this.bodies.length; i++) {
    if (this.bodies[i].draw !== undefined) {
      this.bodies[i].draw(canvas);
    }
  }
},

Game.prototype.drawScore =  function(canvas) {
  canvas.font = '16px monospace';
  canvas.fillStyle = "#0095DD ";
  canvas.fillText("Score: "+ this.score, 8, 20);
},

Game.prototype.drawLives = function(canvas) {
  canvas.font = '16px monospace';
  canvas.fillStyle = "#0095DD ";
  canvas.fillText("Lives: "+ this.lives, 700, 20);
},

Game.prototype.updateGame = function() {
  this.lives -= 1;

  if(this.lives > 0) {
    this.pause();
    this.resetGame();
    Styles.displayStyles('ball-reset', 'inline');
    setTimeout(function () {
      this.status = true;
      this.bodies[0].dy = 10;
      Styles.displayStyles('ball-reset', 'none');
    }.bind(this), 2000);
  }
  else {
    this.loseGame();
  }
},

Game.prototype.pause = function() {
  this.bodies[0].dx = 0;
  this.bodies[0].dy = 0;
  this.status = false;
},

Game.prototype.resetGame = function() {
  this.bodies[0].startAngle = 0;
  this.bodies[0].x = this.size.x/2;
  this.bodies[0].y = this.size.y-25;
  this.bodies[1].position = { x: this.size.x/2-75, y: this.size.y-15 };
},

Game.prototype.winGame = function() {
  this.emit('stopTheme')
  Styles.displayStyles('winning', 'inline');
  this.emit('win')
  Styles.showText("#won-title", "Congratulations You Won!", 0, 150);
  Styles.showText("#final-score", "Final Score: " + this.score, 0, 150);
  Styles.getId('restart-win').onclick = function(){
    document.location.reload();
  };
},

Game.prototype.loseGame = function() {
  this.bodies[0].dy = 0;
  this.emit('stopTheme')
  this.emit('stopWall')
  Styles.displayStyles('losing', 'inline');
  this.emit('death')
  Styles.showText("#lose-title", "Sorry, you died!", 0, 150);
  Styles.showText("#final-score-lose", "Final Score: " + this.score, 0, 150);
  Styles.getId('restart-lose').onclick = function(){
    document.location.reload();
  };
}

module.exports = Game;