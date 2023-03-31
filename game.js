// canvas
let canvas;
let canvasWidth = 360;
let canvasHeight = 640;
let context;

// bird
let dWidth = 54;
let dHeight = 34;
let dX = canvasWidth / 8;
let dY = canvasHeight / 2;

let bird = 
{
      x: dX,
      y: dY,
      width: dWidth,
      height: dHeight,
}


// pipes
let pipeArray = [];
let pipeWidth = 65;
let pipeHeight = 512;
let pipeX = canvasWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// movement
let velocityX = -1;
let velocityY = 0;
let gravity = 0.1;

let gameOver=false;

let score=0;





window.onload = (event) => {
   
      
      canvas = document.getElementById("canvas")
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      context = canvas.getContext("2d");

      // bird position
      // context.fillStyle="green"
      // context.fillRect(bird.x,bird.y,bird.width,bird.height);

      // load bird
      dImg = new Image();
      dImg.src = "./bird.png";
      dImg.onload = function () {
            context.drawImage(dImg, bird.x, bird.y, bird.width, bird.height)
      }
      topPipeImg = new Image();
      topPipeImg.src = "./topPiller.png";

      bottomPipeImg = new Image();
      bottomPipeImg.src = "./bottomPiller.png";

      requestAnimationFrame(update)
      setInterval(placePipes, 1500);//1.5 sec

      document.addEventListener("keydown", movebird);

}

function update() {
      
      requestAnimationFrame(update)
      if(gameOver)
      {
            return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height)

      // bird
      velocityY += gravity;
      
      // bird.y+=velocityY;
      bird.y = Math.max(bird.y + velocityY, 0)//Cant go top of canvas
      context.drawImage(dImg, bird.x, bird.y, bird.width, bird.height);

      if(bird.y>canvas.height-40)
      {
            gameOver=true;
      }
      // pipes
      for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if(!pipe.passed && bird.x>pipe.x+pipe.width)
            {
                  score+=0.5;
                  pipe.passed=true;
            }

            if(detectCollision(pipe,bird)){
                  gameOver=true;
            }
      }
      //clear pipes
      while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
            pipeArray.shift();
      }

      //score
      context.fillStyle="white";
      context.font="45px sans-serif";
      context.fillText(score, 10,45);
      if(gameOver)
      {
            context.fillText("GAME OVER",50,300)
      }

}

function placePipes() {
      if(gameOver){
            return;
      }
      let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
      let openSpace = canvas.height / 3;

      let topPipe = {
            img: topPipeImg,
            x: pipeX,
            y: randomPipeY,
            width: pipeWidth,
            height: pipeHeight,
            passed: false
      }
      pipeArray.push(topPipe);

      let bottomPipe = {
            img: bottomPipeImg,
            x: pipeX,
            y: randomPipeY + pipeHeight + openSpace,
            width: pipeWidth, 
            height: pipeHeight,
            passes: false
      }
      pipeArray.push(bottomPipe)
}



function movebird(e) {
      if (e.code == "Space" || e.code == "ArrowUp") {
            velocityY = -4;
      }
      if(gameOver)
      {
            bird.y=dY;
            pipeArray=[];
            score=0;
            gameOver=false;
      }
      
}

function detectCollision(a, b) {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}