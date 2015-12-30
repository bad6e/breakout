const chai = require('chai');
const assert = chai.assert;

const Ball = require('../lib/balls');
const Game = require('../lib/game');
const Paddle = require('../lib/paddle');
const Brick = require('../lib/brick');

describe('game', function () {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  it('should instantiate a new game', function () {
    let game = new Game();
    assert.isObject(game);
  });

  it('should have a game size - x cord', function () {
    let game = new Game();
    assert.equal(game.size.x, 782);
  });

  it('should have a game size - y cord', function () {
    let game = new Game();
    assert.equal(game.size.y, 520);
  });

  it('should have a bodies array', function () {
    let game = new Game();
    assert.isArray(game.bodies, 'paddle');
  });

  it('should have a ball object in the bodies array', function () {
    let game = new Game();
    assert.instanceOf(game.bodies[0], Ball);
  });

  it('should have a paddle object in the bodies array', function () {
    let game = new Game();
    assert.instanceOf(game.bodies[1], Paddle);
  });

  it('should have a brick object in the bodies array', function () {
    let game = new Game();
    assert.instanceOf(game.bodies[2], Brick);
  });

  it('should have a 56 objects in the bodies array', function () {
    let game = new Game();
    assert.equal(game.bodies.length, 56);
  });

  it('should have score defaulted to 0', function () {
    let game = new Game();
    assert.equal(game.score, 0);
  });

  it('should have lives defaulted to 3', function () {
    let game = new Game();
    assert.equal(game.lives, 3);
  });

  it('should have a game status defaulted to true', function () {
    let game = new Game();
    assert.equal(game.status, true);
  });

  it('should have move method', function () {
    let game = new Game();
    assert.ok(game.move);
  });

  it('should move the ball in the bodies array', function () {
    let game = new Game();
    game.status = false;
    game.move();
    assert.equal(game.bodies[0].x, 391);
  });

  it('should have draw method', function () {
    let game = new Game();
    assert.ok(game.draw);
  });

  it('should draw the score', function () {
    let game = new Game();
    game.drawScore(ctx);
    assert.equal(game.score, 0);
  });

  it('should draw the lives', function () {
    let game = new Game();
    game.drawLives(ctx);
    assert.equal(game.lives, 3);
  });

  it('should update the game by removing one life', function () {
    let game = new Game();
    game.updateGame();
    assert.equal(game.lives, 2);
  });

  it('should pause the game with status of false', function () {
    let game = new Game();
    game.pause();
    assert.equal(game.status, false);
  });

  it('should pause the ball movement with a x slope of zero', function () {
    let game = new Game();
    game.pause();
    assert.equal(game.bodies[0].dx, 0);
  });

  it('should pause the ball movement with y slope of zero', function () {
    let game = new Game();
    game.pause();
    assert.equal(game.bodies[0].dy, 0);
  });

  it('should reset the game with a start angle of zero for the ball', function () {
    let game = new Game();
    game.resetGame();
    assert.equal(game.bodies[0].startAngle, 0);
  });

  it('should reset the game ball with a x position of canvas width divided by two', function () {
    let game = new Game();
    game.resetGame();
    assert.equal(game.bodies[0].x, 391);
  });

  it('should reset the game ball with a y position of canvas height minus 25 pixels', function () {
    let game = new Game();
    game.resetGame();
    assert.equal(game.bodies[0].y, 495);
  });

  it('should reset the game bricks with a x position', function () {
    let game = new Game();
    game.resetGame();
    assert.equal(game.bodies[1].position.x, 316);
  });

  it('should reset the game bricks with a y position', function () {
    let game = new Game();
    game.resetGame();
    assert.equal(game.bodies[1].position.y, 505);
  });
});