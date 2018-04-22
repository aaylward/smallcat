(() => {
  const canvas = document.querySelector("#pong");
  const ctx = canvas.getContext("2d");
  const initialDx = 2;
  const initialDy = 2;
  const ball = {x: canvas.width / 2, y: canvas.height / 2, dx: initialDx, dy: initialDy, r: 10};
  const paddleHeight = 80;
  const paddleWidth = 7;
  const paddleStart = (canvas.height - paddleHeight) / 2;
  const us = {x: canvas.width - paddleWidth, y: paddleStart, color: "red", lives: 3};
  const them = {x: 0, y: paddleStart, color: "green", lives: 3};
  const playerSpeed = 8;
  const keys = {UP: 38, DOWN: 40, SPACE: 32};
  const modes = {SINGLE_PLAYER: "single-player", MULTI_PLAYER: "multi-player", MULTI_LOCAL: "local-multi-player"}

  const makeAudio = (file) => {
    const el = document.createElement("audio");
    el.setAttribute("src", file);
    return el;
  }

  const boo = makeAudio("boo.wav");
  const mah = makeAudio("mah.wav");
  const ping = makeAudio("ping.wav");
  const woo = makeAudio("woo.wav");

  let bounces = -1;
  let time = 0;
  
  let paused = true;
  let upPressed = false;
  let downPressed = false;

  const keyDownHandler = (e) => {
    if (e.keyCode === keys.UP) {
      upPressed = true;
    }
    if (e.keyCode === keys.DOWN) {
      downPressed = true;
    }
    if (e.keyCode === keys.SPACE) {
      paused = !paused;
    }
    return false;
  };

  const keyUpHandler = (e) => {
    if (e.keyCode === keys.UP) {
      upPressed = false;
    }
    if (e.keyCode === keys.DOWN) {
      downPressed = false;
    }
    return false;
  };

  const touchHandler = (e) => {
    if (paused) {
      paused = false;
    }

    if (e.touches) {
      const touch = e.touches[0]; // no multitouch support for now
      if (touch.pageY > us.y) {
        downPressed = true;
      }
      if (touch.pageY < us.y) {
        upPressed = true;
      }
    }
    return false;
  };

  const touchEndHandler = () => {
    upPressed = false;
    downPressed = false;
    return false;
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

  const weHit = () => {
    return ball.x + ball.r >= canvas.width - paddleWidth && ball.y >= us.y && ball.y < us.y + paddleHeight;
  };

  const theyHit = () => {
    return ball.x - ball.r <= paddleWidth && ball.y >= them.y && ball.y < them.y + paddleHeight;
  }

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

  const moveThem = (mode) => {
    if (ball.dx > 0) {
      if (them.y + (paddleHeight / 2) < canvas.height / 2) {
        them.y += 2;
      } else if (them.y + (paddleHeight / 2) > canvas.height / 2) {
        them.y -= 2;
      }
    } else {
      if (ball.y > them.y + (paddleHeight / 2)) {
        if (ball.y - (them.y + (paddleHeight / 2)) > 3) {
          them.y += 4;
        }
      } else if (ball.y < them.y + (paddleHeight / 2)) {
        them.y -= 4;
      }
    }
  };

  const processHit = (player) => {
    const dySign = ball.dy < 0 ? -1 : 1;

    if (ball.y < player.y + (paddleHeight / 3)) {
      ball.dy -= 2;
    } else if (ball.y > player.y + (2 * paddleHeight / 3)) {
      ball.dy += 2;
    }
  }

  const processCollisions = () => {
    const ourHit = weHit();
    const theirHit = theyHit();
    if (ourHit || theirHit) {
      changeDirection();
      moveX();

      if (ourHit) {
        processHit(us);
        boo.play();
      } else {
        processHit(them);
        ping.play();
      }

      if (++bounces % 3 === 0) {
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
    if (paused) {
      return;
    }

    moveUs();
    moveThem(modes.SINGLE_PLAYER);
    moveBall();

    processCollisions();
  };

  const score = () => {
    if (ball.x < ball.r) {
      them.lives--;
      woo.play();
      return true;
    }

    if (ball.x > canvas.width - ball.r) {
      us.lives--;
      mah.play();
      return true;
    }

    return false;
  };

  const pause = () => false;

  const drawLife = (x) => {
    const y = 20;
    const radius = 15;
    const smileRadius = 10;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(x + radius - smileRadius, y);
    ctx.arc(x, y, smileRadius, 0, Math.PI, false);  // Mouth (clockwise)
    ctx.moveTo(x-5, y - 5);
    ctx.arc(x - 5, y - 5, 4, 0, Math.PI * 2, true);  // Left eye
    ctx.moveTo(x + 5, y - 5);
    ctx.arc(x + 5, y - 5, 4, 0, Math.PI * 2, true);  // Right eye
    ctx.stroke();
  }

  const drawLives = () => {
    for (let i=0; i<them.lives; i++) {
      drawLife(20 + 40*i);
    }

    for (let i=0; i<us.lives; i++) {
      drawLife(canvas.width - 20 - 40*i);
    }
  }

  const draw = () => {
    if (paused) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLives();
    drawBall();
    drawPlayer(us);
    drawPlayer(them);
  };

  const weWin = () => {
    return them.lives === 0;
  }

  const theyWin = () => {
    return us.lives === 0;
  }

  const resetLives = () => {
    us.lives = 3;
    them.lives = 3;
  }

  const tick = () => {
    time++;
    update();
    draw();
    if (score()) {
      paused = true;
      if (weWin()) {
        ctx.fillText("You Win!!", (canvas.width / 2) - 15, canvas.height / 2);
        ctx.fillText("Press Space to Play Again", (canvas.width / 2) - 50, canvas.height / 2 + 40);
        resetLives();
      } else if (theyWin()) {
        ctx.fillText("They Win...", (canvas.width / 2) - 15, canvas.height / 2);
        ctx.fillText("Press Space to Play Again", (canvas.width / 2) - 50, canvas.height / 2 + 40);
        resetLives();
      } else {
        ctx.fillText("Press Space to Continue", (canvas.width / 2) - 50, canvas.height / 2 + 40);
      }
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = initialDx;
      ball.dy = initialDy;
    }
    requestAnimationFrame(tick);
  };

  drawLives();
  drawBall();
  drawPlayer(us);
  drawPlayer(them);
  ctx.fillText("Press Space (or touch) to Start!", (canvas.width / 2) - 70, canvas.height / 2 + 40);
  requestAnimationFrame(tick);
})()
