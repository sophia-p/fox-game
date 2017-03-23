// vertical scrolling game that a fox character will move through
// and eventually collect coins



var width = 320,
    height = 500,
    canvas = getElementById("canvas"),
    ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;

var clear = function(){
  ctx.fillStyle = '#d0e7f9';
  ctx.clearREct(0,0,width, height);
  ctx.beginPath();
  ctx.rect(0,0,width,height);
  ctx.closePath();
  ctx.fill();
}

var howManyCircles = 10, circles = [];

for(var i=0; i< howManyCircles; i++){
  circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random()/2]);
  var drawCircles = function(){
    for(var i=0; i < howManyCircles; i++){
      ctx.fillStyle = 'rgba(255,255,255, ' + circles[i][3] +')';
      ctx.beginPath();
      ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
      ctx.closePath;
      ctx.fill();
    }
  }
}
