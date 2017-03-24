// vertical scrolling game that a fox character will move through
// and eventually collect coins



var width = 320,
    height = 500,
    gLoop,
    points = 0,
    state = true,
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;

var clear = function(){
  ctx.fillStyle = '#d0e7f9';

  ctx.beginPath();
  ctx.rect(0,0,width,height);
  ctx.closePath();
  ctx.fill();
}

var howManyCircles = 10, circles = [];

for(var i=0; i< howManyCircles; i++){
  circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random()/2]);
  }
var drawCircles = function(){
    for(var i=0; i < howManyCircles; i++){
      ctx.fillStyle = 'rgba(255,255,255, ' + circles[i][3] +')';
      ctx.beginPath();
      ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
      ctx.closePath;
      ctx.fill();
    }
  }
var moveCircles = function(yAxis){
  for (var i = 0; i < howManyCircles; i++){
    if (circles[i][1] - circles[i][2] > height){
    circles[i][0] = Math.random() * width;
    circles[i][2] = Math.random() * 100;
    circles[i][1] = 0 - circles[i][2];
    circles[i][3] = Math.random()/2
  } else {
    circles[i][1] += yAxis;
    }
  }
}



/////////////////// player

var player = new (function(){
  var that = this;

  that.image = new Image();
  that.image.src = "images/fox_32.png";
  that.width = 32;
  that.height = 32;

  that.X=0;
  that.Y=0;
  that.isJumping = false;
  that.isFalling = false;
  that.jumpSpeed = 0;
  that.fallSpeed = 0;

  that.jump = function(){
    if (!that.isJumping && !that.isFalling){
      that.fallSpeed = 0;
      that.isJumping = true;
      that.jumpSpeed = 17;
    }
  }

  that.checkJump = function(){
    if (that.Y > height * 0.4) {
    that.setPosition(that.X, that.Y - that.jumpSpeed);
    } else {
      if (that.jumpSpeed > 10)
        points ++;

      moveCircles(that.jumpSpeed * 0.5);
      platforms.forEach(function(platform, index){
        platform.y += that.jumpSpeed;
        if (platform.y > height){
          var type = Math.floor(Math.random() * 5);
          if (type == 0)
            type = 1
           else
            type = 0;
            platforms[index] = new Platform(Math.random() * (width - platformWidth), platform.y - height, type);

        }
      });
    }
    that.jumpSpeed --;
    if (that.jumpSpeed == 0){
      that.isJumping = false;
      that.isFalling = true;
      that.fallSpeed = 1;
    }
  }



  that.fallStop = function(){
    that.isFalling = false;
    that.fallSpeed = 0;
    that.jump();
  }

    that.checkFall = function(){
    if(that.Y < height - that.height){
      that.setPosition(that.X, that.Y + that.fallSpeed);
      that.fallSpeed ++;
    } else {
      if (points == 0)
      that.fallStop;
       else
        gameOver();

    }
  }

  that.setPosition = function(x,y){
    that.X = x;
    that.Y=y;
  }

  that.moveLeft = function(){
    if (that.X > 0){
      that.setPosition(that.X - 5, that.Y);
    }
  }

  that.moveRight = function(){
    if (that.X + that.width < width){
      that.setPosition(that.X + 5, that.Y)
    }
  }

  that.draw = function(){
    try {
      ctx.drawImage(that.image, 0, 0, that.width, that.height, that.X, that.Y, that.width, that.height);

    } catch(error){

    }
  }
})();

player.setPosition( Math.floor((width - player.width)/2), height - player.height );
player.jump();

document.onmousemove = function(event){
  if(player.X + canvas.offsetLeft > event.pageX){
    player.moveLeft();
  } else if (player.X + canvas.offsetLeft < event.pageX){
    player.moveRight();
  }
}
///////////// obstacles

var numberOfPlatforms = 7,
  platforms = [],
  platformWidth = 70,
  platformHeight = 20;
var Platform = function(x,y,type){
  var that = this;
  that.firstColor = "#ff8c00";
  that.secondColor = "#eeee00";
  that.onCollide = function(){
    player.fallStop();
  };
  if (type === 1){
    that.firstColor = "#aadd00";
    that.secondColor = "#698b22";
    that.onCollide = function(){
      player.fallStop();
      player.jumpSpeed = 50;
    };
  }
  that.x = Math.floor(x);
  that.y = y;
  that.type = type;
  that.isMoving = Math.floor(Math.random() * 2);
  that.direction = Math.floor(Math.random() * 2) ? -1 : 1;

    that.draw = function(){
      ctx.fillStyle = 'rgba(255,255,255,1)';
      var gradient = ctx.createRadialGradient(that.x + (platformWidth/2), that.y + (platformHeight/2), 5, that.x + (platformWidth/2), that.y + (platformHeight/2), 45);
        gradient.addColorStop(0,that.firstColor);
        gradient.addColorStop(1, that.secondColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(that.x, that.y, platformWidth, platformHeight);


  };
  return that;
};

var generatePlatforms = function(){
  var position = 0, type;
  for (var i = 0; i < numberOfPlatforms; i++){
    type = Math.floor(Math.random()*5);
    if (type == 0)
      type = 1;
    else
      type = 0;
    platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
    if (position < height - platformHeight)
        position += Math.floor(height/numberOfPlatforms)
  }
}();

var checkCollision = function(){
  platforms.forEach(function(e, ind){
    if (
      (player.isFalling) &&
      (player.X < e.x + platformWidth) &&
      (player.X + player.width > e.x) &&
      (player.Y + player.height > e.y) &&
      (player.Y + player.height < e.y + platformHeight)
      ) {
      e.onCollide();
    }
  })
}

/////////////// game loop
var gameLoop = function(){
  clear();
  // moveCircles(5);
  drawCircles();
  if (player.isJumping) player.checkJump();
  if (player.isFalling) player.checkFall();
  player.draw();
  platforms.forEach(function(platform, index){
    if (platform.isMoving){
      if (platform.x < 0){
        platform.direction = 1;
      } else if (platform.x > width - platformWidth){
        platform.direction = -1;
      }
      platform.x += platform.direction * (index/2) * Math.floor(points/100);
    }
    platform.draw();
  });
  checkCollision();
  ctx.fillStyle = "black";
  ctx.fillText("Points:" + points, 10, height-10);
  if (state)
    gLoop = setTimeout(gameLoop, 1000/50);

}

var gameOver = function(){
  state = false;
  clearTimeout(gLoop);
  setTimeout(function(){
    clear();
    ctx.fillStyle = "black";
    ctx.font = "10pt Helvetica";
    ctx.fillText("GAME OVER", width/2 - 60, height/2 - 50);
    ctx.fillText("SCORE: " + points, width/2 - 60, height/2 - 30);
  }, 100)
}
gameLoop();
