const nextColor = require('./colors')();

var Brick = function(game, position) {
  this.game = game;
  this.position = position;
  this.size = {x: 87, y: 18};
  this.status = 1;
  this.color = nextColor();
};

Brick.prototype = {
  draw: function(canvas) {
    if(this.status === 1) {
      canvas.beginPath();
      canvas.rect(this.position.x, this.position.y, this.size.x, this.size.y);
      canvas.fillStyle = this.color;
      canvas.fill();
      canvas.closePath();
    }
  }
};

module.exports = Brick;