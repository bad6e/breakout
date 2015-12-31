module.exports = {
  colors: function(){
    var colors = ["#CC3ED0","#F95255","#FE801A","#FF911B","#10AC24","#6667FF"];

    function colorWheel(){
      var wheel = [];
      for (var i = 0; i < 10; i++) {
        wheel.push(colors);
      };
      var wheel = [].concat.apply([], wheel);
      return wheel;
    }
    return colorWheel();
  }
};