const Location = require('./location');
const inherits = require('util').inherits;
const EventEmitter = require('events');
const Listener = require('./listener');

function Ball(game, paddle, bricks) {
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
  this.listener = new Listener();
  EventEmitter.call(this);

  this.on('paddleCollision', this.listener.paddleCollision);
  this.on('brickCollision', this.listener.brickCollision);
  this.on('wallCollision', this.listener.wallCollision);
  this.on('topCollision', this.listener.topCollision);
};

  inherits(Ball, EventEmitter)

  Ball.prototype.draw = function(canvas) {
    canvas.beginPath();
    canvas.arc(this.x, this.y, this.radius, this.startAngle, Math.PI*2);
    canvas.fillStyle = "#F00000";
    canvas.fill();
    canvas.closePath();
  }

  Ball.prototype.move = function () {
    this.collisionDetectionBricks();
    this.collisionDetectionWalls();

    if (this.ballBelowPaddle()) {
      this.collisionDetectionPaddle();
    }

    this.moveBallOnXAxis();
    this.moveBallOnYAxis();
  }

  Ball.prototype.ballBelowPaddle = function() {
    return !!(this.y + this.dy > this.gameSize.y - (this.radius * 2))
  }

  Ball.prototype.moveBallOnXAxis = function(){
    this.x += this.dx;
  }

  Ball.prototype.moveBallOnYAxis = function(){
    this.y += this.dy;
  }

  Ball.prototype.reverseXAxisDirection = function(){
    this.dx = -this.dx;
  }

  Ball.prototype.reverseYAxisDirection = function(){
    this.dy = -this.dy;
  }

  Ball.prototype.collisionDetectionBricks = function() {
    for (var i = 0; i < this.bricks.length; i++) {
      if(this.ballHitsBrick(i)){
        this.emit('brickCollision')
        this.reverseYAxisDirection();
        this.removeHitBrick(i);
        this.remainingBrickNumber();
      }
    }
  }

  Ball.prototype.removeHitBrick = function(i){
    this.bricks[i].status = 0;
    this.bricks.splice(i, 1);
  }

  Ball.prototype.remainingBrickNumber = function(){
    if (this.bricks.length === 0) {
      this.game.score += 10;
      this.game.winGame();
    } else {
      this.game.score += 10;
      return this.dy;
    }
  }

  Ball.prototype.ballHitsBrick = function(i){
    return !!((this.ballXGreaterThanBrickX(i)) &&
    (this.ballXLessThanBrickXPlusBrickWidth(i)) &&
    (this.ballYLessThanBrickYPlusBrickHeight(i)) &&
    (this.ballYGreaterThanBrickYMinusBrickHeight(i)))
  }

  Ball.prototype.brickWidth = function(){
    return this.bricks[0].size.x;
  }

  Ball.prototype.brickHeight = function(){
    return this.bricks[0].size.y;
  }

  Ball.prototype.ballXGreaterThanBrickX =  function(i){
    return !!(this.x > this.bricks[i].position.x);
  }

  Ball.prototype.ballXLessThanBrickXPlusBrickWidth =  function(i){
    return !!(this.x < this.bricks[i].position.x + this.brickWidth());
  }

  Ball.prototype.ballYLessThanBrickYPlusBrickHeight = function(i){
    return !!(this.y - this.radius < this.bricks[i].position.y + this.brickHeight());
  }

  Ball.prototype.ballYGreaterThanBrickYMinusBrickHeight = function(i){
    return !!(this.y + this.radius > this.bricks[i].position.y - this.brickHeight());
  }

  Ball.prototype.collisionDetectionWalls = function() {
    if(Location.sideWalls(this)) {
      this.emit('wallCollision')
      this.reverseXAxisDirection();
    }

    if(Location.topWall(this)) {
      this.emit('topCollision')
      this.reverseYAxisDirection();
    }

    if(Location.bottomWall(this)) {
      this.game.status = false;
      this.game.updateGame();
    }
  }

  Ball.prototype.collisionDetectionPaddle = function() {

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
  }

  Ball.prototype.setSlope = function(dx, dy) {
    this.emit('paddleCollision')
    this.dx = dx
    this.dy = dy
  }

module.exports = Ball;
