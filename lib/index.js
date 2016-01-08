const Game = require('./game');
const Styles = require('./styles');
const Sounds = require('./sounds');

var Start = function() {
  Sounds.theme();
  Styles.displayStyles('game-start', 'inline');
  Styles.displayStyles('start-title', 'inline');
  $( "#game-start" ).click(function() {
    new Game();
    Styles.displayStyles('game-start', 'none');
  });
};

module.exports = Start;

new Start();