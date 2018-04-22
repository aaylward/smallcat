(() => {
  const canvas = document.querySelector("#pong");
  const ctx = canvas.getContext("2d");
  const initialDx = 2;
  const initialDy = 2;
  const ball = {x: canvas.width / 2, y: canvas.height / 2, dx: initialDx, dy: initialDy, r: 10};
  const paddleHeight = 80;
  const paddleWidth = 7;
  const paddleStart = (canvas.height - paddleHeight) / 2;
  const us = {x: canvas.width - paddleWidth, y: paddleStart, color: "red"};
  const them = {x: 0, y: paddleStart, color: "green"};
  const playerSpeed = 8;
  const keys = {UP: 38, DOWN: 40};
  const modes = {SINGLE_PLAYER: "single-player", MULTI_PLAYER: "multi-player", MULTI_LOCAL: "local-multi-player"}

  let bounces = -1;
  let time = 0;
  let lastHit = undefined;
  
  let upPressed = false;
  let downPressed = false;

  const keyDownHandler = (e) => {
    if (e.keyCode === keys.UP) {
      upPressed = true;
    }
    if (e.keyCode === keys.DOWN) {
      downPressed = true;
    }
  };

  const keyUpHandler = (e) => {
    if (e.keyCode === keys.UP) {
      upPressed = false;
    }
    if (e.keyCode === keys.DOWN) {
      downPressed = false;
    }
  };

  const touchHandler = (e) => {
    if (e.touches) {
      const touch = e.touches[0]; // no multitouch support for now
      if (touch.pageY > us.y) {
        downPressed = true;
      }
      if (touch.pageY < us.y) {
        upPressed = true;
      }
    }
  };

  const touchEndHandler = () => {
    upPressed = false;
    downPressed = false;
  };

  canvas.addEventListener("touchstart", touchHandler);
  canvas.addEventListener("touchmove", touchHandler);
  canvas.addEventListener("touchend", touchEndHandler);
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  const drawPlayer = (p) => {
    ctx.beginPath();
    ctx.rect(p.x, p.y, paddleWidth, paddleHeight);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.closePath();
  };

  const drawBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "rgba(240, 90, 240, 1.0)";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayer(us);
    drawPlayer(them);
  };

  const weHit = () => {
    return ball.x > canvas.width - ball.r - paddleWidth && ball.y >= us.y && ball.y < us.y + paddleHeight;
  };

  const theyHit = () => {
    return ball.x < ball.r + paddleWidth && ball.y >= them.y && ball.y < them.y + paddleHeight;
  };

  const moveX = () => {
    ball.x += ball.dx;
  };

  const moveY = () => {
    ball.y += ball.dy;
  };

  const speedUp = () => {
    const sign = ball.dx < 0 ? -1 : 1;
    ball.dx = sign * (Math.abs(ball.dx) + 1);
  };

  const changeDirection = () => {
    ball.dx = -ball.dx;
  };

  const moveUs = () => {
    if (upPressed && !downPressed) {
      us.y = Math.max(0, us.y - playerSpeed);
    }
    if (downPressed && !upPressed) {
      us.y = Math.min(canvas.height - paddleHeight, us.y + playerSpeed);
    }
  };

  const moveThem = () => {
    if (ball.dx > 0) {
      if (them.y + (paddleHeight / 2) < (canvas.height - paddleHeight) / 2) {
        them.y += 2;
      } else if (them.y + (paddleHeight / 2) > (canvas.height - paddleHeight) / 2){
        them.y -= 2;
      }
    } else {
      if (ball.y > them.y) {
        them.y += 2;
      } else if (ball.y < them.y) {
        them.y -= 2;
      }
    }
  };

  const processHit = (player) => {
    const dySign = ball.dy < 0 ? -1 : 1;

    if (ball.y < player.y + (paddleHeight / 3)) {
      ball.dy = dySign * (Math.abs(ball.dy) + 2);
    } else if (ball.y > player.y + (2 * paddleHeight / 3)) {
      ball.dy = dySign * (Math.abs(ball.dy) - 2);
    }
  }

  const processCollisions = () => {
    const ourHit = weHit();
    const theirHit = theyHit();
    if (ourHit || theirHit) {
      lastHit = time;
      changeDirection();
      moveX();

      if (ourHit) {
        processHit(us);
      } else {
        processHit(them);
      }

      if (++bounces % 10 === 0) {
        speedUp();
      }
    }

    if (ball.y > canvas.height - ball.r || ball.y < ball.r) {
      ball.dy = -ball.dy;
    }
  }

  const moveBall = () => {
    moveX();
    moveY();
  }

  const update = () => {
    moveUs();
    moveThem();

    processCollisions();

    moveBall();
  };

  const score = () => {
    return ball.x < ball.r || ball.x > canvas.width - ball.r;
  };

  const pause = () => false;

  const tick = () => {
    time++;
    if (score()) {
      console.log("win")
      return;
    }
    update();
    draw();
    requestAnimationFrame(tick);
  };

  tick();
})()
