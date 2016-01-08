module.exports = function () {
  var currentIndex = 0;
  var colors = ["#CC3ED0","#F95255","#FE801A","#FF911B","#10AC24","#6667FF"];

  return function () {
    return colors[currentIndex++ % colors.length]
  }
}