module.exports = {

  outerLeft: function(ball) {
    return !!((ball.x >= ball.paddle.position.x - ball.radius) && (ball.x <= ball.paddle.position.x + 24))
  },

  innerLeft: function(ball) {
    return !!((ball.x >= ball.paddle.position.x + 25) && (ball.x <= ball.paddle.position.x + 49))
  },

  centerLeft: function(ball) {
    return !!((ball.x >= ball.paddle.position.x + 50) && (ball.x <= ball.paddle.position.x + 74))
  },

  centerRight: function(ball) {
    return !!((ball.x >= ball.paddle.position.x + 75) && (ball.x <= ball.paddle.position.x + 99))
  },

  innerRight: function(ball) {
    return !!((ball.x >= ball.paddle.position.x + 100) && (ball.x <= ball.paddle.position.x + 124))
  },

  outterRight: function(ball) {
    return !!((ball.x >= ball.paddle.position.x + 125) && (ball.x <= ball.paddle.position.x + 150 + ball.radius))
  },

  sideWalls: function(ball) {
    return !!(ball.x + ball.dx > ball.gameSize.x-ball.radius || ball.x + ball.dx < ball.radius)
  },

  topWall: function(ball) {
    return !!((ball.y - ball.canvasHeightOffset) + ball.dy < ball.radius)
  },

  bottomWall: function(ball) {
    return !!(ball.y > 520)
  }
};