const Sounds = require('./sounds');
const Location = require('./location');

var Ball = function(game, paddle, bricks) {
  this.game = game;
  this.paddle = paddle;
  this.startAngle = 0;
  this.x = game.size.x/2;
  this.y = game.size.y-25;
  this.canvasHeightOffset = 8;
  this.radius = 10;
  this.gameSize = {x: this.game.size.x, y: this.game.size.y};
  this.bricks = bricks;
  this.dy = 10;
};

Ball.prototype = {

  draw: function(canvas) {
    canvas.beginPath();
    canvas.arc(this.x, this.y, this.radius, this.startAngle, Math.PI*2);
    canvas.fillStyle = "#F00000";
    canvas.fill();
    canvas.closePath();
  },

  move: function () {
    this.collisionDetectionBricks();
    this.collisionDetectionWalls();

    if (this.ballBelowPaddle()) {
      this.collisionDetectionPaddle();
    }

    this.moveBallOnXAxis();
    this.moveBallOnYAxis();
  },

  ballBelowPaddle: function() {
    return !!(this.y + this.dy > this.gameSize.y - (this.radius * 2))
  },

  moveBallOnXAxis: function(){
    this.x += this.dx;
  },

  moveBallOnYAxis: function(){
    this.y += this.dy;
  },

  reverseXAxisDirection: function(){
    this.dx = -this.dx;
  },

  reverseYAxisDirection: function(){
    this.dy = -this.dy;
  },

  collisionDetectionBricks: function() {
    for (var i = 0; i < this.bricks.length; i++) {
      if(this.ballHitsBrick(i)){
        Sounds.brick();
        this.reverseYAxisDirection();
        this.removeHitBrick(i);
        this.remainingBrickNumber();
      }
    }
  },

  removeHitBrick: function(i){
    this.bricks[i].status = 0;
    this.bricks.splice(i, 1);
  },

  remainingBrickNumber: function(){
    if (this.bricks.length === 0) {
      this.game.score += 10;
      this.game.winGame();
    } else {
      this.game.score += 10;
      return this.dy;
    }
  },

  ballHitsBrick: function(i){
    return !!((this.ballXGreaterThanBrickX(i)) &&
    (this.ballXLessThanBrickXPlusBrickWidth(i)) &&
    (this.ballYLessThanBrickYPlusBrickHeight(i)) &&
    (this.ballYGreaterThanBrickYMinusBrickHeight(i)))
  },

  brickWidth: function(){
    return this.bricks[0].size.x;
  },

  brickHeight: function(){
    return this.bricks[0].size.y;
  },

  ballXGreaterThanBrickX: function(i){
    return !!(this.x > this.bricks[i].position.x);
  },

  ballXLessThanBrickXPlusBrickWidth: function(i){
    return !!(this.x < this.bricks[i].position.x + this.brickWidth());
  },

  ballYLessThanBrickYPlusBrickHeight: function(i){
    return !!(this.y - this.radius < this.bricks[i].position.y + this.brickHeight());
  },

  ballYGreaterThanBrickYMinusBrickHeight: function(i){
    return !!(this.y + this.radius > this.bricks[i].position.y - this.brickHeight());
  },

  collisionDetectionWalls: function() {
    if(Location.sideWalls(this)) {
      Sounds.wall();
      this.reverseXAxisDirection();
    }

    if(Location.topWall(this)) {
      Sounds.top();
      this.reverseYAxisDirection();
    }

    if(Location.bottomWall(this)) {
      this.game.status = false;
      this.game.updateGame();
    }
  },

  collisionDetectionPaddle: function() {
    if(Location.outerLeft(this)) {
      this.setSlope(-13, -8);
    }
    if(Location.innerLeft(this)) {
      this.setSlope(-11, -9);
    }
    if(Location.centerLeft(this)) {
      this.setSlope(-10, -10);
    }
    if(Location.centerRight(this)) {
      this.setSlope(10, -10);
    }
    if(Location.innerRight(this)) {
      this.setSlope(11, -9);
    }
    if(Location.outerRight(this)) {
      this.setSlope(13, -8);
    }
  },

  setSlope: function(dx, dy) {
    Sounds.paddle();
    this.dx = dx
    this.dy = dy
  },
};

module.exports = Ball;