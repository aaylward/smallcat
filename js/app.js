(() => {
  const canvas = document.querySelector("#pong");
  const ctx = canvas.getContext("2d");
  const ball = {x: 140, y: 100, dx: 2, dy: 2, r: 10};
  const paddleHeight = 60;
  const paddleStart = (canvas.height - paddleHeight) / 2;
  const us = {x: canvas.width - 7, y: paddleStart, color: "red"};
  const them = {x: 0, y: paddleStart, color: "green"};

  const drawPlayer = (p) => {
    ctx.beginPath();
    ctx.rect(p.x, p.y, 7, paddleHeight);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.closePath();
  }

  const drawBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "rgba(240, 90, 240, 1.0)";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayer(us);
    drawPlayer(them);
  }

  const weHit = () => {
    return ball.x > canvas.width - ball.r && ball.y > us.y && ball.y < us.y + paddleHeight;
  }

  const theyHit = () => {
    return ball.x < ball.r && ball.y > them.y && ball.y < them.y + paddleHeight;
  }

  const update = () => {
    if (weHit() || theyHit()) {
      ball.dx = -ball.dx;
    }

    if (ball.y > canvas.height - ball.r || ball.y < ball.r) {
      ball.dy = -ball.dy;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
  }

  const score = () => {
    return ball.x < ball.r || ball.x > canvas.width - ball.r;
  };

  const pause = () => false;

  const tick = () => {
    draw();
    update();
    if (score()) {
      console.log("win")
      pause();
    } else {
      requestAnimationFrame(tick);
    }
  }

  tick();
})()
