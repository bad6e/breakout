module.exports = {

  displayStyles: function(location, style){
    document.getElementById(location).style.display = style;
  },

  getId: function(id){
    return document.getElementById(id);
  },

  showText: function (target, message, index, interval) {
    if (index < message.length) {
      $(target).append(message[index++]);
      var self = this;
      setTimeout(function () {
        self.showText(target, message, index, interval);
      }, interval);
    }
  },

  countDownText: function(target, message, index, interval) {
    if (index < message.length) {
      $(target).append(message[index++]);
      setTimeout(function() {
        $(target).empty()
        if (index == message.length) {
          setTimeout(function(){
            $(target).append("GO!!")
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
