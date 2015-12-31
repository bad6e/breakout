const Ball = require('./balls');
const Paddle = require('./paddle');
const Brick = require('./brick');
const Colors = require('./colors');
const Canvas = require('./canvas');
const Styles = require('./styles');
const Sounds = require('./sounds');

var Game = function(){
  var canvas = new Canvas();
  this.size = { x: canvas.canvas.width, y: canvas.canvas.height };
  var paddle = new Paddle(this);
  var bricks = createBricks(this);
  this.bodies = createBall(this, paddle, bricks).concat(paddle).concat(bricks);
  this.score = 0;
  this.lives = 3;
  this.status = true;
  Styles.displayStyles('click-start', 'inline');
  Styles.countDownText("#delay-title", '3 2 1', 0, 600);

  setTimeout(function () {
    this.tick(canvas);
    Styles.displayStyles('click-start', 'none');
  }.bind(this), 4500);
};

var createBall = function(game, paddle, bricks) {
  var ball = [];
  ball.push(new Ball(game, paddle, bricks));
  return ball;
};

var createBricks = function(game) {
  var bricks = [];
  for (var i = 0; i < 54; i++) {
    var x = (Math.floor(i / 6)) * 87;
    var y = 70 + (i % 6) * 18;
    bricks.push(new Brick(game, {x: x, y: y}));
  }
  return bricks;
};

Game.prototype = {

  tick: function(canvas) {
    this.move();
    this.draw(canvas);
    this.drawScore(canvas);
    this.drawLives(canvas);
    requestAnimationFrame(this.tick.bind(this, canvas));
  },

  move: function() {
    if (!this.status) { return; }
    for (var i = 0; i < this.bodies.length; i++) {
      if (this.bodies[i].move !== undefined) {
        this.bodies[i].move();
      }
    }
  },

  draw: function(canvas) {
    canvas.clearRect(0, 0, this.size.x, this.size.y);
    var colorList = Colors.colors();
    for (var i = 0; i < this.bodies.length; i++) {
      if (this.bodies[i].draw !== undefined) {
        this.bodies[i].draw(canvas, colorList[i].toString());
      }
    }
  },

  drawScore: function(canvas) {
    canvas.font = '16px monospace';
    canvas.fillStyle = "#0095DD ";
    canvas.fillText("Score: "+ this.score, 8, 20);
  },

  drawLives: function(canvas) {
    canvas.font = '16px monospace';
    canvas.fillStyle = "#0095DD ";
    canvas.fillText("Lives: "+ this.lives, 700, 20);
  },

  updateGame: function() {
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

  pause: function() {
    this.bodies[0].dx = 0;
    this.bodies[0].dy = 0;
    this.status = false;
  },

  resetGame: function() {
    this.bodies[0].startAngle = 0;
    this.bodies[0].x = this.size.x/2;
    this.bodies[0].y = this.size.y-25;
    this.bodies[1].position = { x: this.size.x/2-75, y: this.size.y-15 };
  },

  winGame: function() {
    Sounds.stopTheme();
    Styles.displayStyles('winning', 'inline');
    Sounds.win();
    Styles.showText("#won-title", "Congratulations You Won!", 0, 150);
    Styles.showText("#final-score", "Final Score: " + this.score, 0, 150);
    Styles.getId('restart-win').onclick = function(){
      document.location.reload();
    };
  },

  loseGame: function() {
    this.bodies[0].dy = 0;
    Sounds.stopTheme();
    Sounds.stopWall();
    Styles.displayStyles('losing', 'inline');
    Sounds.death();
    Styles.showText("#lose-title", "Sorry, you died!", 0, 150);
    Styles.showText("#final-score-lose", "Final Score: " + this.score, 0, 150);
    Styles.getId('restart-lose').onclick = function(){
      document.location.reload();
    };
  }
};

module.exports = Game;