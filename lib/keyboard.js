var Keyboarder = function() {
  var keyState = {};
  document.addEventListener('keydown', function(e) {
    keyState[e.keyCode] = true;
  });

  document.addEventListener('keyup', function(e) {
    keyState[e.keyCode] = false;
  });

  this.isDown = function(keyCode) {
    return keyState[keyCode] === true;
  };

  this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
};

module.exports = Keyboarder;