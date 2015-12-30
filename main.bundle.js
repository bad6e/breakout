/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Start = __webpack_require__(1);

	new Start();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Game = __webpack_require__(2);
	var Styles = __webpack_require__(10);
	var Sounds = __webpack_require__(4);

	var Start = function Start() {
	  Sounds.theme();
	  Styles.displayStyles('game-start', 'inline');
	  Styles.displayStyles('start-title', 'inline');
	  $("#game-start").click(function () {
	    new Game();
	    Styles.displayStyles('game-start', 'none');
	  });
	};

	module.exports = Start;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Ball = __webpack_require__(3);
	var Paddle = __webpack_require__(6);
	var Brick = __webpack_require__(7);
	var Colors = __webpack_require__(8);
	var Canvas = __webpack_require__(9);
	var Styles = __webpack_require__(10);
	var Sounds = __webpack_require__(4);

	var Game = function Game() {
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

	  setTimeout((function () {
	    this.tick(canvas);
	    Styles.displayStyles('click-start', 'none');
	  }).bind(this), 4500);
	};

	var createBall = function createBall(game, paddle, bricks) {
	  var ball = [];
	  ball.push(new Ball(game, paddle, bricks));
	  return ball;
	};

	var createBricks = function createBricks(game) {
	  var bricks = [];
	  for (var i = 0; i < 54; i++) {
	    var x = Math.floor(i / 6) * 87;
	    var y = 70 + i % 6 * 18;
	    bricks.push(new Brick(game, { x: x, y: y }));
	  }
	  return bricks;
	};

	Game.prototype = {

	  tick: function tick(canvas) {
	    this.move();
	    this.draw(canvas);
	    this.drawScore(canvas);
	    this.drawLives(canvas);
	    requestAnimationFrame(this.tick.bind(this, canvas));
	  },

	  move: function move() {
	    if (!this.status) {
	      return;
	    }
	    for (var i = 0; i < this.bodies.length; i++) {
	      if (this.bodies[i].move !== undefined) {
	        this.bodies[i].move();
	      }
	    }
	  },

	  draw: function draw(canvas) {
	    canvas.clearRect(0, 0, this.size.x, this.size.y);
	    var colorList = new Colors();
	    for (var i = 0; i < this.bodies.length; i++) {
	      if (this.bodies[i].draw !== undefined) {
	        this.bodies[i].draw(canvas, colorList[i].toString());
	      }
	    }
	  },

	  drawScore: function drawScore(canvas) {
	    canvas.font = '16px monospace';
	    canvas.fillStyle = "#0095DD ";
	    canvas.fillText("Score: " + this.score, 8, 20);
	  },

	  drawLives: function drawLives(canvas) {
	    canvas.font = '16px monospace';
	    canvas.fillStyle = "#0095DD ";
	    canvas.fillText("Lives: " + this.lives, 700, 20);
	  },

	  updateGame: function updateGame() {
	    this.lives -= 1;

	    if (this.lives > 0) {
	      this.pause();
	      this.resetGame();
	      Styles.displayStyles('ball-reset', 'inline');
	      setTimeout((function () {
	        this.status = true;
	        this.bodies[0].dy = 10;
	        Styles.displayStyles('ball-reset', 'none');
	      }).bind(this), 2000);
	    } else {
	      this.loseGame();
	    }
	  },

	  pause: function pause() {
	    this.bodies[0].dx = 0;
	    this.bodies[0].dy = 0;
	    this.status = false;
	  },

	  resetGame: function resetGame() {
	    this.bodies[0].startAngle = 0;
	    this.bodies[0].x = this.size.x / 2;
	    this.bodies[0].y = this.size.y - 25;
	    this.bodies[1].position = { x: this.size.x / 2 - 75, y: this.size.y - 15 };
	  },

	  winGame: function winGame() {
	    Sounds.stopTheme();
	    Styles.displayStyles('winning', 'inline');
	    Sounds.win();
	    Styles.showText("#won-title", "Congratulations You Won!", 0, 150);
	    Styles.showText("#final-score", "Final Score: " + this.score, 0, 150);
	    Styles.getId('restart-win').onclick = function () {
	      document.location.reload();
	    };
	  },

	  loseGame: function loseGame() {
	    this.bodies[0].dy = 0;
	    Sounds.stopTheme();
	    Sounds.stopWall();
	    Styles.displayStyles('losing', 'inline');
	    Sounds.death();
	    Styles.showText("#lose-title", "Sorry, you died!", 0, 150);
	    Styles.showText("#final-score-lose", "Final Score: " + this.score, 0, 150);
	    Styles.getId('restart-lose').onclick = function () {
	      document.location.reload();
	    };
	  }
	};

	module.exports = Game;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Sounds = __webpack_require__(4);
	var Location = __webpack_require__(5);

	var Ball = function Ball(game, paddle, bricks) {
	  this.game = game;
	  this.paddle = paddle;
	  this.startAngle = 0;
	  this.x = game.size.x / 2;
	  this.y = game.size.y - 25;
	  this.canvasHeightOffset = 8;
	  this.radius = 10;
	  this.gameSize = { x: this.game.size.x, y: this.game.size.y };
	  this.bricks = bricks;
	  this.dy = 10;
	  this.dx = -10;
	};

	Ball.prototype = {

	  draw: function draw(canvas) {
	    canvas.beginPath();
	    canvas.arc(this.x, this.y, this.radius, this.startAngle, Math.PI * 2);
	    canvas.fillStyle = "#F00000";
	    canvas.fill();
	    canvas.closePath();
	  },

	  move: function move() {
	    this.collisionDetectionBricks();
	    this.collisionDetectionWalls();

	    if (this.y + this.dy > this.gameSize.y - this.radius * 2) {
	      this.collisionDetectionPaddle();
	    }

	    this.x += this.dx;
	    this.y += this.dy;
	  },

	  collisionDetectionPaddle: function collisionDetectionPaddle() {
	    if (Location.outterLeft(this)) {
	      Sounds.paddle();
	      this.setOutterLeftSlope();
	    }
	    if (Location.innerLeft(this)) {
	      Sounds.paddle();
	      this.setInnerLeftSlope();
	    }
	    if (Location.centerLeft(this)) {
	      Sounds.paddle();
	      this.setCenterLeftSlope();
	    }
	    if (Location.centerRight(this)) {
	      Sounds.paddle();
	      this.setCenterRightSlope();
	    }
	    if (Location.innerRight(this)) {
	      Sounds.paddle();
	      this.setInnerRightSlope();
	    }
	    if (Location.outterRight(this)) {
	      Sounds.paddle();
	      this.setOutterRightSlope();
	    }
	  },

	  collisionDetectionBricks: function collisionDetectionBricks() {
	    var brickHeight = this.bricks[0].size.y;
	    var brickWidth = this.bricks[0].size.x;

	    for (var i = 0; i < this.bricks.length; i++) {
	      if (this.x > this.bricks[i].position.x && this.x < this.bricks[i].position.x + brickWidth && this.y - this.radius < this.bricks[i].position.y + brickHeight && this.y + this.radius > this.bricks[i].position.y - brickHeight) {
	        Sounds.brick();
	        this.dy = -this.dy;
	        this.bricks[i].status = 0;
	        this.bricks.splice(i, 1);

	        if (this.bricks.length === 0) {
	          this.game.score += 10;
	          this.game.winGame();
	        } else {
	          this.game.score += 10;
	          return this.dy;
	        }
	      }
	    }
	  },

	  collisionDetectionWalls: function collisionDetectionWalls() {
	    if (Location.sideWalls(this)) {
	      Sounds.wall();
	      this.dx = -this.dx;
	    }

	    if (Location.topWall(this)) {
	      Sounds.top();
	      this.dy = -this.dy;
	    }

	    if (Location.bottomWall(this)) {
	      this.game.status = false;
	      this.game.updateGame();
	    }
	  },

	  setOutterLeftSlope: function setOutterLeftSlope() {
	    this.dx = -13;
	    this.dy = -8;
	  },

	  setInnerLeftSlope: function setInnerLeftSlope() {
	    this.dx = -11;
	    this.dy = -9;
	  },

	  setCenterLeftSlope: function setCenterLeftSlope() {
	    this.dx = -10;
	    this.dy = -10;
	  },

	  setCenterRightSlope: function setCenterRightSlope() {
	    this.dx = 10;
	    this.dy = -10;
	  },

	  setInnerRightSlope: function setInnerRightSlope() {
	    this.dx = 11;
	    this.dy = -9;
	  },

	  setOutterRightSlope: function setOutterRightSlope() {
	    this.dx = 13;
	    this.dy = -8;
	  }
	};

	module.exports = Ball;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {

	  paddle: function paddle() {
	    var paddleSound = document.getElementById("paddle-sound");
	    paddleSound.load();
	    paddleSound.play();
	  },

	  wall: function wall() {
	    var wallSound = document.getElementById("wall-sound");
	    wallSound.load();
	    wallSound.play();
	  },

	  top: function top() {
	    var topSound = document.getElementById("top-sound");
	    topSound.load();
	    topSound.play();
	  },

	  death: function death() {
	    var deathSound = document.getElementById("death-sound");
	    deathSound.load();
	    deathSound.play();
	  },

	  brick: function brick() {
	    var brickSound = document.getElementById("bricks-sound");
	    brickSound.load();
	    brickSound.play();
	  },

	  win: function win() {
	    var winSound = document.getElementById("win-sound");
	    winSound.load();
	    winSound.play();
	  },

	  theme: function theme() {
	    var themeSound = document.getElementById("theme-sound");
	    themeSound.volume = 0.45;
	    themeSound.load();
	    themeSound.play();
	  },

	  stopTheme: function stopTheme() {
	    var themeSound = document.getElementById("theme-sound");
	    themeSound.load();
	    themeSound.pause();
	  },

	  stopWall: function stopWall() {
	    var wallSound = document.getElementById("wall-sound");
	    wallSound.load();
	    wallSound.pause();
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {

	  outterLeft: function outterLeft(ball) {
	    if (ball.x >= ball.paddle.position.x - ball.radius && ball.x <= ball.paddle.position.x + 24) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  innerLeft: function innerLeft(ball) {
	    if (ball.x >= ball.paddle.position.x + 25 && ball.x <= ball.paddle.position.x + 49) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  centerLeft: function centerLeft(ball) {
	    if (ball.x >= ball.paddle.position.x + 50 && ball.x <= ball.paddle.position.x + 74) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  centerRight: function centerRight(ball) {
	    if (ball.x >= ball.paddle.position.x + 75 && ball.x <= ball.paddle.position.x + 99) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  innerRight: function innerRight(ball) {
	    if (ball.x >= ball.paddle.position.x + 100 && ball.x <= ball.paddle.position.x + 124) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  outterRight: function outterRight(ball) {
	    if (ball.x >= ball.paddle.position.x + 125 && ball.x <= ball.paddle.position.x + 150 + ball.radius) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  sideWalls: function sideWalls(ball) {
	    if (ball.x + ball.dx > ball.gameSize.x - ball.radius || ball.x + ball.dx < ball.radius) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  topWall: function topWall(ball) {
	    if (ball.y - ball.canvasHeightOffset + ball.dy < ball.radius) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  bottomWall: function bottomWall(ball) {
	    if (ball.y > 520) {
	      return true;
	    } else {
	      return false;
	    }
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var Paddle = function Paddle(game) {
	  this.game = game;
	  this.size = { x: 150, y: 15 };
	  this.gameSize = { x: this.game.size.x, y: this.game.size.y };
	  this.position = { x: this.game.size.x / 2 - 75, y: this.game.size.y - 15 };
	  this.keyboarder = new Keyboarder();
	};

	Paddle.prototype = {

	  draw: function draw(canvas) {
	    canvas.beginPath();
	    canvas.rect(this.position.x, this.position.y, this.size.x, this.size.y);
	    canvas.fillStyle = "#D03ACD";
	    canvas.fill();
	    canvas.closePath();
	  },

	  move: function move() {
	    var paddle_move_speed = 19;

	    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && this.position.x > 0) {
	      this.position.x -= paddle_move_speed;
	    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && this.position.x < this.gameSize.x - this.size.x) {
	      this.position.x += paddle_move_speed;
	    }
	  }
	};

	var Keyboarder = function Keyboarder() {
	  var keyState = {};
	  document.addEventListener('keydown', function (e) {
	    keyState[e.keyCode] = true;
	  });

	  document.addEventListener('keyup', function (e) {
	    keyState[e.keyCode] = false;
	  });

	  this.isDown = function (keyCode) {
	    return keyState[keyCode] === true;
	  };

	  this.KEYS = { LEFT: 37, RIGHT: 39 };
	};

	module.exports = Paddle;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	var Brick = function Brick(game, position) {
	  this.game = game;
	  this.position = position;
	  this.size = { x: 87, y: 18 };
	  this.status = 1;
	};

	Brick.prototype = {
	  draw: function draw(canvas, color) {
	    if (this.status === 1) {
	      canvas.beginPath();
	      canvas.rect(this.position.x, this.position.y, this.size.x, this.size.y);
	      canvas.fillStyle = color;
	      canvas.fill();
	      canvas.closePath();
	    }
	  }
	};

	module.exports = Brick;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	var Colors = function Colors() {
	  var colorWheel = [];
	  for (var i = 0; i < 10; i++) {
	    if (i < 10) {
	      colorWheel.push("#CC3ED0");
	      colorWheel.push("#F95255");
	      colorWheel.push("#FE801A");
	      colorWheel.push("#FF911B");
	      colorWheel.push("#10AC24");
	      colorWheel.push("#6667FF");
	    }
	  }
	  return colorWheel;
	};

	module.exports = Colors;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	var Canvas = function Canvas() {
	  if (document.getElementById('canvas')) {
	    return document.getElementById('canvas').getContext('2d');
	  } else {
	    var context = document.createElement('canvas');
	    context.width = 782;
	    context.height = 520;
	    return context.getContext('2d');
	  }
	};

	module.exports = Canvas;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {

	  displayStyles: function displayStyles(location, style) {
	    document.getElementById(location).style.display = style;
	  },

	  getId: function getId(id) {
	    return document.getElementById(id);
	  },

	  showText: function showText(target, message, index, interval) {
	    if (index < message.length) {
	      $(target).append(message[index++]);
	      var self = this;
	      setTimeout(function () {
	        self.showText(target, message, index, interval);
	      }, interval);
	    }
	  },

	  countDownText: function countDownText(target, message, index, interval) {
	    if (index < message.length) {
	      $(target).append(message[index++]);
	      setTimeout(function () {
	        $(target).empty();
	        if (index == message.length) {
	          setTimeout(function () {
	            $(target).append("GO!!");
	          }, interval);
	        }
	      }, interval);
	      var self = this;
	      setTimeout(function () {
	        self.countDownText(target, message, index, interval);
	      }, interval);
	    }
	  }
	};

/***/ }
/******/ ]);